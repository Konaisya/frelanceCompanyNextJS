from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from sqlalchemy import Integer, String, DECIMAL, ForeignKey, Text, DATETIME, DATE
from datetime import datetime
from typing import Optional, List

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    image: Mapped[str] = mapped_column(String(255), default='placeholder.png')
    role: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password: Mapped[str] = mapped_column(String(255))
    balance: Mapped[float] = mapped_column(DECIMAL(10, 2), default=0.0)
    id_executor_profile: Mapped[Optional[int]] = mapped_column(ForeignKey('executor_profiles.id'), nullable=True)
    id_customer_profile: Mapped[Optional[int]] = mapped_column(ForeignKey('customer_profiles.id'), nullable=True)

    executor_profile: Mapped[Optional['ExecutorProfile']] = relationship(back_populates='user')
    customer_profile: Mapped[Optional['CustomerProfile']] = relationship(back_populates='user')
    sent_messages: Mapped[List['Message']] = relationship('Message', foreign_keys='Message.id_user_sender', back_populates='sender')
    received_messages: Mapped[List['Message']] = relationship('Message', foreign_keys='Message.id_user_recipient', back_populates='recipient')
    sent_transactions: Mapped[List['Transaction']] = relationship('Transaction', foreign_keys='Transaction.id_user_sender', back_populates='sender')
    received_transactions: Mapped[List['Transaction']] = relationship('Transaction', foreign_keys='Transaction.id_user_recipient', back_populates='recipient')
    customer_orders: Mapped[List['Order']] = relationship('Order', foreign_keys='Order.id_user_customer', back_populates='customer')
    executor_orders: Mapped[List['Order']] = relationship('Order', foreign_keys='Order.id_user_executor', back_populates='executor')
    authored_reviews: Mapped[List['Review']] = relationship('Review', foreign_keys='Review.id_user_author', back_populates='author')
    target_reviews: Mapped[List['Review']] = relationship('Review', foreign_keys='Review.id_user_target', back_populates='target')
    services: Mapped[List['Service']] = relationship('Service', back_populates='executor')

class ExecutorProfile(Base):
    __tablename__ = 'executor_profiles'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_specialization: Mapped[int] = mapped_column(ForeignKey('specializations.id'))
    contacts: Mapped[str] = mapped_column(Text, nullable=True)
    experience: Mapped[int] = mapped_column(Integer, default=0)
    skills: Mapped[str] = mapped_column(Text, nullable=True)
    hourly_rate: Mapped[float] = mapped_column(DECIMAL(10, 2), nullable=True)
    description: Mapped[str] = mapped_column(Text)
    
    user: Mapped['User'] = relationship(back_populates='executor_profile')
    specialization: Mapped['Specialization'] = relationship(back_populates='executors')

class CustomerProfile(Base):
    __tablename__ = 'customer_profiles'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    company: Mapped[str] = mapped_column(String(255), nullable=True)
    contacts: Mapped[str] = mapped_column(Text, nullable=True)
    
    user: Mapped['User'] = relationship(back_populates='customer_profile')