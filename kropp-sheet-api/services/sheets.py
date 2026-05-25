import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
from typing import Optional
import os

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

SPREADSHEET_ID  = os.getenv("SPREADSHEET_ID", "")
SHEET_TAB_NAME  = os.getenv("SHEET_TAB_NAME", "Kargo Takip")


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
    Replicates AppScript logic:
    reads all values in column A, finds the max, returns max + 1.
    """
    col_a = sheet.col_values(1)
    ids = []
    for val in col_a[1:]:  # skip header
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
    Appends a new row. Handles isNo and tarih that AppScript
    would normally set on a manual edit. Returns the assigned isNo.
    """
    sheet = get_sheet()
    next_id = get_next_id(sheet)
    tarih   = datetime.now().strftime("%d-%m-%Y")

    row = [
        next_id,     # A: isNo
        tarih,       # B: tarih
        musteriAdi,  # C: musteriAdi
        telefon,     # D: telefon
        islemTipi,   # E: islemTipi
        gelenUrun,   # F: gelenUrun
        durum,       # G: durum
        notlar,      # H: notlar
    ]

    sheet.append_row(row, value_input_option="USER_ENTERED")
    return next_id


def update_record(
    is_no: int,
    musteriAdi: str,
    telefon: str,
    islemTipi: str,
    gelenUrun: str,
    durum: str,
    notlar: str,
) -> int:
    """
    Finds the row whose column A matches is_no, then updates
    columns C–H. Columns A (isNo) and B (tarih) are never touched.
    Returns the row number that was updated.
    Raises ValueError if the record is not found.
    """
    sheet = get_sheet()

    # Find the cell in column A that matches the isNo
    try:
        cell = sheet.find(str(is_no), in_column=1)
    except gspread.exceptions.CellNotFound:
        raise ValueError(f"Record with isNo={is_no} not found in sheet.")

    row_number = cell.row

    # Build an update range for C–H on that row only
    update_range = f"C{row_number}:H{row_number}"
    new_values = [[musteriAdi, telefon, islemTipi, gelenUrun, durum, notlar]]

    sheet.update(update_range, new_values, value_input_option="USER_ENTERED")
    return row_number


def delete_record(is_no: int) -> int:
    """
    Locates the row by isNo and deletes it entirely from the sheet.
    Returns the row number that was deleted.
    Raises ValueError if not found.
    """
    sheet      = get_sheet()
    row_number = find_row_by_is_no(sheet, is_no)
    sheet.delete_rows(row_number)
    return row_number
