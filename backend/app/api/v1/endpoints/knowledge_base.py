from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import KnowledgeBase, AuditLog
from app.schemas.schemas import KnowledgeBaseResponse, KBSearchQuery, KBSearchResult
from typing import List
import datetime

router = APIRouter()

@router.get("", response_model=List[KnowledgeBaseResponse])
def list_knowledge_bases(db: Session = Depends(get_db)):
    return db.query(KnowledgeBase).all()

@router.post("/search-test", response_model=KBSearchResult)
def test_semantic_search(search: KBSearchQuery):
    q = search.query.lower()
    if "southend" in q or "postcode" in q or "area" in q:
        return KBSearchResult(
            score=0.964,
            source="Essex Heating Triage & Service Postcodes.pdf",
            excerpt="We cover all CM (Chelmsford) and SS (Southend) postcodes. Standard diagnostics are £85 + VAT with guaranteed 2-hour arrival for emergencies."
        )
    elif "grant" in q or "heat pump" in q:
        return KBSearchResult(
            score=0.948,
            source="Renewables_and_Grants_2026.pdf",
            excerpt="We are MCS certified installers for the UK Boiler Upgrade Scheme providing up to £7,500 in upfront grant funding for air source heat pumps."
        )
    else:
        return KBSearchResult(
            score=0.912,
            source="Boiler Repair Guides & Diagnostic Tree.pdf",
            excerpt="Worcester Bosch and Ideal Logic diagnostic procedures: Check system pressure (1.0 to 1.5 bar). Sludge buildup produces kettling noise."
        )
