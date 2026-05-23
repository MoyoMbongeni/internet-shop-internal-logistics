from fastapi import APIRouter, HTTPException, Header
from models import NewRecordRequest, RecordResponse
from services.sheets import append_record
import os

router = APIRouter(prefix="/records", tags=["records"])

API_SECRET = os.getenv("API_SECRET", "")


def verify_key(x_api_key: str = Header(...)):
    """Simple shared-secret auth. All users share the same key from .env."""
    if x_api_key != API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid API key")


@router.post("", response_model=RecordResponse)
def add_record(body: NewRecordRequest, x_api_key: str = Header(...)):
    verify_key(x_api_key)
    try:
        assigned_id = append_record(
            musteriAdi=body.musteriAdi,
            telefon=body.telefon,
            islemTipi=body.islemTipi,
            gelenUrun=body.gelenUrun,
            durum=body.durum,
            notlar=body.notlar or "",
        )
        return RecordResponse(
            ok=True,
            isNo=assigned_id,
            message=f"Record #{assigned_id} added successfully.",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
