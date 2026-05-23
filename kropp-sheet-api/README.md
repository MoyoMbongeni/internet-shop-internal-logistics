# Kropp | Sheet API

FastAPI backend for the Kropp Sheet app. Handles all write operations to Google Sheets using a service account.

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
5. Download the JSON key → rename it to `service_account.json` → place it in this folder
6. Open your Google Sheet → click **Share** → paste the service account email (looks like `name@project.iam.gserviceaccount.com`) → give it **Editor** access

### 3. Configure environment
```bash
cp .env.example .env
```
Fill in:
- `SPREADSHEET_ID` — from your sheet URL
- `SHEET_TAB_NAME` — exact tab name (default: `Kargo Takip`)
- `API_SECRET` — any strong random string (copy this into the app's `.env` too)

### 4. Run locally
```bash
uvicorn main:app --reload --port 8000
```

Test it:
```
GET http://localhost:8000/health
```

### 5. Deploy to Railway
1. Push this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables from your `.env`
4. Upload `service_account.json` as a Railway secret file or environment variable

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /records | Add a new kargo record |

All `/records` requests require header: `x-api-key: your_secret`
