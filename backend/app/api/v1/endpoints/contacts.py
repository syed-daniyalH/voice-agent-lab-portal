from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Contact
from app.schemas.schemas import ContactResponse, ContactNoteUpdate
from typing import List, Optional
import io
import csv

router = APIRouter()

@router.get("", response_model=List[ContactResponse])
def list_contacts(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Contact)
    if search:
        s = f"%{search}%"
        query = query.filter((Contact.name.ilike(s)) | (Contact.phone.ilike(s)) | (Contact.postcode.ilike(s)))
    return query.order_by(Contact.total_calls.desc()).all()

@router.get("/export-csv")
def export_contacts_csv(db: Session = Depends(get_db)):
    contacts = db.query(Contact).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Phone", "Email", "Postcode", "TotalCalls", "LastCall", "Notes"])
    for c in contacts:
        writer.writerow([c.id, c.name, c.phone, c.email, c.postcode, c.total_calls, c.last_call_date, c.notes])
    
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=contacts_export.csv"}
    )

@router.patch("/{contact_id}/notes", response_model=ContactResponse)
def update_contact_notes(contact_id: str, note_data: ContactNoteUpdate, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    contact.notes = note_data.notes
    db.commit()
    db.refresh(contact)
    return contact

@router.post("/{contact_id}/toggle-favourite", response_model=ContactResponse)
def toggle_contact_favourite(contact_id: str, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    contact.is_favourite = not contact.is_favourite
    db.commit()
    db.refresh(contact)
    return contact
