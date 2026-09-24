from fastapi import APIRouter
from app.api.v1.endpoints import overview, calls, contacts, knowledge_base, billing, users, audit_logs, webhooks

api_router = APIRouter()

api_router.include_router(overview.router, prefix="/overview", tags=["Overview"])
api_router.include_router(calls.router, prefix="/calls", tags=["Calls"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["Contacts"])
api_router.include_router(knowledge_base.router, prefix="/knowledge-base", tags=["Knowledge Base"])
api_router.include_router(billing.router, prefix="/billing", tags=["Billing"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(audit_logs.router, prefix="/audit-logs", tags=["Audit Logs"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
