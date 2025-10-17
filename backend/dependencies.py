from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from models import *
from crud import *
from config.database import get_session
from config.auth import oauth2_scheme
from utils.enums import Roles, AuthStatus
from service.auth import AuthService
from service.users import UserService
from service.services import ServiceService
from service.orders import OrderService
from service.reviews import ReviewService
from service.transactions import TransactionService
from service.message import MessageService

# User and Auth
def get_user_repository(db: Session = Depends(get_session)):
    return UserRepository(model=User, session=db)

def get_executor_repository(db: Session = Depends(get_session)):
    return UserRepository(model=ExecutorProfile, session=db)

def get_customer_repository(db: Session = Depends(get_session)):
    return UserRepository(model=CustomerProfile, session=db)

def get_auth_service(user_repository: UserRepository = Depends(get_user_repository)) -> AuthService:
    return AuthService(user_repository=user_repository)

def get_current_user(token: str=Depends(oauth2_scheme), user_repository: UserRepository = Depends(get_user_repository)) -> User:
    service = AuthService(user_repository=user_repository)
    return service.get_user_by_token(token)

def get_current_admin(token: str=Depends(oauth2_scheme), user_repository: UserRepository = Depends(get_user_repository)) -> User:
    service = AuthService(user_repository=user_repository)
    user = service.get_user_by_token(token)
    if user.role != Roles.ADMIN.value:
        raise HTTPException(status_code=403, detail={'status': AuthStatus.FORBIDDEN.value})
    return user

def get_user_service(user_repository: UserRepository = Depends(get_user_repository),
                     executor_repository: UserRepository = Depends(get_executor_repository),
                     customer_repository: UserRepository = Depends(get_customer_repository)) -> UserService:
    return UserService(user_repository=user_repository,
                       executor_repository=executor_repository,
                       customer_repository=customer_repository)


# Service and Specialization
def get_service_repository(db: Session = Depends(get_session)):
    return ServiceRepository(model=Service, session=db)

def get_specialization_repository(db: Session = Depends(get_session)):
    return ServiceRepository(model=Specialization, session=db)

def get_service_service(service_repository: ServiceRepository = Depends(get_service_repository),
                        specialization_repository: ServiceRepository = Depends(get_specialization_repository)) -> ServiceService:
    return ServiceService(service_repository=service_repository,
                          specialization_repository=specialization_repository)


# Order
def get_order_repository(db: Session = Depends(get_session)):
    return OrderRepository(model=Order, session=db)


def get_order_service(order_repository: OrderRepository = Depends(get_order_repository)) -> OrderService:
    return OrderService(order_repository=order_repository)

# Review
def get_review_repository(db: Session = Depends(get_session)):
    return ReviewRepository(model=Review, session=db)

def get_review_service(review_repository: ReviewRepository = Depends(get_review_repository)) -> ReviewService:
    return ReviewService(review_repository=review_repository)

# Transaction
def get_transaction_repository(db: Session = Depends(get_session)):
    return TransactionRepository(model=Transaction, session=db)

def get_transaction_service(transaction_repository: TransactionRepository = Depends(get_transaction_repository)) -> TransactionService:
    return TransactionService(transaction_repository=transaction_repository)


# Message
def get_message_repository(db: Session = Depends(get_session)):
    return MessageRepository(model=Message, session=db)

def get_message_service(message_repository: MessageRepository = Depends(get_message_repository)) -> MessageService:
    return MessageService(message_repository=message_repository)
