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
    calls_data.extend([
        {
            "id": "uploaded_call_reid_energy_20260929_0154",
            "datetime_str": "Sep 29, 2026, 01:54 AM",
            "duration_seconds": 142,
            "duration_str": "2m 22s",
            "cost": "GBP 1.18",
            "caller_phone": "+447453140190",
            "destination_phone": "+442890571166",
            "contact_name": "Hassan Ghan",
            "agent_name": "Reid Energy Solutions - Carla (Inbound)",
            "direction": "Inbound",
            "status": "Answered",
            "end_reason": "Agent Hung Up",
            "outcome": "New Boiler - Gas",
            "is_favourite": True,
            "call_status": "ended",
            "call_success": "Successful",
            "user_sentiment": "Neutral",
            "disconnection_reason": "Agent Hung Up",
            "latency": "3455.50ms",
            "recording_url": "/recordings/uploaded-reid-energy-20260929-0154.mp3",
            "public_log_url": "https://voiceagent.webuildtrades.com/calls/uploaded_call_reid_energy_20260929_0154",
            "source_portal_url": "https://voiceagent.webuildtrades.com/calls",
            "custom_analysis": {
                "caller_name": "Hassan Ghan",
                "fuel_type": "gas",
                "transfer_successful": False,
                "transfer_attempted": False,
                "postcode": "SW1A 2A",
                "property_post_code": "SW1A 2A",
                "existing_customer": False,
                "property_address": "10 Downing Street",
                "enquiry_category": "new_install",
                "caller_town": "N/A",
                "boiler_type": "Not Established",
                "issue_reported": "Boiler is 2 years old and totally broken.",
                "fault_details": "Boiler is 2 years old and totally broken.",
                "message_for_team": "N/A",
                "service_job_type": "New Boiler - Gas",
                "service_type": "New Boiler - Gas",
                "office_status_at_call": "out_of_hours",
                "caller_phone": "N/A",
                "asked_for_human": False,
                "is_emergency": False
            },
            "summary": "The caller, Hassan Ghan, requested a replacement for his broken 2-year-old gas boiler and provided his address and postcode. The agent confirmed the details and advised the team would follow up regarding pricing.",
            "transcript": [
                {"speaker": "agent", "text": "Hi, I'm Carla from Reid Energy Solutions. How can I help today?", "timestamp": "1"},
                {"speaker": "user", "text": "I want to replace my boiler.", "timestamp": "6"},
                {"speaker": "agent", "text": "Got it, a replacement boiler. What have you got at the minute, and roughly how old is it?", "timestamp": "14"},
                {"speaker": "user", "text": "Actually, it's 2 years old and totally now broken and", "timestamp": "19"},
                {"speaker": "agent", "text": "I'm sorry to hear that, two years old and already broken is frustrating. Is it gas or oil?", "timestamp": "30"},
                {"speaker": "user", "text": "Yeah, it's a gas.", "timestamp": "38"},
                {"speaker": "agent", "text": "Thanks. When are you looking to get the replacement done?", "timestamp": "44"},
                {"speaker": "user", "text": "Within 2 weeks.", "timestamp": "48"},
                {"speaker": "agent", "text": "Okay, within two weeks. Can I get your first name, spelled out for me?", "timestamp": "54"},
                {"speaker": "user", "text": "Earth, awesome.", "timestamp": "60"},
                {"speaker": "agent", "text": "I'll need it spelled out, please.", "timestamp": "67"},
                {"speaker": "user", "text": "It's H-A-S-S-A-N.", "timestamp": "69"},
                {"speaker": "agent", "text": "Thanks. And your last name, spelled out?", "timestamp": "77"},
                {"speaker": "user", "text": "G-H-A-N.", "timestamp": "81"},
                {"speaker": "agent", "text": "Thanks. Can I get the property address and postcode?", "timestamp": "87"},
                {"speaker": "user", "text": "Yeah, the property address and postcode is 10 Downing Street", "timestamp": "97"},
                {"speaker": "agent", "text": "Thanks. Could I get the postcode as well?", "timestamp": "109"},
                {"speaker": "user", "text": "It's SW1A2A.", "timestamp": "112"},
                {"speaker": "agent", "text": "Thanks. The team will ring you to go through everything, including the price. Is there anything else I can help with?", "timestamp": "120"},
                {"speaker": "user", "text": "The", "timestamp": "127"},
                {"speaker": "agent", "text": "Is there anything else I can help with?", "timestamp": "133"},
                {"speaker": "user", "text": "No, there is nothing.", "timestamp": "134"},
                {"speaker": "agent", "text": "Thanks for calling, have a great day!", "timestamp": "140"}
            ],
            "review_status": "Not Reviewed",
            "feedback_comment": ""
        },
        {
            "id": "uploaded_call_ja_plumbing_20260928_0804",
            "datetime_str": "Sep 28, 2026, 08:04 AM",
            "duration_seconds": 230,
            "duration_str": "3m 50s",
            "cost": "GBP 1.92",
            "caller_phone": "+441235639259",
            "destination_phone": "+447453140190",
            "contact_name": "Shjohn Testing",
            "agent_name": "JA Plumbing & Heating (Outbound)",
            "direction": "Outbound",
            "status": "Answered",
            "end_reason": "Agent Hung Up",
            "outcome": "Survey Booked",
            "is_favourite": True,
            "call_status": "ended",
            "call_success": "Successful",
            "user_sentiment": "Neutral",
            "disconnection_reason": "Agent Hung Up",
            "latency": "3279.50ms",
            "recording_url": "/recordings/uploaded-ja-plumbing-20260928-0804.mp3",
            "public_log_url": "https://voiceagent.webuildtrades.com/calls/uploaded_call_ja_plumbing_20260928_0804",
            "source_portal_url": "https://voiceagent.webuildtrades.com/calls",
            "custom_analysis": {
                "customer_name": "Shjohn Testing",
                "caller_name": "Shjohn Testing",
                "postcode": "N/A",
                "service_job_type": "New Boiler Installation",
                "service_type": "New Boiler Installation",
                "callback_datetime": "N/A",
                "issue_reported": "N/A",
                "issue_description": "N/A",
                "callback_requested": False,
                "property_address": "10 Downing Street, West Deanster, London",
                "customer_address": "10 Downing Street, West Deanster, London",
                "emergency_plumbing": "Yes",
                "emergency_status": "Yes",
                "timeframe": "within next week",
                "timeline": "within next week",
                "plumbing_work_type": "N/A",
                "boiler_type": "N/A",
                "fuel_type": "N/A",
                "survey_slot": "Wednesday the 30th at 8am"
            },
            "summary": "The agent confirmed with Hassan (Shjohn Testing) that he needs a new boiler installation, collected his name and address, and booked a survey appointment for Wednesday the 30th at 8am. The user confirmed all details and the call ended successfully.",
            "transcript": [
                {"speaker": "user", "text": "If", "timestamp": "0"},
                {"speaker": "agent", "text": "Hi, this is Ruth calling from JA Plumbing and Heating - am I speaking with Hassan?", "timestamp": "2"},
                {"speaker": "user", "text": "Yeah, yeah.", "timestamp": "14"},
                {"speaker": "agent", "text": "Lovely. Is now an all right time for a quick chat about the enquiry you sent through our website?", "timestamp": "19"},
                {"speaker": "user", "text": "Yeah, yeah.", "timestamp": "25"},
                {"speaker": "agent", "text": "Good stuff. So can you tell me a bit about what you need help with?", "timestamp": "30"},
                {"speaker": "user", "text": "No, I want, uh,", "timestamp": "35"},
                {"speaker": "agent", "text": "No worries, take your time - what is it you need help with?", "timestamp": "44"},
                {"speaker": "user", "text": "I said I want a new boiler.", "timestamp": "47"},
                {"speaker": "agent", "text": "That's great, glad to hear it. What type of boiler have you got at the moment - combi, system, or conventional?", "timestamp": "53"},
                {"speaker": "user", "text": "Actually, I don't have any.", "timestamp": "60"},
                {"speaker": "agent", "text": "No problem - how soon are you looking to get the new boiler installed?", "timestamp": "67"},
                {"speaker": "user", "text": "Uh, within next week.", "timestamp": "71"},
                {"speaker": "agent", "text": "Got it - could I take the property address and postcode, please?", "timestamp": "76"},
                {"speaker": "user", "text": "No.", "timestamp": "82"},
                {"speaker": "user", "text": "Yeah. Um, yeah, it grows.", "timestamp": "84"},
                {"speaker": "agent", "text": "No worries, that's fine. Can I get your full name instead, so I can get things moving on the survey?", "timestamp": "95"},
                {"speaker": "user", "text": "Yeah, actually the OS is 10 Downing Street, West Deanster, London.", "timestamp": "99"},
                {"speaker": "agent", "text": "Thanks for that. And could you spell your first name for me?", "timestamp": "109"},
                {"speaker": "user", "text": "Use the site.", "timestamp": "123"},
                {"speaker": "agent", "text": "I just need your first name spelled out, letter by letter, please.", "timestamp": "128"},
                {"speaker": "user", "text": "S-H-J-O-H-N.", "timestamp": "132"},
                {"speaker": "agent", "text": "Thanks. And could you spell your last name for me too?", "timestamp": "138"},
                {"speaker": "user", "text": "It's T-E-S-T-I-N-G.", "timestamp": "141"},
                {"speaker": "agent", "text": "I just need your last name spelled out, letter by letter, please.", "timestamp": "148"},
                {"speaker": "user", "text": "He said it's T-E-S-T-I-N-G.", "timestamp": "151"},
                {"speaker": "agent", "text": "That's fine, thanks for that. Since you're looking to have it done within the next week, let me check what survey slots we've got over the next couple of days. I've got Wednesday the 30th at 8am, or 1pm - would either of those work for you?", "timestamp": "159"},
                {"speaker": "user", "text": "Yeah, book my hot air.", "timestamp": "173"},
                {"speaker": "agent", "text": "Great, I'll get that booked for you - Wednesday the 30th at 8am, that all right?", "timestamp": "179"},
                {"speaker": "agent", "text": "Sorry, are you still there? Just to confirm, shall I go ahead and book Wednesday the 30th at 8am for your survey?", "timestamp": "197"},
                {"speaker": "user", "text": "Yeah, I said yes.", "timestamp": "198"},
                {"speaker": "user", "text": "Yes, sir.", "timestamp": "204"},
                {"speaker": "user", "text": "Yes, sir.", "timestamp": "210"},
                {"speaker": "agent", "text": "That's all booked in for Wednesday the 30th at 8am. Is there anything else I can help with?", "timestamp": "215"},
                {"speaker": "user", "text": "No, there isn't any.", "timestamp": "221"},
                {"speaker": "agent", "text": "Perfect, thanks Hassan. Have a great day, bye for now.", "timestamp": "225"}
            ],
            "review_status": "Not Reviewed",
            "feedback_comment": ""
        },
        {
            "id": "ref_call_essex_20260929_001",
            "datetime_str": "Sep 29, 2026, 09:18 AM",
            "duration_seconds": 184,
            "duration_str": "3m 04s",
            "cost": "GBP 1.53",
            "caller_phone": "+447700900618",
            "destination_phone": "+441245982115",
            "contact_name": "Sarah Whitmore",
            "agent_name": "Essex Heating Inbound",
            "direction": "Inbound",
            "status": "Answered",
            "end_reason": "Agent Hung Up",
            "outcome": "Booking Confirmed",
            "is_favourite": True,
            "call_status": "Completed",
            "call_success": "Success",
            "user_sentiment": "Positive",
            "disconnection_reason": "Completed Normally",
            "latency": "728ms",
            "recording_url": "/recordings/reference-call-001.wav",
            "public_log_url": "https://voiceagent.webuildtrades.com/calls/ref_call_essex_20260929_001",
            "source_portal_url": "https://voiceagent.webuildtrades.com/dashboard",
            "custom_analysis": {
                "caller_name": "Sarah Whitmore",
                "email": "sarah.whitmore@example.co.uk",
                "postcode": "CM2 8RX",
                "property_address": "11 Springfield Road, Chelmsford",
                "service_job_type": "Boiler service",
                "boiler_type": "Worcester Bosch Greenstar",
                "issue_reported": "Annual service request with low pressure question",
                "emergency_status": "No",
                "fuel_type": "Natural Gas",
                "timeframe": "This week",
                "caller_type": "Homeowner",
                "quote_form_status": "Not required"
            },
            "summary": "Caller requested an annual boiler service and asked about low pressure. The agent confirmed postcode, captured email, checked availability and booked the service visit for Thursday morning.",
            "transcript": [
                {"speaker": "agent", "text": "Good morning, Essex Heating. Olivia speaking. How can I help today?", "timestamp": "0"},
                {"speaker": "user", "text": "I need to book a boiler service, and the pressure has been dropping a little.", "timestamp": "7"},
                {"speaker": "agent", "text": "I can help with that. Can I confirm the postcode for the property?", "timestamp": "18"},
                {"speaker": "user", "text": "Yes, it is CM2 8RX.", "timestamp": "25"},
                {"speaker": "agent", "text": "Great, I have booked that and added the low pressure note for the engineer.", "timestamp": "63"}
            ],
            "review_status": "Reviewed - Good",
            "feedback_comment": "Good qualification, clear appointment confirmation and useful engineer note."
        },
        {
            "id": "ref_call_boiler_20260929_002",
            "datetime_str": "Sep 29, 2026, 10:06 AM",
            "duration_seconds": 136,
            "duration_str": "2m 16s",
            "cost": "GBP 1.13",
            "caller_phone": "+447700900741",
            "destination_phone": "+441245982001",
            "contact_name": "Imran Patel",
            "agent_name": "Boiler Sure - Inbound",
            "direction": "Inbound",
            "status": "Answered",
            "end_reason": "User Hung Up",
            "outcome": "Emergency Dispatch",
            "is_favourite": True,
            "call_status": "Completed",
            "call_success": "Success",
            "user_sentiment": "Negative",
            "disconnection_reason": "User Hung Up",
            "latency": "762ms",
            "recording_url": "/recordings/reference-call-002.wav",
            "public_log_url": "https://voiceagent.webuildtrades.com/calls/ref_call_boiler_20260929_002",
            "source_portal_url": "https://voiceagent.webuildtrades.com/dashboard",
            "custom_analysis": {
                "caller_name": "Imran Patel",
                "email": "imran.patel@example.co.uk",
                "postcode": "SS1 2BG",
                "property_address": "6 Queensway, Southend-on-Sea",
                "service_job_type": "Emergency boiler repair",
                "boiler_type": "Ideal Logic",
                "issue_reported": "No heating and error code showing",
                "emergency_status": "Yes",
                "fuel_type": "Natural Gas",
                "timeframe": "Immediate",
                "caller_type": "Homeowner",
                "quote_form_status": "Not required"
            },
            "summary": "Caller had no heating and an Ideal Logic error code. The agent treated it as urgent, captured contact details, advised basic safety checks and escalated for same-day engineer dispatch.",
            "transcript": [
                {"speaker": "agent", "text": "Boiler Sure emergency line, Olivia speaking. Are you safe at the property?", "timestamp": "0"},
                {"speaker": "user", "text": "Yes, but we have no heating and the boiler has an error code.", "timestamp": "6"},
                {"speaker": "agent", "text": "I understand. Is there any smell of gas or visible leak?", "timestamp": "15"},
                {"speaker": "user", "text": "No smell of gas, just no heating.", "timestamp": "22"},
                {"speaker": "agent", "text": "I have escalated this for same-day dispatch and added your postcode SS1 2BG.", "timestamp": "58"}
            ],
            "review_status": "Needs Improvement",
            "feedback_comment": "Good urgency handling; add a stronger disclaimer before troubleshooting."
        },
        {
            "id": "ref_call_roofing_20260929_003",
            "datetime_str": "Sep 29, 2026, 11:42 AM",
            "duration_seconds": 219,
            "duration_str": "3m 39s",
            "cost": "GBP 1.82",
            "caller_phone": "+447700900864",
            "destination_phone": "+441273884020",
            "contact_name": "Megan Price",
            "agent_name": "Roofline Repairs Setter",
            "direction": "Outbound",
            "status": "Answered",
            "end_reason": "Agent Hung Up",
            "outcome": "Photo Link Sent",
            "is_favourite": False,
            "call_status": "Completed",
            "call_success": "Success",
            "user_sentiment": "Neutral",
            "disconnection_reason": "Completed Normally",
            "latency": "691ms",
            "recording_url": "/recordings/reference-call-003.wav",
            "public_log_url": "https://voiceagent.webuildtrades.com/calls/ref_call_roofing_20260929_003",
            "source_portal_url": "https://voiceagent.webuildtrades.com/dashboard",
            "custom_analysis": {
                "caller_name": "Megan Price",
                "email": "megan.price@example.co.uk",
                "postcode": "BN1 5AD",
                "property_address": "29 Ditchling Road, Brighton",
                "service_job_type": "Roof repair estimate",
                "issue_reported": "Damp patch after rain, possible flat roof leak",
                "emergency_status": "No",
                "timeframe": "This week",
                "caller_type": "Landlord",
                "quote_form_status": "Photo upload link sent"
            },
            "summary": "Outbound follow-up for a roof repair enquiry. The agent confirmed the damp patch issue, captured the property postcode and sent a photo upload link before survey scheduling.",
            "transcript": [
                {"speaker": "agent", "text": "Hi Megan, this is the Roofline Repairs assistant following up on your enquiry.", "timestamp": "0"},
                {"speaker": "user", "text": "Yes, there is a damp patch after rain and I think it may be the flat roof.", "timestamp": "8"},
                {"speaker": "agent", "text": "I can send a photo upload link so the surveyor can review it before booking.", "timestamp": "20"},
                {"speaker": "user", "text": "That would be helpful. The postcode is BN1 5AD.", "timestamp": "31"},
                {"speaker": "agent", "text": "Perfect, I have sent the link and added the postcode to your record.", "timestamp": "45"}
            ],
            "review_status": "Not Reviewed",
            "feedback_comment": ""
        }
    ])

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
