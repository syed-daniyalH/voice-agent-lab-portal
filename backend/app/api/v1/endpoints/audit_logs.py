from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import AuditLog
from app.schemas.schemas import AuditLogResponse
from typing import List, Optional
import io
import csv

router = APIRouter()

@router.get("", response_model=List[AuditLogResponse])
def list_audit_logs(action: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AuditLog)
    if action and action != "all":
        query = query.filter(AuditLog.action == action)
    return query.order_by(AuditLog.created_at.desc()).all()

@router.get("/export-csv")
def export_audit_csv(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["DateTime", "User", "Action", "Entity", "EntityName", "Details"])
    for l in logs:
        writer.writerow([l.datetime_str, l.user, l.action, l.entity, l.entity_name, l.details])
    
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=audit_logs.csv"}
    )
