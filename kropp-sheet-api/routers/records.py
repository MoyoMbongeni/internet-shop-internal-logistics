from fastapi import APIRouter, HTTPException, Header
from models import NewRecordRequest, UpdateRecordRequest, RecordResponse
from services.sheets import append_record, update_record
import os

router = APIRouter(prefix="/records", tags=["records"])

API_SECRET = os.getenv("API_SECRET", "")


def verify_key(x_api_key: str):
    """Simple shared-secret auth. All users share the same key from .env."""
    if x_api_key != API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid API key.")


@router.post("", response_model=RecordResponse, summary="Add a new kargo record")
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


@router.patch("/{is_no}", response_model=RecordResponse, summary="Update an existing record")
def edit_record(is_no: int, body: UpdateRecordRequest, x_api_key: str = Header(...)):
    verify_key(x_api_key)
    try:
        update_record(
            is_no=is_no,
            musteriAdi=body.musteriAdi,
            telefon=body.telefon,
            islemTipi=body.islemTipi,
            gelenUrun=body.gelenUrun,
            durum=body.durum,
            notlar=body.notlar or "",
        )
        return RecordResponse(
            ok=True,
            isNo=is_no,
            message=f"Record #{is_no} updated successfully.",
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
