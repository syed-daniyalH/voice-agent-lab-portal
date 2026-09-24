from app.db.session import SessionLocal, engine, Base
from app.models.models import Call, Contact, User, Invitation, KnowledgeBase, Invoice, AuditLog, BillingConfig
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_database(db=None):
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()

    # 1. Billing Config
    if not db.query(BillingConfig).first():
        config = BillingConfig(
            balance=142.50,
            auto_refill_enabled=True,
            refill_threshold=25.00,
            refill_amount=100.00,
            card_last4="4242",
            card_brand="Mastercard",
            card_expiry="09/2028",
            tax_rate=20.0
        )
        db.add(config)

    # 2. Contacts
    contacts_data = [
        {"id": "cnt_1", "name": "Daniyal Haider", "phone": "+447453140190", "email": "daniyal@voiceagent.com", "postcode": "LL29 7YW", "total_calls": 6, "last_call_date": "Sep 16, 2026", "notes": "AC Installation enquiry; needs call back with sizing chart.", "is_favourite": True},
        {"id": "cnt_2", "name": "David Miller", "phone": "+447812938472", "email": "david.miller@gmail.com", "postcode": "CM1 2AB", "total_calls": 3, "last_call_date": "Sep 16, 2026", "notes": "Boiler service booked for Friday 10:00 AM.", "is_favourite": True},
        {"id": "cnt_3", "name": "Emma Watson", "phone": "+447932148291", "email": "emma.watson@outlook.com", "postcode": "SS9 3ET", "total_calls": 2, "last_call_date": "Sep 16, 2026", "notes": "Combi boiler replacement quote dispatched.", "is_favourite": False},
        {"id": "cnt_4", "name": "Robert Clarke", "phone": "+447712398410", "email": "robert.clarke@btinternet.com", "postcode": "RM1 4QA", "total_calls": 4, "last_call_date": "Sep 15, 2026", "notes": "Outbound survey callback scheduled for tomorrow.", "is_favourite": False},
        {"id": "cnt_5", "name": "Sophie Turner", "phone": "+447543219800", "email": "sophie.turner@yahoo.co.uk", "postcode": "CM2 7HQ", "total_calls": 2, "last_call_date": "Sep 15, 2026", "notes": "Emergency radiator leak repair completed.", "is_favourite": True}
    ]
    for c in contacts_data:
        if not db.query(Contact).filter(Contact.id == c["id"]).first():
            db.add(Contact(**c))

    # 3. Calls
    calls_data = [
        {
            "id": "call_Voice_8921a",
            "datetime_str": "Sep 16, 2026, 08:37 AM",
            "duration_seconds": 20,
            "duration_str": "20s",
            "cost": "£0.1722",
            "caller_phone": "+447453140190",
            "destination_phone": "+447414112588",
            "contact_name": "Daniyal Haider",
            "agent_name": "Essex Heating Inbound",
            "direction": "Inbound",
            "status": "Answered",
            "end_reason": "User Hung Up",
            "outcome": "Failed / Dropped",
            "is_favourite": True,
            "call_status": "User Hung Up",
            "call_success": "Failed",
            "user_sentiment": "Neutral",
            "disconnection_reason": "User Hung Up",
            "latency": "797.00ms",
            "custom_analysis": {
                "caller_name": "John Collett",
                "email": "Not Established",
                "postcode": "LL29 7YW",
                "service_type": "Air Conditioning",
                "boiler_type": "N/A",
                "emergency": "No"
            },
            "summary": "John called to enquire about air conditioning installation and provided postcode LL29 7YW.",
            "transcript": [
                {"speaker": "Agent", "text": "Hello, this is Olivia.", "time": 0},
                {"speaker": "User", "text": "Myself. Yeah.", "time": 2},
                {"speaker": "Agent", "text": "I'm a receptionist at Essex Heating Experts. How can I help you today?", "time": 4}
            ],
            "review_status": "Not Reviewed",
            "feedback_comment": ""
        },
        {
            "id": "call_Voice_8922b",
            "datetime_str": "Sep 16, 2026, 09:12 AM",
            "duration_seconds": 105,
            "duration_str": "1m 45s",
            "cost": "£0.8750",
            "caller_phone": "+447812938472",
            "destination_phone": "+447414112588",
            "contact_name": "David Miller",
            "agent_name": "Boiler Sure Inbound",
            "direction": "Inbound",
            "status": "Answered",
            "end_reason": "Agent Hung Up",
            "outcome": "Booking Confirmed",
            "is_favourite": True,
            "call_status": "Agent Hung Up",
            "call_success": "Success",
            "user_sentiment": "Positive",
            "disconnection_reason": "Completed Normally",
            "latency": "715.00ms",
            "custom_analysis": {
                "caller_name": "David Miller",
                "email": "david.miller@gmail.com",
                "postcode": "CM1 2AB",
                "service_type": "Boiler Service",
                "boiler_type": "Worcester Bosch Combi",
                "emergency": "No"
            },
            "summary": "David arranged annual boiler service for Worcester Bosch combi. Booked for Friday 10:00 AM.",
            "transcript": [
                {"speaker": "Agent", "text": "Good morning, Boiler Sure reception. Olivia speaking.", "time": 0},
                {"speaker": "User", "text": "Hi Olivia, I would like to book my annual boiler service for this week.", "time": 5}
            ],
            "review_status": "Reviewed - Good",
            "feedback_comment": "Flawless calendar check and friendly delivery."
        }
    ]
    for cl in calls_data:
        if not db.query(Call).filter(Call.id == cl["id"]).first():
            db.add(Call(**cl))

    # 4. Users & Invitations
    users_data = [
        {"name": "Daniyal Haider", "email": "admin@voiceagent.com", "agent_name": "All Agents", "role": "Super Admin", "company": "We Build Trades", "access_level": "Full Agency", "cost_per_minute": "£0.55", "joined_date": "Apr 8, 2026"},
        {"name": "Mark Stevenson", "email": "mark@essexheating.co.uk", "agent_name": "Essex Heating Inbound", "role": "Business Owner", "company": "Essex Heating Experts", "access_level": "Client Portal", "cost_per_minute": "£0.50", "joined_date": "Feb 12, 2026"}
    ]
    for u in users_data:
        if not db.query(User).filter(User.email == u["email"]).first():
            db.add(User(**u))

    # 5. Knowledge Bases
    kbs_data = [
        {"id": "kb_1", "name": "Essex Heating Triage & Service Postcodes", "docs_count": 12, "status": "Indexed", "total_size": "14.2 MB", "updated_date": "Sep 12, 2026", "description": "Coverage areas in Essex, emergency triage rules.", "files": [{"name": "Service_Areas_2026.pdf", "size": "2.4 MB", "chunks": 48, "status": "Indexed"}]},
        {"id": "kb_2", "name": "Boiler Repair Guides & Diagnostic Tree", "docs_count": 7, "status": "Indexed", "total_size": "28.5 MB", "updated_date": "Aug 29, 2026", "description": "Error codes for Worcester Bosch, Ideal, Vaillant.", "files": [{"name": "Worcester_Error_Codes.pdf", "size": "8.2 MB", "chunks": 112, "status": "Indexed"}]}
    ]
    for k in kbs_data:
        if not db.query(KnowledgeBase).filter(KnowledgeBase.id == k["id"]).first():
            db.add(KnowledgeBase(**k))

    # 6. Invoices
    invs_data = [
        {"id": "INV-2026-009", "date_str": "Sep 01, 2026", "description": "Voice Agent Usage - August 2026 (620 mins)", "amount": "£310.00", "tax": "£62.00", "status": "Paid"},
        {"id": "INV-2026-008", "date_str": "Aug 01, 2026", "description": "Voice Agent Usage - July 2026 (580 mins)", "amount": "£290.00", "tax": "£58.00", "status": "Paid"}
    ]
    for inv in invs_data:
        if not db.query(Invoice).filter(Invoice.id == inv["id"]).first():
            db.add(Invoice(**inv))

    db.commit()
    logger.info("Database seeding complete!")

if __name__ == "__main__":
    seed_database()
