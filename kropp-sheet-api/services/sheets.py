import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
from typing import List
import os

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
]

SPREADSHEET_ID = os.getenv("SPREADSHEET_ID", "")
SHEET_TAB_NAME = os.getenv("SHEET_TAB_NAME", "Kargo Takip")


def get_sheet():
    """Authenticate with service account and return the target worksheet."""
    creds = Credentials.from_service_account_file(
        "service_account.json",
        scopes=SCOPES,
    )
    client = gspread.authorize(creds)
    spreadsheet = client.open_by_key(SPREADSHEET_ID)
    return spreadsheet.worksheet(SHEET_TAB_NAME)


def get_next_id(sheet) -> int:
    """
    Replicates the AppScript logic:
    reads all values in column A, finds the max, returns max + 1.
    """
    col_a = sheet.col_values(1)  # column A, all values including header
    ids = []
    for val in col_a[1:]:  # skip header row
        try:
            ids.append(int(val))
        except (ValueError, TypeError):
            continue
    return max(ids, default=0) + 1


def append_record(
    musteriAdi: str,
    telefon: str,
    islemTipi: str,
    gelenUrun: str,
    durum: str,
    notlar: str,
) -> int:
    """
    Appends a new row to the sheet.
    Handles isNo and tarih that AppScript would normally set on manual edit.
    Returns the assigned isNo.
    """
    sheet = get_sheet()

    next_id = get_next_id(sheet)
    tarih = datetime.now().strftime("%d-%m-%Y")  # DD-MM-YYYY matching existing format

    # Columns A–H in order matching the schema
    row = [
        next_id,    # A: isNo
        tarih,      # B: tarih
        musteriAdi, # C: musteriAdi
        telefon,    # D: telefon
        islemTipi,  # E: islemTipi
        gelenUrun,  # F: gelenUrun
        durum,      # G: durum
        notlar,     # H: notlar
    ]

    sheet.append_row(row, value_input_option="USER_ENTERED")
    return next_id
