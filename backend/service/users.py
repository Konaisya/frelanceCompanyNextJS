from utils.enums import Roles, AuthStatus
from fastapi import HTTPException
from passlib.hash import pbkdf2_sha256
from schemas.users import *
from crud.users import UserRepository

class UserService:
    def __init__(self, user_repository: UserRepository,
                 executor_repository: UserRepository,
                 customer_repository: UserRepository):
        self.user_repository = user_repository
        self.executor_repository = executor_repository
        self.customer_repository = customer_repository

    def get_all_users_filter_by(self, **filter):
        users = self.user_repository.get_all_filter_by(**filter)
        return users

    def get_user_filter_by(self, **filter):
        user = self.user_repository.get_one_filter_by(**filter)
        return user

    def update(self, user_id: int, data: UserUpdate):
        entity = data.model_dump()
        user = self.user_repository.get_one_filter_by(id=user_id)
        if data.password and not pbkdf2_sha256.verify(data.password, user.password):
            raise HTTPException(status_code=403, detail={'status': AuthStatus.INVALID_PASSWORD.value})
        if data.password:
            entity['password'] = pbkdf2_sha256.hash(data.password)
        entity['id'] = user_id
        entity = {k: v for k, v in entity.items() if v is not None}
        upd_user = self.user_repository.update(entity)
        return upd_user

    def delete_user(self, user_id: int):
        return self.user_repository.delete(user_id)
    
    def update_image(self, id: int, image_name: str):
        entity = {'id': id, 'image': image_name}
        return self.user_repository.update(entity)
    

    # Executor
    def get_all_executors_filter_by(self, **filter):
        return self.executor_repository.get_all_filter_by(**filter)

    def get_executor_filter_by(self, **filter):
        return self.executor_repository.get_one_filter_by(**filter)

    def create_executor(self, data: dict):
        return self.executor_repository.add(data)

    def update_executor(self, id: int, data: dict):
        data['id'] = id
        data = {k: v for k, v in data.items() if v is not None}
        return self.executor_repository.update(data)

    def delete_executor(self, id: int):
        return self.executor_repository.delete(id)

    # Customer
    def get_all_customers_filter_by(self, **filter):
        return self.customer_repository.get_all_filter_by(**filter)

    def get_customer_filter_by(self, **filter):
        return self.customer_repository.get_one_filter_by(**filter)

    def create_customer(self, data: dict):
        return self.customer_repository.add(data)

    def update_customer(self, id: int, data: dict):
        data['id'] = id
        data = {k: v for k, v in data.items() if v is not None}
        return self.customer_repository.update(data)

    def delete_customer(self, id: int):
        return self.customer_repository.delete(id)