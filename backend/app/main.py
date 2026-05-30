import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app import models
from app.database import engine
from app.routers import (
    auth_router,
    dashboard_router,
    inventories_router,
    items_router,
)

load_dotenv()

# ── App setup ─────────────────────────────────────────────────────────────────

app = FastAPI(title="InvenTrack API")

# CORS middleware — must be added BEFORE route definitions
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173,https://nisan-inventory.vercel.app",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    models.Base.metadata.create_all(bind=engine)


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "InvenTrack API"}


# Register routers (keeps routes modularized in app/routers/*)
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(inventories_router)
app.include_router(items_router)

