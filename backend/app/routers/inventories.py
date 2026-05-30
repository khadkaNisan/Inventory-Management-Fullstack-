from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/api/inventories", tags=["inventories"])


@router.get("", response_model=List[schemas.InventoryOut])
def list_inventories(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_inventories(db, current_user.id)


@router.post("", response_model=schemas.InventoryOut, status_code=201)
def create_inventory(
    data: schemas.InventoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_inventory(db, data, current_user.id)


@router.get("/{inv_id}", response_model=schemas.InventoryOut)
def get_inventory(
    inv_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    inv = crud.get_inventory(db, inv_id, current_user.id)
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory not found.")
    category_count = len(inv.categories)
    item_count = sum(len(cat.items) for cat in inv.categories)
    return schemas.InventoryOut(
        id=inv.id,
        name=inv.name,
        description=inv.description,
        category_count=category_count,
        item_count=item_count,
        created_at=inv.created_at,
    )


@router.put("/{inv_id}", response_model=schemas.InventoryOut)
def update_inventory(
    inv_id: str,
    data: schemas.InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    inv = crud.get_inventory(db, inv_id, current_user.id)
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory not found.")
    return crud.update_inventory(db, inv, data)


@router.delete("/{inv_id}", status_code=204)
def delete_inventory(
    inv_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    inv = crud.get_inventory(db, inv_id, current_user.id)
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory not found.")
    crud.delete_inventory(db, inv)


# Categories


@router.get("/{inv_id}/categories", response_model=List[schemas.CategoryOut])
def list_categories(
    inv_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cats = crud.get_categories(db, inv_id, current_user.id)
    if cats is None:
        raise HTTPException(status_code=404, detail="Inventory not found.")
    return cats


@router.post("/{inv_id}/categories", response_model=schemas.CategoryOut, status_code=201)
def create_category(
    inv_id: str,
    data: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    inv = crud.get_inventory(db, inv_id, current_user.id)
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory not found.")
    return crud.create_category(db, data, inv_id)


@router.put("/{inv_id}/categories/{cid}", response_model=schemas.CategoryOut)
def update_category(
    inv_id: str,
    cid: str,
    data: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cat = crud.get_category(db, cid, current_user.id)
    if not cat or cat.inventory_id != inv_id:
        raise HTTPException(status_code=404, detail="Category not found.")
    return crud.update_category(db, cat, data)


@router.delete("/{inv_id}/categories/{cid}", status_code=204)
def delete_category(
    inv_id: str,
    cid: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cat = crud.get_category(db, cid, current_user.id)
    if not cat or cat.inventory_id != inv_id:
        raise HTTPException(status_code=404, detail="Category not found.")
    crud.delete_category(db, cat)
