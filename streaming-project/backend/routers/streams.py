from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from database import get_db
from models import User, Stream, StreamStatus
from schemas import StreamCreate, StreamUpdate, StreamOut, StreamPublic
from auth import get_current_user, require_admin
from config import settings
import uuid

router = APIRouter(prefix="/streams", tags=["streams"])


def build_hls_url(rtmp_key: str) -> str:
    return f"{settings.hls_base_url}/live/{rtmp_key}/index.m3u8"


@router.get("/", response_model=list[StreamPublic])
async def list_live_streams(db: AsyncSession = Depends(get_db)):
    """Publiczna lista aktywnych transmisji."""
    result = await db.execute(
        select(Stream)
        .where(Stream.status == StreamStatus.live)
        .options(selectinload(Stream.owner))
        .order_by(Stream.started_at.desc())
    )
    streams = result.scalars().all()
    out = []
    for s in streams:
        out.append(StreamPublic(
            id=s.id,
            title=s.title,
            description=s.description,
            youtube_url=s.youtube_url,
            status=s.status,
            started_at=s.started_at,
            hls_url=build_hls_url(s.rtmp_key) if not s.youtube_url else None,
            owner_name=s.owner.display_name,
        ))
    return out


@router.get("/all", response_model=list[StreamPublic])
async def list_all_streams(db: AsyncSession = Depends(get_db)):
    """Wszystkie transmisje (live i offline) — publiczny katalog."""
    result = await db.execute(
        select(Stream)
        .options(selectinload(Stream.owner))
        .order_by(Stream.created_at.desc())
    )
    streams = result.scalars().all()
    return [
        StreamPublic(
            id=s.id,
            title=s.title,
            description=s.description,
            youtube_url=s.youtube_url,
            status=s.status,
            started_at=s.started_at,
            hls_url=build_hls_url(s.rtmp_key) if (s.status == StreamStatus.live and not s.youtube_url) else None,
            owner_name=s.owner.display_name,
        )
        for s in streams
    ]


@router.get("/{stream_id}", response_model=StreamPublic)
async def get_stream(stream_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Stream).where(Stream.id == stream_id).options(selectinload(Stream.owner))
    )
    stream = result.scalar_one_or_none()
    if not stream:
        raise HTTPException(status_code=404, detail="Transmisja nie znaleziona")

    return StreamPublic(
        id=stream.id,
        title=stream.title,
        description=stream.description,
        youtube_url=stream.youtube_url,
        status=stream.status,
        started_at=stream.started_at,
        hls_url=build_hls_url(stream.rtmp_key) if (stream.status == StreamStatus.live and not stream.youtube_url) else None,
        owner_name=stream.owner.display_name,
    )


@router.post("/", response_model=StreamOut, status_code=201)
async def create_stream(
    data: StreamCreate,
    user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Tylko admin może tworzyć transmisje."""
    stream = Stream(owner_id=user.id, title=data.title, description=data.description, youtube_url=data.youtube_url)
    if data.youtube_url:
        stream.status = StreamStatus.live
        from datetime import datetime
        stream.started_at = datetime.utcnow()
    db.add(stream)
    await db.commit()
    await db.refresh(stream)

    result = await db.execute(
        select(Stream).where(Stream.id == stream.id).options(selectinload(Stream.owner))
    )
    stream = result.scalar_one()
    out = StreamOut.model_validate(stream)
    out.hls_url = build_hls_url(stream.rtmp_key)
    return out


@router.patch("/{stream_id}", response_model=StreamOut)
async def update_stream(
    stream_id: uuid.UUID,
    data: StreamUpdate,
    user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Stream).where(Stream.id == stream_id).options(selectinload(Stream.owner))
    )
    stream = result.scalar_one_or_none()
    if not stream:
        raise HTTPException(status_code=404, detail="Transmisja nie znaleziona")

    if data.title is not None:
        stream.title = data.title
    if data.description is not None:
        stream.description = data.description
    if data.youtube_url is not None:
        stream.youtube_url = data.youtube_url or None
    if data.status is not None:
        stream.status = data.status
        from datetime import datetime
        if data.status == StreamStatus.live and not stream.started_at:
            stream.started_at = datetime.utcnow()

    await db.commit()
    await db.refresh(stream)
    out = StreamOut.model_validate(stream)
    out.hls_url = build_hls_url(stream.rtmp_key)
    return out


@router.delete("/{stream_id}", status_code=204)
async def delete_stream(
    stream_id: uuid.UUID,
    user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()
    if not stream:
        raise HTTPException(status_code=404, detail="Transmisja nie znaleziona")
    await db.delete(stream)
    await db.commit()
