from fastapi import APIRouter, Depends, HTTPException, Cookie, Request, Form
from fastapi.responses import JSONResponse
from dependencies import *
from schemas.users import *
from utils.enums import Status
from datetime import timedelta
from pydantic import EmailStr

router = APIRouter()

from fastapi import HTTPException
from typing import Optional

@router.post('/signup', status_code=201)
async def signup(new_user: CreateUser,
                 auth_service: AuthService = Depends(get_auth_service),
                 user_service: UserService = Depends(get_user_service)
                 ):
    try:
        user_data = new_user.user.model_dump()
        user_role = user_data['role']
        user_email = user_data['email']
        user_password = user_data['password']

        if user_role == Roles.ADMIN.value:
            if new_user.executor_profile or new_user.customer_profile:
                raise HTTPException(
                    status_code=400,
                    detail={'status': Status.FAILED.value, 'message': 'Admin should not have any profiles'}
                )

        elif user_role == Roles.EXECUTOR.value:
            if not new_user.executor_profile:
                raise HTTPException(
                    status_code=400,
                    detail={'status': Status.FAILED.value, 'message': 'Executor profile is required for EXECUTOR role'}
                )
            if new_user.customer_profile:
                raise HTTPException(
                    status_code=400,
                    detail={'status': Status.FAILED.value, 'message': 'Customer profile is not allowed for EXECUTOR role'}
                )
            executor_profile = new_user.executor_profile.model_dump()
            executor = user_service.create_executor(executor_profile)
            if not executor:
                raise HTTPException(
                    status_code=400,
                    detail={'status': Status.FAILED.value, 'message': 'Failed to create executor profile'}
                )
            user_data['id_executor_profile'] = executor.id

        elif user_role == Roles.CUSTOMER.value:
            if not new_user.customer_profile:
                raise HTTPException(
                    status_code=400,
                    detail={'status': Status.FAILED.value, 'message': 'Customer profile is required for CUSTOMER role'}
                )
            if new_user.executor_profile:
                raise HTTPException(
                    status_code=400,
                    detail={'status': Status.FAILED.value, 'message': 'Executor profile is not allowed for CUSTOMER role'}
                )
            customer_profile = new_user.customer_profile.model_dump()
            customer = user_service.create_customer(customer_profile)
            if not customer:
                raise HTTPException(
                    status_code=400,
                    detail={'status': Status.FAILED.value, 'message': 'Failed to create customer profile'}
                )
            user_data['id_customer_profile'] = customer.id
            
        else:
            raise HTTPException(
                status_code=400,
                detail={'status': Status.FAILED.value, 'message': f'Invalid role: {user_role}'}
            )

        create_user = auth_service.create_user(user_data)
        if not create_user:
            raise HTTPException(
                status_code=400,
                detail={'status': Status.FAILED.value, 'message': 'Failed to create user'}
            )

        token, update_token = auth_service.login(UserLogin(email=user_email, password=user_password))
        response = JSONResponse(content=token)
        response.set_cookie(key='update_token', value=update_token, httponly=True, max_age=60*60*24*7)
        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={'status': Status.FAILED.value, 'error': str(e)}
        )

@router.post('/login', status_code=200)
async def login(email: EmailStr = Form(...), password = Form(...), auth_service: AuthService = Depends(get_auth_service)):
    token, update_token = auth_service.login(UserLogin(email=email, password=password))
    response = JSONResponse(content=token)
    response.set_cookie(key='update_token', value=update_token, httponly=True, max_age=60*60*24*7)
    return response

@router.get('/refresh', status_code=200)
async def refresh(request: Request, auth_service: AuthService = Depends(get_auth_service)):
    token = request.cookies.get('update_token')
    if not token:
        raise HTTPException(status_code=401, detail={'status': Status.UNAUTHORIZED.value})
    new_token, update_token = auth_service.refresh_token(token)
    response = JSONResponse(content=new_token)
    response.set_cookie(key='update_token', value=update_token, httponly=True, max_age=timedelta(days=60).total_seconds())
    return response

@router.get('/logout', status_code=200)
async def logout(user = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail={'status': Status.UNAUTHORIZED.value})
    response = JSONResponse(content={'status': Status.SUCCESS.value})
    response.delete_cookie(key='update_token')
    return response
