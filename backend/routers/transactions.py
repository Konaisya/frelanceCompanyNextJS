from fastapi import APIRouter, Depends, HTTPException, Query
from utils.enums import Status, OrderStatus
from dependencies import *
from utils.enums import *
from schemas.transactions import *
from datetime import datetime, date
from decimal import Decimal
from utils.to_dict import to_dict

router = APIRouter()

@router.post('/', status_code=201)
async def create_transaction(new_trans: CreateTransaction,
                             transaction_service: TransactionService = Depends(get_transaction_service),
                             user_service: UserService = Depends(get_user_service),
                             order_service: OrderService = Depends(get_order_service),
                             current_user: User = Depends(get_current_user),
                             ):
    new_trans_dict = new_trans.model_dump()
    new_trans_dict['id_user_sender'] = current_user.id

    sender = user_service.get_user_filter_by(id=new_trans_dict['id_user_sender'])
    recipient = user_service.get_user_filter_by(id=new_trans_dict['id_user_recipient'])
    if not sender or not recipient:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value, 'message': 'Sender or recipient not found'})
    
    amount_transaction = Decimal(str(new_trans_dict['amount']))
    service_commission = amount_transaction * Decimal('0.01')
    new_trans_dict['commission'] = float(service_commission)
    total_debit = amount_transaction + service_commission

    if new_trans_dict['type'] == TransactionType.PAYMENT.value:
        if sender.balance < total_debit:
            raise HTTPException(status_code=400, detail={'status': Status.FAILED.value, 'message': f'Недостаточно средств.'})
        
        order = order_service.get_one_order_filter_by(id=new_trans_dict['id_order'])
        if amount_transaction < order.price:
            raise HTTPException(status_code=400, detail={'status': Status.FAILED.value, 'message': f'Сумма транзакции не может быть меньше стоимости заказа {order.price}.'})
        
        sender_new_balance = sender.balance - total_debit
        user_service.update(user_id=sender.id, data=UserUpdate(balance=sender_new_balance))

        recipient_new_balance = recipient.balance + amount_transaction
        user_service.update(user_id=recipient.id, data=UserUpdate(balance=recipient_new_balance))
    elif new_trans_dict['type'] == TransactionType.DEPOSIT.value:
        sender_new_balance = sender.balance + amount_transaction
        user_service.update(user_id=sender.id, data=UserUpdate(balance=sender_new_balance))

    transaction = transaction_service.create_transaction(new_trans_dict)
    return Status.SUCCESS.value


@router.get('/', status_code=200)
async def get_all_transactions(id_order: int = Query(None),
                               id_user_sender: int = Query(None),
                               id_user_recipient: int = Query(None),
                               amount: float = Query(None),
                               commission: float = Query(None),
                               type: TransactionType = Query(None),
                               created_at: str = Query(None),
                               transaction_service: TransactionService = Depends(get_transaction_service),
                               order_service: OrderService = Depends(get_order_service),
                               user_service: UserService = Depends(get_user_service),
                               current_user: User = Depends(get_current_user)
                               ):
    filter = {k: v for k, v in locals().items() if v is not None and k
                    not in {'transaction_service', 'user_service', 'current_user', 'order_service'}}
    if current_user.role == Roles.USER.value:
        filter['id_user'] = current_user.id
    transactions = transaction_service.get_all_transactions_filter_by(**filter)
    if not transactions:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    
    response= []
    for trans in transactions:
        order = order_service.get_one_order_filter_by(id=trans.id_order)
        order_resp = ShortOrderResponse(**order.__dict__) if order else None

        sender = user_service.get_user_filter_by(id=trans.id_user_sender)
        sender_resp = UserTransactionResponse(**sender.__dict__) if sender else None

        recipient = user_service.get_user_filter_by(id=trans.id_user_recipient)
        recipient_resp = UserTransactionResponse(**recipient.__dict__) if recipient else None

        trans_dict = to_dict(trans)
        trans_dict['order'] = order_resp
        trans_dict['sender_name'] = sender_resp
        trans_dict['recipient_name'] = recipient_resp

        response.append(TransactionResponse(**trans_dict))

    return response

@router.get('/{id}', status_code=200)
async def get_one_transaction(id: int,
                              transaction_service: TransactionService = Depends(get_transaction_service),
                              order_service: OrderService = Depends(get_order_service),
                              user_service: UserService = Depends(get_user_service),
                              current_user: User = Depends(get_current_user)
                              ):
    trans = transaction_service.get_one_transaction_filter_by(id=id)
    if not trans:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    
    order = order_service.get_one_order_filter_by(id=trans.id_order)
    order_resp = ShortOrderResponse(**order.__dict__) if order else None

    sender = user_service.get_user_filter_by(id=trans.id_user_sender)
    sender_resp = UserTransactionResponse(**sender.__dict__) if sender else None

    recipient = user_service.get_user_filter_by(id=trans.id_user_recipient)
    recipient_resp = UserTransactionResponse(**recipient.__dict__) if recipient else None

    trans_dict = to_dict(trans)
    trans_dict['order'] = order_resp
    trans_dict['sender_name'] = sender_resp
    trans_dict['recipient_name'] = recipient_resp

    return TransactionResponse(**trans_dict)