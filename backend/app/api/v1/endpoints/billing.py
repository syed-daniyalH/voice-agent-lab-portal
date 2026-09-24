from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import BillingConfig, Invoice, AuditLog
from app.schemas.schemas import BillingConfigResponse, AutoRefillUpdate, PurchaseCreditsRequest, InvoiceResponse
from typing import List
import datetime
import random

router = APIRouter()

@router.get("/config", response_model=BillingConfigResponse)
def get_billing_config(db: Session = Depends(get_db)):
    config = db.query(BillingConfig).first()
    if not config:
        config = BillingConfig()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

@router.patch("/config", response_model=BillingConfigResponse)
def update_auto_refill(update: AutoRefillUpdate, db: Session = Depends(get_db)):
    config = db.query(BillingConfig).first()
    if not config:
        config = BillingConfig()
        db.add(config)
    
    if update.auto_refill_enabled is not None:
        config.auto_refill_enabled = update.auto_refill_enabled
    if update.refill_threshold is not None:
        config.refill_threshold = update.refill_threshold
    if update.refill_amount is not None:
        config.refill_amount = update.refill_amount
    
    db.commit()
    db.refresh(config)
    return config

@router.post("/purchase-credits", response_model=BillingConfigResponse)
def purchase_credits(req: PurchaseCreditsRequest, db: Session = Depends(get_db)):
    config = db.query(BillingConfig).first()
    if not config:
        config = BillingConfig()
        db.add(config)
    
    config.balance += req.amount
    
    # Create an invoice
    now_str = datetime.datetime.now().strftime("%b %d, %Y")
    inv = Invoice(
        id=f"INV-2026-{random.randint(100, 999)}",
        date_str=now_str,
        description=f"Credit Top-Up (£{req.amount:.2f})",
        amount=f"£{req.amount:.2f}",
        tax=f"£{(req.amount * 0.2):.2f}",
        status="Paid"
    )
    db.add(inv)

    # Log to audit trail
    now_audit = datetime.datetime.now().strftime("%b %d, %Y, %I:%M %p")
    audit = AuditLog(
        datetime_str=now_audit,
        user="Admin User",
        action="Credits Added",
        entity="Billing",
        entity_name=f"£{req.amount:.2f}",
        details="Purchased via stored Mastercard ending 4242"
    )
    db.add(audit)
    db.commit()
    db.refresh(config)
    return config

@router.get("/invoices", response_model=List[InvoiceResponse])
def list_invoices(db: Session = Depends(get_db)):
    return db.query(Invoice).order_by(Invoice.created_at.desc()).all()
