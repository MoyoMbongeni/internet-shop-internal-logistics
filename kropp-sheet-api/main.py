from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.records import router as records_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Kropp | Sheet API",
    description="Backend for Kropp Sheet mobile app — Google Sheets CRUD layer",
    version="2.0.0",
)

# CORS — allow the Expo app and web version to reach this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(records_router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "Kropp Sheet API"}
