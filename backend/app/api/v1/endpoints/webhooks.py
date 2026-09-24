from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Call, Contact, AuditLog
import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/voice")
async def voice_post_call_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Ingests post-call webhook directly from Voice AI.
    Extracts audio recording URL, latency, transcript, and custom trade analysis.
    """
    payload = await request.json()
    call_id = payload.get("call_id") or f"call_{int(datetime.datetime.now().timestamp())}"
    
    # Extract latency, duration, cost
    duration_ms = payload.get("duration_ms", 60000)
    duration_sec = int(duration_ms / 1000)
    m = duration_sec // 60
    s = duration_sec % 60
    duration_str = f"{m}m {s:02d}s" if m > 0 else f"{s}s"
    
    cost_val = payload.get("call_cost", {}).get("total_cost", 0.50)
    cost_str = f"£{cost_val:.4f}"
    
    now_str = datetime.datetime.now().strftime("%b %d, %Y, %I:%M %p")
    
    # Save Call to DB
    new_call = Call(
        id=call_id,
        datetime_str=now_str,
        duration_seconds=duration_sec,
        duration_str=duration_str,
        cost=cost_str,
        caller_phone=payload.get("from_number", "+447000000000"),
        destination_phone=payload.get("to_number", "+447414112588"),
        contact_name=payload.get("call_analysis", {}).get("custom_analysis_data", {}).get("caller_name", "Caller"),
        agent_name="Essex Heating Inbound",
        direction="Inbound" if payload.get("direction") != "outbound" else "Outbound",
        status="Answered",
        end_reason=payload.get("disconnection_reason", "Agent Hung Up"),
        outcome=payload.get("call_analysis", {}).get("custom_analysis_data", {}).get("call_outcome", "Enquiry Captured"),
        call_status=payload.get("disconnection_reason", "Completed Normally"),
        call_success="Success" if payload.get("call_analysis", {}).get("call_successful", True) else "Failed",
        user_sentiment=payload.get("call_analysis", {}).get("user_sentiment", "Neutral"),
        disconnection_reason=payload.get("disconnection_reason", "Completed Normally"),
        latency=f"{payload.get('e2e_latency', {}).get('p50', 740):.2f}ms",
        custom_analysis=payload.get("call_analysis", {}).get("custom_analysis_data", {}),
        summary=payload.get("call_analysis", {}).get("call_summary", "Call completed via Voice AI engine."),
        transcript=payload.get("transcript_object", [])
    )
    db.add(new_call)

    # Log to audit trail
    audit = AuditLog(
        datetime_str=now_str,
        user="Voice Webhook Engine",
        action="Call Ingested",
        entity="Call",
        entity_name=call_id,
        details=f"Stored call record ({duration_str}, {cost_str})"
    )
    db.add(audit)
    db.commit()

    return {"status": "success", "call_id": call_id}

@router.post("/precall")
async def voice_precall_lookup(request: Request, db: Session = Depends(get_db)):
    """
    Voice Inbound Pre-Call Webhook:
    Injects dynamic variables (contact details, office clock, known job details)
    so agent knows caller before saying a word.
    """
    payload = await request.json()
    from_number = payload.get("from_number", "")
    
    # Check GHL / Local Contact DB
    contact = db.query(Contact).filter(Contact.phone == from_number).first()
    
    # Determine UK Office Hours (8am - 5pm London time)
    now_uk = datetime.datetime.now()
    office_open = "yes" if 8 <= now_uk.hour < 17 and now_uk.weekday() < 5 else "no"
    
    dynamic_vars = {
        "office_open": office_open,
        "current_time": now_uk.strftime("%H:%M"),
        "today": now_uk.strftime("%a"),
        "timezone": "Europe/London"
    }

    metadata = {"lookup_reason": "ok"}
    
    if contact:
        dynamic_vars["first_name"] = contact.name.split()[0]
        dynamic_vars["known_details"] = f"Name: {contact.name}\nPostcode: {contact.postcode}\nPast Notes: {contact.notes}"
        metadata["contact_id"] = contact.id

    return {
        "call_inbound": {
            "dynamic_variables": dynamic_vars,
            "metadata": metadata
        }
    }
