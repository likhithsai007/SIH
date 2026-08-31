from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api.routes import artisan


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables if DB is available
    try:
        from .database import engine, Base
        from .models import artisan as artisan_model  # noqa: ensure model is registered
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Warning: Could not connect to database: {e}")
        print("API will start without database. Start PostgreSQL to enable DB features.")
    yield
    print("Shutting down...")


app = FastAPI(
    title="SIH26090 API",
    description="AI-powered Digital Craft Marketplace API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "sih26090-api"}


app.include_router(artisan.router, prefix="/api/v1/artisans", tags=["artisans"])
