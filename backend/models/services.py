from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from sqlalchemy import Integer, String, Text, ForeignKey, Float
from datetime import datetime
from typing import Optional, List

class Specialization(Base):
    __tablename__ = 'specializations'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    
    services: Mapped[List['Service']] = relationship('Service', back_populates='specialization')
    executors: Mapped[List['ExecutorProfile']] = relationship('ExecutorProfile', back_populates='specialization')

class Service(Base):
    __tablename__ = 'services'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    id_specialization: Mapped[int] = mapped_column(ForeignKey('specializations.id'))
    id_user_executor: Mapped[int] = mapped_column(ForeignKey('users.id'))  
    price: Mapped[float] = mapped_column(Float)
    delivery_time: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    specialization: Mapped['Specialization'] = relationship('Specialization', back_populates='services')
    executor: Mapped['User'] = relationship('User', back_populates='services')
    orders: Mapped[List['Order']] = relationship('Order', back_populates='service')