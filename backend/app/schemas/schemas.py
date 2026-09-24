from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CallFeedbackUpdate(BaseModel):
    review_status: str
    feedback_comment: Optional[str] = ""

class CallResponse(BaseModel):
    id: str
    datetime_str: str
    duration_seconds: int
    duration_str: str
    cost: str
    caller_phone: str
    destination_phone: Optional[str] = ""
    contact_name: str
    agent_name: str
    direction: str
    status: str
    end_reason: str
    outcome: str
    is_favourite: bool
    call_status: Optional[str] = ""
    call_success: Optional[str] = ""
    user_sentiment: Optional[str] = "Neutral"
    disconnection_reason: Optional[str] = ""
    latency: Optional[str] = "740ms"
    custom_analysis: Dict[str, Any] = {}
    summary: str
    transcript: List[Dict[str, Any]] = []
    review_status: str
    feedback_comment: Optional[str] = ""

    class Config:
        from_attributes = True

class ContactNoteUpdate(BaseModel):
    notes: str

class ContactResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = ""
    postcode: Optional[str] = ""
    address: Optional[str] = ""
    total_calls: int
    last_call_date: Optional[str] = ""
    notes: Optional[str] = ""
    is_favourite: bool

    class Config:
        from_attributes = True

class InviteCreate(BaseModel):
    email: str
    name: str
    agent_name: str = "Essex Heating Inbound"
    role: str = "Manager"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    agent_name: str
    role: str
    company: str
    access_level: str
    cost_per_minute: str
    joined_date: str

    class Config:
        from_attributes = True

class InvitationResponse(BaseModel):
    id: int
    email: str
    name: str
    agent_name: str
    role: str
    company: str
    sent_date: str
    expires_date: str
    status: str

    class Config:
        from_attributes = True

class KBSearchQuery(BaseModel):
    query: str

class KBSearchResult(BaseModel):
    score: float
    source: str
    excerpt: str

class KnowledgeBaseResponse(BaseModel):
    id: str
    name: str
    description: str
    docs_count: int
    status: str
    total_size: str
    updated_date: str
    files: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True

class InvoiceResponse(BaseModel):
    id: str
    date_str: str
    description: str
    amount: str
    tax: str
    status: str

    class Config:
        from_attributes = True

class BillingConfigResponse(BaseModel):
    balance: float
    auto_refill_enabled: bool
    refill_threshold: float
    refill_amount: float
    card_last4: str
    card_brand: str
    card_expiry: str
    tax_rate: float

class AutoRefillUpdate(BaseModel):
    auto_refill_enabled: Optional[bool] = None
    refill_threshold: Optional[float] = None
    refill_amount: Optional[float] = None

class PurchaseCreditsRequest(BaseModel):
    amount: float

class AuditLogResponse(BaseModel):
    id: int
    datetime_str: str
    user: str
    action: str
    entity: str
    entity_name: str
    details: str

    class Config:
        from_attributes = True

class OverviewMetricsResponse(BaseModel):
    total_calls: int
    total_contacts: int
    total_duration_str: str
    avg_duration_str: str
    success_rate_pct: int
    pipeline_value_captured: str
    roi_multiple: str
    hours_saved: str
    latency_ms: str
    voicemail_rate: str
    agent_hung_up_pct: int
    user_hung_up_pct: int
    sentiment_distribution: Dict[str, int]
    peak_times_heatmap: List[Dict[str, Any]]
    calls_over_time: List[Dict[str, Any]]
    avg_duration_trend: List[Dict[str, Any]]
    csat_score: Optional[float] = 4.8
    outcomes_distribution: Optional[List[Dict[str, Any]]] = None
    trade_categories: Optional[List[Dict[str, Any]]] = None
    duration_distribution: Optional[List[Dict[str, Any]]] = None
    heatmap_matrix: Optional[List[Dict[str, Any]]] = None
    filter_meta: Optional[Dict[str, Any]] = None

