from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import *
from schemas.users import *
from utils.enums import AuthStatus, Roles, Status
from utils.image import save_image

router = APIRouter()

@router.get('/me', status_code=290)
async def get_me(user_service: UserService = Depends(get_user_service),
                 service_service: ServiceService = Depends(get_service_service),
                 current_user = Depends(get_current_user)
                 ):
    user = user_service.get_user_filter_by(id=current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail={'status': AuthStatus.USER_NOT_FOUND.value})
    if user.role == Roles.EXECUTOR.value:
        executor_profile = user_service.get_executor_filter_by(id=user.id_executor_profile).__dict__

        exec_spec = service_service.get_one_specialization_filter_by(id=executor_profile['id_specialization']).__dict__
        executor_profile['specialization'] = SpecializationResponse(**exec_spec)

        response_data = {**user.__dict__, **executor_profile}
        return ExecutorResponse(**response_data)
    elif user.role == Roles.CUSTOMER.value:
        customer_profile = user_service.get_customer_filter_by(id=user.id_customer_profile).__dict__

        response_data = {**user.__dict__, **customer_profile}
        return CustomerResponse(**response_data)
    elif user.role == Roles.ADMIN.value:
        return UserResponse(**user.__dict__)

@router.get('/', status_code=200)
async def get_all_users(name: str | None = Query(None), 
                        role: Roles | None = Query(None),
                        email: str | None = Query(None),

                        id_specialization: int | None = Query(None),
                        experience: int | None = Query(None),
                        hourly_rate: float | None = Query(None),

                        user_service: UserService = Depends(get_user_service),
                        service_service: ServiceService = Depends(get_service_service)
                        ):
    filter = {k: v for k, v in locals().items() if v is not None and k not in 
              {'user_service', 'service_service', 'id_specialization', 'experience', 'hourly_rate'}}
    users = user_service.get_all_users_filter_by(**filter)
    if not users:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = []
    for user in users:
        if user.role == Roles.EXECUTOR.value:
            filter = {k: v for k, v in locals().items() if v is not None and k in
                      {'id_specialization', 'experience', 'hourly_rate'}}
            filter['id'] = user.id_executor_profile

            executor_profile = user_service.get_executor_filter_by(**filter)
            if not executor_profile:
                continue
            executor_profile_dict = executor_profile.__dict__

            exec_spec = service_service.get_one_specialization_filter_by(id=executor_profile_dict['id_specialization']).__dict__
            executor_profile_dict['specialization'] = SpecializationResponse(**exec_spec)

            response_data = {**user.__dict__, **executor_profile_dict}
            response.append(ExecutorResponse(**response_data))
        elif user.role == Roles.CUSTOMER.value:
            customer_profile = user_service.get_customer_filter_by(id=user.id_customer_profile).__dict__

            response_data = {**user.__dict__, **customer_profile}
            response.append(CustomerResponse(**response_data))
        elif user.role == Roles.ADMIN.value:
            response.append(UserResponse(**user.__dict__))
    return response

@router.get('/{id}', status_code=200)
async def get_one_user(id: int,
                       user_service: UserService = Depends(get_user_service),
                       service_service: ServiceService = Depends(get_service_service)
                       ):
    user = user_service.get_user_filter_by(id=id)
    if not user:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    if user.role == Roles.EXECUTOR.value:
        executor_profile = user_service.get_executor_filter_by(id=user.id_executor_profile).__dict__

        exec_spec = service_service.get_one_specialization_filter_by(id=executor_profile['id_specialization']).__dict__
        executor_profile['specialization'] = SpecializationResponse(**exec_spec)

        response_data = {**user.__dict__, **executor_profile}
        return ExecutorResponse(**response_data)
    elif user.role == Roles.CUSTOMER.value:
        customer_profile = user_service.get_customer_filter_by(id=user.id_customer_profile).__dict__

        response_data = {**user.__dict__, **customer_profile}
        return CustomerResponse(**response_data)
    elif user.role == Roles.ADMIN.value:
        return UserResponse(**user.__dict__)
    
@router.put('/{id}', status_code=200)
async def update_user(id: int,
                      upd_user: UpdateUser,
                      user_service: UserService = Depends(get_user_service)
                      ):
    user = user_service.get_user_filter_by(id=id)
    if not user:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    
    user_role = user.role

    if user_role == Roles.EXECUTOR.value and upd_user.executor_profile is not None:
        executor_profile = upd_user.executor_profile.model_dump()
        user_service.update_executor(id=user.id_executor_profile, data=executor_profile)

    elif user_role == Roles.CUSTOMER.value and upd_user.customer_profile is not None:
        customer_profile = upd_user.customer_profile.model_dump()
        user_service.update_customer(id=user.id_customer_profile, data=customer_profile)

    if upd_user.user is not None:
        user_data = upd_user.user.model_dump()
        updated_user = user_service.update(user_id=id, data=UserUpdate(**user_data))
    return {'status': Status.SUCCESS.value}

@router.delete('/{id}', status_code=200)
async def delete_user(id: int,
                      user_service: UserService = Depends(get_user_service)
                      ):
    user = user_service.get_user_filter_by(id=id)
    if not user:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    
    user_service.delete_user(user_id=id)
    if user.role == Roles.EXECUTOR.value:
        user_service.delete_executor(id=user.id_executor_profile)
    elif user.role == Roles.CUSTOMER.value:
        user_service.delete_customer(id=user.id_customer_profile)

    return {'status': Status.SUCCESS.value}


@router.patch('/{id}/image', status_code=200)
async def update_user_image(id: int, 
                            image: UploadFile = File(...),
                            user_service: UserService = Depends(get_user_service)):
    user = user_service.get_user_filter_by(id=id)
    if not user:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    upd_user = user_service.update_image(id, image.filename)
    image_name = save_image(image)
    return {'status': Status.SUCCESS.value, 'update_image': image_name}