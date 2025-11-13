from fastapi import APIRouter, Depends, HTTPException, Query
from dependencies import *
from utils.enums import *
from schemas.orders import *
from datetime import datetime, date
from utils.to_dict import to_dict

router = APIRouter()

@router.post('/', status_code=201)
async def create_order(new_order: CreateOrder,
                       order_service: OrderService = Depends(get_order_service),
                       current_user = Depends(get_current_user)
                       ):
    new_order_dict = new_order.model_dump()
    new_order_dict['id_user_customer'] = current_user.id
    created_order = order_service.create_order(new_order_dict)
    if not created_order:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return created_order

@router.get('/')
async def get_all_orders(id_user_customer: int | None = Query(None),
                         id_user_executor: int | None = Query(None),
                         id_service: int | None = Query(None),
                         status: str | None = Query(None),
                         price: float | None = Query(None),
                         name: str | None = Query(None),
                         created_at: datetime | None = Query(None),
                         updated_at: datetime | None = Query(None),
                         deadline: datetime | None = Query(None),
                         order_service: OrderService = Depends(get_order_service),
                         user_service: UserService = Depends(get_user_service),
                         service_service: ServiceService = Depends(get_service_service),
                         current_user = Depends(get_current_user),
                         ):
    filter = {k: v for k, v in locals().items() if v is not None and k not in 
              {'order_service', 'service_service', 'user_service', 'current_user'}}
    if current_user.role == Roles.CUSTOMER.value:
        filter['id_user_customer'] = current_user.id
    elif current_user.role == Roles.EXECUTOR.value:
        filter['id_user_executor'] = current_user.id
    orders = order_service.get_all_orders_filter_by(**filter)
    if not orders:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = []
    for order in orders:
        user_customer = user_service.get_user_filter_by(id=order.id_user_customer)
        customer_profile = user_service.get_customer_filter_by(id=user_customer.id_customer_profile)
        customer_response_dict = {**user_customer.__dict__, **customer_profile.__dict__}
        customer_response = CustomerResponse(**customer_response_dict)

        user_executor = user_service.get_user_filter_by(id=order.id_user_executor)
        executor_profile = user_service.get_executor_filter_by(id=user_executor.id_executor_profile)
        exec_spec = service_service.get_one_specialization_filter_by(id=executor_profile.id_specialization)
        executor_profile_dict = executor_profile.__dict__
        executor_profile_dict['specialization'] = SpecializationResponse(**exec_spec.__dict__)
        executor_response_dict = {**user_executor.__dict__, **executor_profile_dict}
        executor_response = ExecutorResponse(**executor_response_dict)

        service = service_service.get_one_service_filter_by(id=order.id_service)
        service_spec = service_service.get_one_specialization_filter_by(id=service.id_specialization)
        service_dict = to_dict(service)
        service_dict['specialization'] = SpecializationResponse(**service_spec.__dict__)
        service_response = ShortServiceResponse(**service_dict)

        order_dict = to_dict(order)
        order_dict.update({
            'user_customer': customer_response,
            'user_executor': executor_response,
            'service': service_response,
        })
        response.append(OrderResponse(**order_dict))
    return response

@router.get('/{id}', status_code=200)
async def get_one_order(id: int,
                        order_service: OrderService = Depends(get_order_service),
                        user_service: UserService = Depends(get_user_service),
                        service_service: ServiceService = Depends(get_service_service),
                        current_user = Depends(get_current_user),
                        ):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    user_customer = user_service.get_user_filter_by(id=order.id_user_customer)
    customer_profile = user_service.get_customer_filter_by(id=user_customer.id_customer_profile)
    customer_response_dict = {**user_customer.__dict__, **customer_profile.__dict__}
    customer_response = CustomerResponse(**customer_response_dict)

    user_executor = user_service.get_user_filter_by(id=order.id_user_executor)
    executor_profile = user_service.get_executor_filter_by(id=user_executor.id_executor_profile)
    exec_spec = service_service.get_one_specialization_filter_by(id=executor_profile.id_specialization)
    executor_profile_dict = executor_profile.__dict__
    executor_profile_dict['specialization'] = SpecializationResponse(**exec_spec.__dict__)
    executor_response_dict = {**user_executor.__dict__, **executor_profile_dict}
    executor_response = ExecutorResponse(**executor_response_dict)

    service = service_service.get_one_service_filter_by(id=order.id_service)
    service_spec = service_service.get_one_specialization_filter_by(id=service.id_specialization)
    service_dict = to_dict(service)
    service_dict['specialization'] = SpecializationResponse(**service_spec.__dict__)
    service_response = ShortServiceResponse(**service_dict)

    order_dict = to_dict(order)
    order_dict.update({
        'user_customer': customer_response,
        'user_executor': executor_response,
        'service': service_response,
    })
    return OrderResponse(**order_dict)
    
@router.put('/{id}', status_code=200)
async def update_order(id: int,
                       upd_order: UpdateOrder,
                       order_service: OrderService = Depends(get_order_service),
                       #current_user = Depends(get_current_user),
                       ):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    upd_order_dict = upd_order.model_dump()
    upd_order_dict['updated_at'] = datetime.now()
    updated_order = order_service.update_order(id=id, entity=upd_order_dict)
    return updated_order

@router.delete('/{id}', status_code=200)
async def delete_order(id: int, 
                       order_service: OrderService = Depends(get_order_service),
                       current_user = Depends(get_current_user),
                       ):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    order_service.delete_order(id=id)
    return {'status': Status.SUCCESS.value}
