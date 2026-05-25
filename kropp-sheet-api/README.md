# Kropp | Sheet API

FastAPI backend for Kropp Sheet. Handles all write operations to Google Sheets via a service account. Read operations go directly from the app to the Sheets API.

## Stack
- Python 3.13+ · FastAPI 0.115 · gspread 6.1.2 · google-auth 2.30 · Uvicorn

## Setup

### 1. Install
```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

### 2. Google Service Account
1. [Google Cloud Console](https://console.cloud.google.com) → Enable **Google Sheets API**
2. IAM & Admin → Service Accounts → Create → download JSON key
3. Rename to `service_account.json` → place in this folder
4. Share your Google Sheet with the service account email → **Editor**

### 3. Environment
```bash
cp .env.example .env
# Fill in SPREADSHEET_ID, SHEET_TAB_NAME, API_SECRET
```

### 4. Run locally
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Deploy (Railway)
Push to GitHub → Railway → New Project → Deploy from GitHub → add env vars

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /records | Add new record |
| PATCH | /records/{is_no} | Update record by isNo |
| DELETE | /records/{is_no} | Hard delete record by isNo |

All `/records` requests require header: `x-api-key: your_secret`

## Volume Roadmap
- **Vol 2.1** ✅ Add
- **Vol 2.2** ✅ Edit / Update
- **Vol 2.3** ✅ Delete
- **Vol 3.0** 🔜 OCR camera scan
