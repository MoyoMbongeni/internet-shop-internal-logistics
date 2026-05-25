from fastapi import APIRouter, HTTPException, Header
from models import RecordPayload, RecordResponse, DeleteResponse
from services.sheets import append_record, update_record, delete_record
import os

router     = APIRouter(prefix="/records", tags=["records"])
API_SECRET = os.getenv("API_SECRET", "")


def verify_key(x_api_key: str):
    if x_api_key != API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid API key.")


@router.post("", response_model=RecordResponse, summary="Add a new record")
def add_record(body: RecordPayload, x_api_key: str = Header(...)):
    verify_key(x_api_key)
    try:
        assigned_id = append_record(
            musteriAdi=body.musteriAdi, telefon=body.telefon,
            islemTipi=body.islemTipi,  gelenUrun=body.gelenUrun,
            durum=body.durum,          notlar=body.notlar or "",
        )
        return RecordResponse(ok=True, isNo=assigned_id,
                              message=f"Record #{assigned_id} added.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{is_no}", response_model=RecordResponse, summary="Update an existing record")
def edit_record(is_no: int, body: RecordPayload, x_api_key: str = Header(...)):
    verify_key(x_api_key)
    try:
        update_record(
            is_no=is_no,               musteriAdi=body.musteriAdi,
            telefon=body.telefon,      islemTipi=body.islemTipi,
            gelenUrun=body.gelenUrun,  durum=body.durum,
            notlar=body.notlar or "",
        )
        return RecordResponse(ok=True, isNo=is_no,
                              message=f"Record #{is_no} updated.")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{is_no}", response_model=DeleteResponse, summary="Hard delete a record")
def remove_record(is_no: int, x_api_key: str = Header(...)):
    verify_key(x_api_key)
    try:
        delete_record(is_no=is_no)
        return DeleteResponse(ok=True, message=f"Record #{is_no} deleted.")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
