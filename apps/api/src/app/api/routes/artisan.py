from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...database import get_db
from ...models.artisan import Artisan
from ...schemas.artisan import ArtisanCreate, ArtisanResponse

router = APIRouter()


@router.post("/", response_model=ArtisanResponse)
def create_artisan(artisan: ArtisanCreate, db: Session = Depends(get_db)):
    db_artisan = Artisan(
        name=artisan.name,
        location=artisan.location,
        craft_category=artisan.craft_category,
        languages=artisan.languages,
        business_type=artisan.business_type,
    )
    db.add(db_artisan)
    db.commit()
    db.refresh(db_artisan)
    return db_artisan


@router.get("/{artisan_id}", response_model=ArtisanResponse)
def get_artisan(artisan_id: str, db: Session = Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found")
    return artisan


@router.get("/", response_model=list[ArtisanResponse])
def list_artisans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    artisans = db.query(Artisan).offset(skip).limit(limit).all()
    return artisans
