from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from sqlalchemy import Integer, String, DECIMAL, ForeignKey, Text, DateTime, DATE
from datetime import datetime
from typing import Optional, List

class Message(Base):
    __tablename__ = 'messages'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_user_sender: Mapped[int] = mapped_column(ForeignKey('users.id'))
    id_user_recipient: Mapped[int] = mapped_column(ForeignKey('users.id'))
    id_order: Mapped[Optional[int]] = mapped_column(ForeignKey('orders.id'), nullable=True)
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    sender: Mapped['User'] = relationship(foreign_keys=[id_user_sender], back_populates='sent_messages')
    recipient: Mapped['User'] = relationship(foreign_keys=[id_user_recipient], back_populates='received_messages')
    order: Mapped[Optional['Order']] = relationship(back_populates='messages')