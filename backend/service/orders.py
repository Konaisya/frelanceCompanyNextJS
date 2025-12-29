from schemas.orders import *
from crud.orders import *
from crud.services import ServiceRepository

class OrderService:
    def __init__(self, order_repository: OrderRepository, service_repository: ServiceRepository):
        self.order_repository = order_repository
        self.service_repository = service_repository

    # Order
    def get_all_orders_filter_by(self, **filter):
        return self.order_repository.get_all_filter_by(**filter)

    def get_one_order_filter_by(self, **filter):
        return self.order_repository.get_one_filter_by(**filter)
    
    def create_order(self, new_order: dict):
        if not new_order.get('id_user_executor'):
            service = self.service_repository.get_one_filter_by(id=new_order['id_service'])
            new_order['id_user_executor'] = service.id_user_executor
        return self.order_repository.add(new_order)
    
    def update_order(self, id: int, entity: dict):
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.order_repository.update(entity)
    
    def delete_order(self, id: int):
        return self.order_repository.delete(id)