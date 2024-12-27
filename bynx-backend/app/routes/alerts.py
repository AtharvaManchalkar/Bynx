from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.alerts import AlertCreate, AlertUpdate, AlertResponse
from app.crud.alerts import get_alerts, create_alert, update_alert

router = APIRouter()

@router.get("/alerts", response_model=List[AlertResponse])
async def fetch_alerts():
    alerts = get_alerts()
    if alerts is None:
        raise HTTPException(status_code=404, detail="Alerts not found")
    return alerts

@router.post("/alerts", response_model=int)
async def add_alert(alert: AlertCreate):
    alert_id = create_alert(alert)
    return alert_id

@router.put("/alerts/{alert_id}")
async def update_existing_alert(alert_id: int, alert: AlertUpdate):
    existing_alert = get_alerts()
    if not existing_alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    update_alert(alert_id, alert)
    return {"message": "Alert updated successfully"}