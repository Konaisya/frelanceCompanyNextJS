from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from dependencies import *
from schemas.messages import *
from utils.ws_manager import manager
from utils.to_dict import to_dict
from service.message import MessageService

router = APIRouter()

@router.get('/chats/{id_user}/messages', status_code=200)
async def get_chat_messages(id_user: int,
                            id_recipient: int,
                            id_order: Optional[int] = Query(None),
                            message_service: MessageService = Depends(get_message_service),
                            user_service: UserService = Depends(get_user_service),
                            order_service: OrderService = Depends(get_order_service),
                            ):
    messages = message_service.get_chat_messages(id_user=id_user, 
                                                 id_recipient=id_recipient, 
                                                 id_order=id_order)
    response = []
    for message in messages:
        sender = user_service.get_user_filter_by(id=message.id_user_sender)
        sender_resp = UserMessageResponse(**sender.__dict__)

        recipient = user_service.get_user_filter_by(id=message.id_user_recipient)
        recipient_resp = UserMessageResponse(**recipient.__dict__)

        order = order_service.get_one_order_filter_by(id=message.id_order)
        order_resp = ShortOrderResponse(**order.__dict__) if order else None

        message_dict = to_dict(message)
        message_dict['sender'] = sender_resp
        message_dict['recipient'] = recipient_resp
        message_dict['order'] = order_resp

        response.append(MessageResponse(**message_dict))
    return response


@router.post('/messages', status_code=201)
async def send_message(new_message: CreateMessage,
                       message_service: MessageService = Depends(get_message_service),
                       user_service: UserService = Depends(get_user_service),
                       order_service: OrderService = Depends(get_order_service),
                       current_user: User = Depends(get_current_user),
                       ):
    message_dict = new_message.model_dump()
    message_dict['id_user_sender'] = current_user.id
    message = message_service.create_message(message_dict)

    await manager.broadcast_to_chat(
        message=message_dict,
        recipient_id=message.id_user_recipient,
        sender_id=message.id_user_sender,
        order_id=message.id_order
    )
