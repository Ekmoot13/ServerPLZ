from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Event
from schemas import EventCreate, EventUpdate, EventOut
from auth import require_admin
import uuid

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/", response_model=list[EventOut])
async def list_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).order_by(Event.event_date.desc()))
    return result.scalars().all()


@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Wydarzenie nie znalezione")
    return event


@router.post("/", response_model=EventOut, status_code=201)
async def create_event(
    data: EventCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    event = Event(**data.model_dump())
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


@router.patch("/{event_id}", response_model=EventOut)
async def update_event(
    event_id: uuid.UUID,
    data: EventUpdate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Wydarzenie nie znalezione")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(event, field, value)

    await db.commit()
    await db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=204)
async def delete_event(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Wydarzenie nie znalezione")
    await db.delete(event)
    await db.commit()
