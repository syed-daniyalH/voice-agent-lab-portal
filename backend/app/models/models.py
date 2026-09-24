from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base
import datetime

class Call(Base):
    __tablename__ = "calls"

    id = Column(String(64), primary_key=True, index=True)
    datetime_str = Column(String(64), nullable=False)
    duration_seconds = Column(Integer, default=0)
    duration_str = Column(String(32), default="0s")
    cost = Column(String(32), default="£0.00")
    caller_phone = Column(String(32), index=True)
    destination_phone = Column(String(32))
    contact_name = Column(String(128), index=True)
    agent_name = Column(String(128), index=True)
    direction = Column(String(32), default="Inbound")  # Inbound / Outbound
    status = Column(String(32), default="Answered")     # Answered / Missed / Voicemail
    end_reason = Column(String(64), default="Completed Normally")
    outcome = Column(String(64), default="Enquiry Captured") # Booking Confirmed / Quote Requested / Failed
    is_favourite = Column(Boolean, default=False)
    
    # Preset Analysis
    call_status = Column(String(64))
    call_success = Column(String(32))
    user_sentiment = Column(String(32), default="Neutral")
    disconnection_reason = Column(String(64))
    latency = Column(String(32), default="740ms")
    
    # Custom Trade Analysis & AI Data
    custom_analysis = Column(JSON, default=dict)
    summary = Column(Text, default="")
    transcript = Column(JSON, default=list) # List of {speaker, text, time}
    
    # QA & Feedback
    review_status = Column(String(32), default="Not Reviewed") # Reviewed - Good / Needs Improvement / Escalated
    feedback_comment = Column(Text, default="")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False, index=True)
    phone = Column(String(32), nullable=False, index=True)
    email = Column(String(128), default="")
    postcode = Column(String(32), default="")
    address = Column(String(255), default="")
    total_calls = Column(Integer, default=1)
    last_call_date = Column(String(64), default="")
    notes = Column(Text, default="")
    is_favourite = Column(Boolean, default=False)
    ghl_contact_id = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(128), nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    agent_name = Column(String(128), default="All Agents")
    role = Column(String(64), default="Viewer")
    company = Column(String(128), default="We Build Trades")
    access_level = Column(String(64), default="Client Portal")
    cost_per_minute = Column(String(32), default="£0.50")
    joined_date = Column(String(64), default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(128), index=True, nullable=False)
    name = Column(String(128), nullable=False)
    agent_name = Column(String(128), default="Essex Heating Inbound")
    role = Column(String(64), default="Manager")
    company = Column(String(128), default="Essex Heating Experts")
    sent_date = Column(String(64), default="")
    expires_date = Column(String(64), default="")
    status = Column(String(32), default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class KnowledgeBase(Base):
    __tablename__ = "knowledge_bases"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    description = Column(Text, default="")
    docs_count = Column(Integer, default=0)
    status = Column(String(32), default="Indexed")
    total_size = Column(String(32), default="0 MB")
    updated_date = Column(String(64), default="")
    files = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(64), primary_key=True, index=True)
    date_str = Column(String(64), nullable=False)
    description = Column(String(255), nullable=False)
    amount = Column(String(32), nullable=False)
    tax = Column(String(32), nullable=False)
    status = Column(String(32), default="Paid")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    datetime_str = Column(String(64), nullable=False)
    user = Column(String(128), nullable=False)
    action = Column(String(128), nullable=False)
    entity = Column(String(64), default="System")
    entity_name = Column(String(128), default="")
    details = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BillingConfig(Base):
    __tablename__ = "billing_configs"

    id = Column(Integer, primary_key=True, default=1)
    balance = Column(Float, default=142.50)
    auto_refill_enabled = Column(Boolean, default=True)
    refill_threshold = Column(Float, default=25.00)
    refill_amount = Column(Float, default=100.00)
    card_last4 = Column(String(8), default="4242")
    card_brand = Column(String(32), default="Mastercard")
    card_expiry = Column(String(16), default="09/2028")
    tax_rate = Column(Float, default=20.0)
