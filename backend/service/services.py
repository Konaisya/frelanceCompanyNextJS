from schemas.specializations import *
from schemas.services import *
from crud.services import *

class ServiceService:
    def __init__(self, service_repository: ServiceRepository, 
                 specialization_repository: ServiceRepository):
        self.service_repository = service_repository
        self.specialization_repository = specialization_repository

    # Specialization
    def get_all_specializations_filter_by(self, **filter):
        return self.specialization_repository.get_all_filter_by(**filter)
    
    def get_one_specialization_filter_by(self, **filter):
        return self.specialization_repository.get_one_filter_by(**filter)

    def create_specialization(self, data: CreateSpecialization):
        return self.specialization_repository.add(data.model_dump())

    def update_specialization(self, id: int, upd_specialization: UpdateSpecialization):
        entity = upd_specialization.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.specialization_repository.update(entity)
    
    def delete_specialization(self, id: int):
        return self.specialization_repository.delete(id)

    # Service
    def get_all_services_filter_by(self, **filter):
        return self.service_repository.get_all_filter_by(**filter)
    
    def get_one_service_filter_by(self, **filter):
        return self.service_repository.get_one_filter_by(**filter)

    def create_service(self, data: CreateService):
        return self.service_repository.add(data.model_dump())

    def update_service(self, id: int, upd_service: UpdateService):
        entity = upd_service.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.service_repository.update(entity)

    def delete_service(self, id: int):
        return self.service_repository.delete(id)