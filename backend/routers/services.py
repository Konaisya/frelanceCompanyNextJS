from fastapi import APIRouter, Depends, HTTPException, Query
from utils.enums import Status
from dependencies import *
from schemas.services import *
from utils.to_dict import to_dict

router = APIRouter()

@router.post('/', status_code=201)
async def create_service(new_service: CreateService,
                          service_service: ServiceService = Depends(get_service_service)):
    created_service = service_service.create_service(new_service)
    if not created_service:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return {'status': Status.SUCCESS.value}

@router.get('/', status_code=200)
async def get_all_services(name: str | None = Query(None),
                           id_specialization: int | None = Query(None),
                           id_user_executor: int | None = Query(None),
                           price: float  | None = Query(None),
                           delivery_time: int | None = Query(None),
                           service_service: ServiceService = Depends(get_service_service),
                           user_service: UserService = Depends(get_user_service)
                           ):
    filter = {k: v for k, v in locals().items() if v is not None and k not in 
              {'service_service', 'user_service'}}
    services = service_service.get_all_services_filter_by(**filter)
    if not services:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = []
    for service in services:
        user = user_service.get_user_filter_by(id=service.id_user_executor)
        executor_profile = user_service.get_executor_filter_by(id=user.id_executor_profile)

        executor_profile_dict = executor_profile.__dict__
        executor_profile_dict.pop('id')

        exec_spec = service_service.get_one_specialization_filter_by(id=executor_profile.id_specialization)
        executor_profile_dict['specialization'] = SpecializationResponse(**exec_spec.__dict__)

        user_response = ExecutorResponse(**{**user.__dict__, **executor_profile_dict})

        service_spec = service_service.get_one_specialization_filter_by(id=service.id_specialization)
        specialization_response = SpecializationResponse(**service_spec.__dict__)

        service_dict = to_dict(service)
        service_dict.update({
            'specialization': specialization_response,
            'user_executor': user_response
        })
        response.append(ServiceResponse(**service_dict))
    return response

@router.get('/{id}', status_code=200)
async def get_one_services(id: int,
                           service_service: ServiceService = Depends(get_service_service),
                           user_service: UserService = Depends(get_user_service)
                           ):
    service = service_service.get_one_service_filter_by(id=id)
    if not service:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    user = user_service.get_user_filter_by(id=service.id_user_executor)
    executor_profile = user_service.get_executor_filter_by(id=user.id_executor_profile)

    executor_profile_dict = executor_profile.__dict__
    
    exec_spec = service_service.get_one_specialization_filter_by(id=executor_profile.id_specialization)
    executor_profile_dict['specialization'] = SpecializationResponse(**exec_spec.__dict__)

    user_response = ExecutorResponse(**{**user.__dict__, **executor_profile_dict})

    service_spec = service_service.get_one_specialization_filter_by(id=service.id_specialization)
    specialization_response = SpecializationResponse(**service_spec.__dict__)

    service_dict = to_dict(service)
    service_dict.update({
        'specialization': specialization_response,
        'user_executor': user_response
    })
    return ServiceResponse(**service_dict)

@router.put('/{id}', status_code=200)
async def update_service(id: int,
                         upd_service: UpdateService,
                         service_service: ServiceService = Depends(get_service_service)
                         ):
    service = service_service.get_one_service_filter_by(id=id)
    if not service:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    updated_service = service_service.update_service(id=id, upd_service=upd_service)
    return updated_service

@router.delete('/{id}', status_code=200)
async def delete_service(id: int,
                         service_service: ServiceService = Depends(get_service_service)
                         ):
    service = service_service.get_one_service_filter_by(id=id)
    if not service:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    service_service.delete_service(id=id)
    return {'status': Status.SUCCESS.value}    