from enum import Enum, StrEnum

class Status(Enum):
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'
    NOT_FOUND = 'NOT_FOUND'
    UNAUTHORIZED = 'UNAUTHORIZED'

class AuthStatus(Enum):
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'
    INVALID_TOKEN = 'INVALID_TOKEN'
    INVALID_USER = 'INVALID_USER'
    INVALID_PASSWORD = 'INVALID_PASSWORD'
    INVALID_EMAIL = 'INVALID_EMAIL'
    INVALID_USERNAME = 'INVALID_USERNAME'
    INVALID_ROLE = 'INVALID_ROLE'
    INVALID_STATUS = 'INVALID_STATUS'
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
    INVALID_EMAIL_OR_PASSWORD = 'INVALID_EMAIL_OR_PASSWORD'
    TOKEN_EXPIRED = 'TOKEN_EXPIRED'
    USER_NOT_FOUND = 'USER_NOT_FOUND'
    FORBIDDEN = 'FORBIDDEN'

class Roles(StrEnum):
    ADMIN = 'ADMIN'
    EXECUTOR = 'EXECUTOR'
    CUSTOMER = 'CUSTOMER'

class OrderStatus(StrEnum):
    PENDING = 'PENDING'                     # Ожидает подтверждения
    ACCEPTED = 'ACCEPTED'                   # Исполнитель принял заказ
    IN_WORK = 'IN_WORK'                     # В работе
    AWAITING_PAYMENT = 'AWAITING_PAYMENT'   # Ожидает оплаты
    COMPLETED = 'COMPLETED'                 # Завершен
    CANCELLED = 'CANCELLED'                 # Отменен

class TransactionType(StrEnum):
    DEPOSIT = 'DEPOSIT'          # Пополнение
    WITHDRAWAL = 'WITHDRAWAL'    # Вывод
    PAYMENT = 'PAYMENT'          # Оплата заказа
    REFUND = 'REFUND'            # Возврат средств
    CORRECTION = 'CORRECTION'    # Корректировка
