from pydantic import BaseModel, Field
from typing import Optional


class NewRecordRequest(BaseModel):
    musteriAdi: str = Field(..., min_length=1, description="Customer name")
    telefon: str = Field(default="", description="Phone number")
    islemTipi: str = Field(default="", description="İade | Değişim | Tamir")
    gelenUrun: str = Field(default="", description="Incoming product")
    durum: str = Field(default="Beklemede", description="Tamamlandı | Beklemede | İşlemde")
    notlar: Optional[str] = Field(default="", description="Optional notes")


class UpdateRecordRequest(BaseModel):
    musteriAdi: str = Field(..., min_length=1, description="Customer name")
    telefon: str = Field(default="", description="Phone number")
    islemTipi: str = Field(default="", description="İade | Değişim | Tamir")
    gelenUrun: str = Field(default="", description="Incoming product")
    durum: str = Field(default="Beklemede", description="Tamamlandı | Beklemede | İşlemde")
    notlar: Optional[str] = Field(default="", description="Optional notes")
    # isNo and tarih are intentionally excluded — they are immutable system fields


class RecordResponse(BaseModel):
    ok: bool
    isNo: int
    message: str
