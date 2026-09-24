from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, Invitation, AuditLog
from app.schemas.schemas import UserResponse, InvitationResponse, InviteCreate
from typing import List
import datetime

router = APIRouter()

@router.get("", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/invitations", response_model=List[InvitationResponse])
def list_invitations(db: Session = Depends(get_db)):
    return db.query(Invitation).all()

@router.post("/invitations", response_model=InvitationResponse)
def create_invitation(invite: InviteCreate, db: Session = Depends(get_db)):
    inv = Invitation(
        email=invite.email,
        name=invite.name,
        agent_name=invite.agent_name,
        role=invite.role,
        company="Essex Heating Experts",
        sent_date="Today",
        expires_date="In 7 days",
        status="Pending"
    )
    db.add(inv)

    now_str = datetime.datetime.now().strftime("%b %d, %Y, %I:%M %p")
    audit = AuditLog(
        datetime_str=now_str,
        user="Admin User",
        action="User Invited",
        entity="User",
        entity_name=invite.email,
        details=f"Sent invitation as {invite.role} for {invite.agent_name}"
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)
    return inv
