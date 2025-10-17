from routers.auth import router as auth_router
from routers.users import router as user_router
from .specializations import router as specialization_router
from .services import router as service_router
from .orders import router as order_router
from .transactions import router as transaction_router
from .reviews import router as review_router
from .messages import router as message_router

from fastapi import APIRouter

routers = APIRouter(prefix='/api')
routers.include_router(auth_router, prefix='/auth', tags=['auth'])
routers.include_router(user_router, prefix='/users', tags=['users'])
routers.include_router(specialization_router, prefix='/specializations', tags=['specializations'])
routers.include_router(service_router, prefix='/services', tags=['services'])
routers.include_router(order_router, prefix='/orders', tags=['orders'])
routers.include_router(transaction_router, prefix='/transactions', tags=['transactions'])
routers.include_router(review_router, prefix='/reviews', tags=['reviews'])
routers.include_router(message_router, tags=['messages'])