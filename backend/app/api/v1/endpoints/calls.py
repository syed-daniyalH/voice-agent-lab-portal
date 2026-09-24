from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Call, AuditLog
from app.schemas.schemas import CallResponse, CallFeedbackUpdate
from typing import List, Optional
import io
import csv
import datetime

router = APIRouter()

@router.get("", response_model=List[CallResponse])
def list_calls(
    agent: Optional[str] = None,
    direction: Optional[str] = None,
    status: Optional[str] = None,
    sentiment: Optional[str] = None,
    outcome: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Call)
    if agent and agent != "all":
        query = query.filter(Call.agent_name == agent)
    if direction and direction != "all":
        query = query.filter(Call.direction == direction)
    if status and status != "all":
        query = query.filter(Call.status == status)
    if sentiment and sentiment != "all":
        query = query.filter(Call.user_sentiment == sentiment)
    if outcome and outcome != "all":
        query = query.filter(Call.outcome.ilike(f"%{outcome.split()[0]}%"))
    if search:
        s = f"%{search}%"
        query = query.filter((Call.caller_phone.ilike(s)) | (Call.contact_name.ilike(s)) | (Call.summary.ilike(s)))
    
    return query.order_by(Call.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/export-csv")
def export_calls_csv(db: Session = Depends(get_db)):
    calls = db.query(Call).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["CallID", "DateTime", "Duration", "Cost", "From", "To", "Contact", "Agent", "Direction", "Status", "Outcome"])
    for c in calls:
        writer.writerow([c.id, c.datetime_str, c.duration_str, c.cost, c.caller_phone, c.destination_phone, c.contact_name, c.agent_name, c.direction, c.status, c.outcome])
    
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=calls_export.csv"}
    )

@router.get("/{call_id}", response_model=CallResponse)
def get_call(call_id: str, db: Session = Depends(get_db)):
    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call

@router.patch("/{call_id}/feedback", response_model=CallResponse)
def update_call_feedback(call_id: str, update_data: CallFeedbackUpdate, db: Session = Depends(get_db)):
    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    call.review_status = update_data.review_status
    if update_data.feedback_comment is not None:
        call.feedback_comment = update_data.feedback_comment
    
    # Write to Audit Log
    now_str = datetime.datetime.now().strftime("%b %d, %Y, %I:%M %p")
    audit = AuditLog(
        datetime_str=now_str,
        user="Admin User",
        action="Call Review Saved",
        entity="Call",
        entity_name=call.id,
        details=f"Status: {call.review_status}; Notes: {call.feedback_comment[:40]}"
    )
    db.add(audit)
    db.commit()
    db.refresh(call)
    return call

@router.post("/{call_id}/toggle-favourite", response_model=CallResponse)
def toggle_call_favourite(call_id: str, db: Session = Depends(get_db)):
    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    call.is_favourite = not call.is_favourite
    db.commit()
    db.refresh(call)
    return call
