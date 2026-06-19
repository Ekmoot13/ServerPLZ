import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr
from models import UserRole, StreamStatus


# --- Auth ---

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    display_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    display_name: str
    role: UserRole
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Streams ---

class StreamCreate(BaseModel):
    title: str
    description: str | None = None
    youtube_url: str | None = None


class StreamUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    youtube_url: str | None = None
    status: StreamStatus | None = None


class StreamOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    rtmp_key: str
    youtube_url: str | None
    status: StreamStatus
    started_at: datetime | None
    ended_at: datetime | None
    created_at: datetime
    owner: UserOut
    hls_url: str | None = None

    model_config = {"from_attributes": True}


class StreamPublic(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    youtube_url: str | None
    status: StreamStatus
    started_at: datetime | None
    hls_url: str | None = None
    owner_name: str

    model_config = {"from_attributes": True}


# --- Events ---

class EventCreate(BaseModel):
    title: str
    description: str | None = None
    event_date: datetime
    stream_id: uuid.UUID | None = None
    results: dict | None = None


class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    event_date: datetime | None = None
    results: dict | None = None


class EventOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    event_date: datetime
    stream_id: uuid.UUID | None
    results: dict | None
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Webhooks ---

class WebhookStreamEvent(BaseModel):
    path: str
