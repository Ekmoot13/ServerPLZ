from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from database import init_db, AsyncSessionLocal
from models import Stream, StreamStatus
from schemas import WebhookStreamEvent
from routers import auth, streams, events
import logging
import asyncio
import httpx
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def poll_streams():
    await asyncio.sleep(8)
    while True:
        try:
            async with AsyncSessionLocal() as db:
                result = await db.execute(select(Stream))
                all_streams = result.scalars().all()
                changed = False
                async with httpx.AsyncClient() as client:
                    for s in all_streams:
                        if s.youtube_url:
                            continue
                        try:
                            url = f"http://mediamtx:8888/live/{s.rtmp_key}/index.m3u8"
                            r = await client.get(url, follow_redirects=True, timeout=3)
                            is_live = r.status_code == 200
                        except Exception:
                            is_live = False
                        if is_live and s.status != StreamStatus.live:
                            s.status = StreamStatus.live
                            s.started_at = datetime.utcnow()
                            s.ended_at = None
                            changed = True
                        elif not is_live and s.status == StreamStatus.live:
                            s.status = StreamStatus.offline
                            s.ended_at = datetime.utcnow()
                            changed = True
                if changed:
                    await db.commit()
        except Exception as e:
            logger.warning(f"Poll error: {e}")
        await asyncio.sleep(8)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Inicjalizacja bazy danych...")
    await init_db()
    task = asyncio.create_task(poll_streams())
    yield
    task.cancel()
    logger.info("Zamykanie aplikacji.")


app = FastAPI(
    title="Streaming API",
    description="Backend dla platformy transmisji video",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(streams.router)
app.include_router(events.router)


@app.get("/health")
async def health():
    return {"status": "ok"}


# --- Webhooks wywoływane przez MediaMTX ---

@app.post("/webhooks/stream-start")
async def webhook_stream_start(data: WebhookStreamEvent):
    """MediaMTX wywołuje ten endpoint gdy kamera zaczyna nadawać."""
    # path = "live/<rtmp_key>"
    parts = data.path.split("/")
    if len(parts) < 2:
        return {"ok": False}

    rtmp_key = parts[-1]
    from datetime import datetime

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Stream).where(Stream.rtmp_key == rtmp_key))
        stream = result.scalar_one_or_none()
        if stream:
            stream.status = StreamStatus.live
            stream.started_at = datetime.utcnow()
            stream.ended_at = None
            await db.commit()
            logger.info(f"Stream '{stream.title}' -> LIVE")

    return {"ok": True}


@app.post("/webhooks/stream-stop")
async def webhook_stream_stop(data: WebhookStreamEvent):
    """MediaMTX wywołuje ten endpoint gdy kamera przestaje nadawać."""
    parts = data.path.split("/")
    if len(parts) < 2:
        return {"ok": False}

    rtmp_key = parts[-1]
    from datetime import datetime

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Stream).where(Stream.rtmp_key == rtmp_key))
        stream = result.scalar_one_or_none()
        if stream:
            stream.status = StreamStatus.offline
            stream.ended_at = datetime.utcnow()
            await db.commit()
            logger.info(f"Stream '{stream.title}' -> OFFLINE")

    return {"ok": True}
