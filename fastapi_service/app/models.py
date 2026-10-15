from datetime import datetime, date
from decimal import Decimal
from typing import List, Optional
import uuid
from sqlalchemy import (
    String,
    Numeric,
    Integer,
    Boolean,
    DateTime,
    Date,
    ForeignKey,
    Index,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Game(Base):
    """Canonical game entity catalog."""
    __tablename__ = "games"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
        comment="Normalized URL slug e.g. baldurs-gate-3",
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    base_msrp: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        comment="Current standard MSRP in USD",
    )
    historical_baseline_msrp: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        comment="Historical MSRP anchor to detect fake discount hikes",
    )
    release_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    store_prices: Mapped[List["StorePrice"]] = relationship(
        "StorePrice",
        back_populates="game",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    historical_low: Mapped[Optional["HistoricalLow"]] = relationship(
        "HistoricalLow",
        back_populates="game",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="joined",
    )

    def __repr__(self) -> str:
        return f"<Game(slug={self.slug}, title={self.title}, msrp={self.base_msrp})>"


class StorePrice(Base):
    """Latest price snapshot per storefront for a game."""
    __tablename__ = "store_prices"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    game_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("games.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    store_slug: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
        comment="Store identifier e.g. steam, epic_games, gog, humble_store, fanatical, g2a",
    )
    store_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    current_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        index=True,
    )
    original_msrp: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    discount_pct: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    is_authorized_store: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
        comment="True if authorized retailer; False if unauthorized grey-market reseller",
    )
    developer_cut_pct: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        default=Decimal("70.00"),
        comment="Revenue share percentage received by developer",
    )
    voucher_code: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    affiliate_url: Mapped[Optional[str]] = mapped_column(
        String(1024),
        nullable=True,
    )
    last_scraped_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # Relationships
    game: Mapped["Game"] = relationship(
        "Game",
        back_populates="store_prices",
    )

    __table_args__ = (
        Index("ix_store_prices_game_authorized_price", "game_id", "is_authorized_store", "current_price"),
    )

    def __repr__(self) -> str:
        return f"<StorePrice(store={self.store_slug}, price={self.current_price}, authorized={self.is_authorized_store})>"


class HistoricalLow(Base):
    """Verified all-time low (ATL) record floor for each game."""
    __tablename__ = "historical_lows"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    game_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("games.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    lowest_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        index=True,
    )
    previous_lowest_price: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )
    recorded_store_slug: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    recorded_store_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
    is_active_all_time_low: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )

    # Relationships
    game: Mapped["Game"] = relationship(
        "Game",
        back_populates="historical_low",
    )

    def __repr__(self) -> str:
        return f"<HistoricalLow(game_id={self.game_id}, lowest_price={self.lowest_price}, recorded_store={self.recorded_store_slug})>"
