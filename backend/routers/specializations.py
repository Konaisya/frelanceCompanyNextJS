from fastapi import APIRouter, Depends, HTTPException, Query
from utils.enums import Status
from dependencies import *
from schemas.specializations import *

router = APIRouter()

@router.post('/', status_code=201)
async def create_specialization(data: CreateSpecialization,
                                service_service: ServiceService = Depends(get_service_service)):
    new_specialization = service_service.create_specialization(data)
    return new_specialization

@router.get('/', status_code=200)
async def get_all_specializations(name: str | None = Query(None),
                                  service_service: ServiceService = Depends(get_service_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != 'service_service'}
    specializations = service_service.get_all_specializations_filter_by(**filter)
    if not specializations:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    return [SpecializationResponse(**spec.__dict__) for spec in specializations]

@router.get('/{id}', status_code=200)
async def get_one_specialization(id: int,
                                  service_service: ServiceService = Depends(get_service_service)):
    specialization = service_service.get_one_specialization_filter_by(id=id)
    if not specialization:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    return SpecializationResponse(**specialization.__dict__)

@router.put('/{id}', status_code=200)
async def update_specialization(id: int, 
                                data: UpdateSpecialization,
                                service_service: ServiceService = Depends(get_service_service)):
    specialization = service_service.get_one_specialization_filter_by(id=id)
    if not specialization:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    updated_specialization = service_service.update_specialization(id=id, upd_specialization=data)
    return updated_specialization

@router.delete('/{id}', status_code=200)
async def delete_specialization(id: int,
                                service_service: ServiceService = Depends(get_service_service)):
    specialization = service_service.get_one_specialization_filter_by(id=id)
    if not specialization:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    service_service.delete_specialization(id=id)
    return {'status': Status.SUCCESS.value}
