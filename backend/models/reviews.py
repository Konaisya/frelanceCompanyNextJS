from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from sqlalchemy import Integer, String, DECIMAL, ForeignKey, Text, DATETIME, DATE
from datetime import datetime
from typing import Optional, List

class Review(Base):
    __tablename__ = 'reviews'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_order: Mapped[int] = mapped_column(ForeignKey('orders.id'))
    id_user_author: Mapped[int] = mapped_column(ForeignKey('users.id'))
    id_user_target: Mapped[int] = mapped_column(ForeignKey('users.id'))
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DATETIME, nullable=True)
    
    order: Mapped['Order'] = relationship(back_populates='reviews')
    author: Mapped['User'] = relationship(foreign_keys=[id_user_author], back_populates='authored_reviews')
    target: Mapped['User'] = relationship(foreign_keys=[id_user_target], back_populates='target_reviews')