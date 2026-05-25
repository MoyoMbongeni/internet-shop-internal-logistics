from pydantic import BaseModel, Field
from typing import Optional


class RecordPayload(BaseModel):
    """Shared payload for both add and update operations."""
    musteriAdi: str   = Field(..., min_length=1)
    telefon:    str   = Field(default="")
    islemTipi:  str   = Field(default="")
    gelenUrun:  str   = Field(default="")
    durum:      str   = Field(default="Beklemede")
    notlar:     Optional[str] = Field(default="")


class RecordResponse(BaseModel):
    ok:      bool
    isNo:    int
    message: str


class DeleteResponse(BaseModel):
    ok:      bool
    message: str
