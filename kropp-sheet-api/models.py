from pydantic import BaseModel, Field
from typing import Optional


class NewRecordRequest(BaseModel):
    musteriAdi: str = Field(..., min_length=1, description="Customer name")
    telefon: str = Field(..., min_length=1, description="Phone number")
    islemTipi: str = Field(..., description="İade | Değişim | Tamir")
    gelenUrun: str = Field(..., min_length=1, description="Incoming product")
    durum: str = Field(default="Beklemede", description="Tamamlandı | Beklemede | İşlemde")
    notlar: Optional[str] = Field(default="", description="Optional notes")


class RecordResponse(BaseModel):
    ok: bool
    isNo: int
    message: str
