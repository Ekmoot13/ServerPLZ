import uuid
import secrets
from datetime import datetime
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from database import Base
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    viewer = "viewer"


class StreamStatus(str, enum.Enum):
    offline = "offline"
    live = "live"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.viewer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    streams: Mapped[list["Stream"]] = relationship("Stream", back_populates="owner")


class Stream(Base):
    __tablename__ = "streams"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Unikalny klucz RTMP: kamera nadaje na rtmp://serwer:1935/live/<rtmp_key>
    rtmp_key: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, default=lambda: secrets.token_urlsafe(32))
    youtube_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[StreamStatus] = mapped_column(SAEnum(StreamStatus), default=StreamStatus.offline, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner: Mapped["User"] = relationship("User", back_populates="streams")
    events: Mapped[list["Event"]] = relationship("Event", back_populates="stream")


class Event(Base):
    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stream_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("streams.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    event_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    sap_event_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    results: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stream: Mapped["Stream | None"] = relationship("Stream", back_populates="events")
