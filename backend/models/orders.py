from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from sqlalchemy import Integer, String, DECIMAL, ForeignKey, Text, DATETIME, DATE
from datetime import datetime
from typing import Optional, List
from utils.enums import OrderStatus

class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_user_customer: Mapped[int] = mapped_column(ForeignKey('users.id'))
    id_user_executor: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=True)
    id_service: Mapped[int] = mapped_column(ForeignKey('services.id'), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default=OrderStatus.PENDING.value)
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DATETIME, nullable=True)
    deadline: Mapped[Optional[datetime]] = mapped_column(DATETIME, nullable=True)

    customer: Mapped['User'] = relationship(foreign_keys=[id_user_customer], back_populates='customer_orders')
    executor: Mapped['User'] = relationship(foreign_keys=[id_user_executor], back_populates='executor_orders')
    service: Mapped['Service'] = relationship(back_populates='orders')
    reviews: Mapped[List['Review']] = relationship('Review', back_populates='order')
    messages: Mapped[List['Message']] = relationship('Message', back_populates='order')
    transactions: Mapped[List['Transaction']] = relationship('Transaction', back_populates='order')

class Transaction(Base):
    __tablename__ = 'transactions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_order: Mapped[Optional[int]] = mapped_column(ForeignKey('orders.id'), nullable=True)
    id_user_sender: Mapped[int] = mapped_column(ForeignKey('users.id'))
    id_user_recipient: Mapped[int] = mapped_column(ForeignKey('users.id'))
    amount: Mapped[float] = mapped_column(DECIMAL(10, 2))
    commission: Mapped[float] = mapped_column(DECIMAL(10, 2), default=0.0)
    type: Mapped[str] = mapped_column(String(50))  # payment, refund, deposit, withdrawal
    created_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now)
    
    order: Mapped[Optional['Order']] = relationship(back_populates='transactions')
    sender: Mapped['User'] = relationship(foreign_keys=[id_user_sender], back_populates='sent_transactions')
    recipient: Mapped['User'] = relationship(foreign_keys=[id_user_recipient], back_populates='received_transactions')