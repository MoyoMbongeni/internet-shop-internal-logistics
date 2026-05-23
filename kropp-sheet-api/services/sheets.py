import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
import os

SCOPES         = ["https://www.googleapis.com/auth/spreadsheets"]
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID", "")
SHEET_TAB_NAME = os.getenv("SHEET_TAB_NAME", "Kargo Takip")


def get_sheet():
    creds = Credentials.from_service_account_file(
        "service_account.json", scopes=SCOPES
    )
    client = gspread.authorize(creds)
    return client.open_by_key(SPREADSHEET_ID).worksheet(SHEET_TAB_NAME)


def find_row_by_is_no(sheet, is_no: int) -> int:
    """
    Fetches all rows and scans column A for a matching isNo.
    Returns the 1-indexed row number (as gspread expects).
    Raises ValueError if not found.

    Uses get_all_values() instead of find() to avoid type-mismatch
    issues where Sheets stores numbers but find() compares strings.
    """
    all_rows = sheet.get_all_values()  # list of lists, row 0 = header

    for i, row in enumerate(all_rows):
        if i == 0:
            continue  # skip header row
        try:
            if int(row[0]) == is_no:
                return i + 1  # gspread rows are 1-indexed
        except (ValueError, TypeError, IndexError):
            continue

    raise ValueError(f"Record with isNo={is_no} not found in sheet.")


def get_next_id(sheet) -> int:
    """
    Replicates AppScript logic: finds max isNo, returns max + 1.
    """
    all_rows = sheet.get_all_values()
    ids = []
    for row in all_rows[1:]:  # skip header
        try:
            ids.append(int(row[0]))
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
    sheet   = get_sheet()
    next_id = get_next_id(sheet)
    tarih   = datetime.now().strftime("%d-%m-%Y")

    row = [next_id, tarih, musteriAdi, telefon, islemTipi, gelenUrun, durum, notlar]
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
    Locates the row by scanning column A for is_no (primary key),
    then updates only columns C–H. A (isNo) and B (tarih) never change.
    """
    sheet      = get_sheet()
    row_number = find_row_by_is_no(sheet, is_no)

    update_range = f"C{row_number}:H{row_number}"
    new_values   = [[musteriAdi, telefon, islemTipi, gelenUrun, durum, notlar]]

    sheet.update(update_range, new_values, value_input_option="USER_ENTERED")
    return row_number