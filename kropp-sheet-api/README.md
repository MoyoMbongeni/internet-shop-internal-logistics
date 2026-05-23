# Kropp | Sheet API

FastAPI backend for the Kropp Sheet app. Handles all write operations to Google Sheets using a service account.

## Stack
- Python 3.13+
- FastAPI 0.115
- gspread 6.1.2
- google-auth 2.30
- Uvicorn

## Setup

### 1. Install dependencies
```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Google Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use your existing one)
3. Enable **Google Sheets API**
4. Go to **IAM & Admin → Service Accounts → Create Service Account**
5. Download the JSON key → rename it `service_account.json` → place it in this folder
6. Open your Google Sheet → **Share** → paste the service account email → give it **Editor** access

### 3. Configure environment
```bash
cp .env.example .env
```
Fill in:
- `SPREADSHEET_ID` — from your sheet URL
- `SHEET_TAB_NAME` — exact tab name (default: `Kargo Takip`)
- `API_SECRET` — any strong random string (copy this into the app `.env` too)

### 4. Run locally
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Test:
```
GET http://localhost:8000/health
```

### 5. Deploy to Railway
1. Push this folder to GitHub
2. [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables from your `.env`
4. Upload `service_account.json` as a Railway secret or environment variable

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /records | Add a new kargo record |
| PATCH | /records/{is_no} | Update an existing record by isNo |

All `/records` requests require header: `x-api-key: your_secret`

### POST /records — request body
```json
{
  "musteriAdi": "Ali Veli",
  "telefon": "0532 000 0000",
  "islemTipi": "İade",
  "gelenUrun": "Nike Air Max 42",
  "durum": "Beklemede",
  "notlar": "Optional note"
}
```

### PATCH /records/{is_no} — request body
Same fields as POST. `isNo` and `tarih` are immutable — never sent in the body.

## Volume Roadmap
- **Vol 2.1.0** ✅ Add new record
- **Vol 2.2.0** ✅ Edit / update existing record
- **Vol 2.3.0** 🔜 Delete record
- **Vol 3.0.0** 🔜 OCR camera scan
