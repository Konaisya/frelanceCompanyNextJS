# utils/websocket_handler.py
import json
from datetime import datetime
from config.database import SessionLocal
from models.messages import Message
from models.users import User
from utils.ws_manager import manager

async def process_websocket_message(
    user_id: int,
    recipient_id: int,
    message_text: str,
    order_id: int = None
):
    db = SessionLocal()
    
    try:
        new_message = Message(
            id_user_sender=user_id,
            id_user_recipient=recipient_id,
            id_order=order_id,
            message=message_text,
            created_at=datetime.now()
        )
        
        db.add(new_message)
        db.commit()
        db.refresh(new_message)
        sender = db.query(User).filter(User.id == user_id).first()
        recipient = db.query(User).filter(User.id == recipient_id).first()

        message_data = {
            "id": new_message.id,
            "type": "message",
            "sender_id": user_id,
            "recipient_id": recipient_id,
            "message": message_text,
            "order_id": order_id,
            "created_at": new_message.created_at.isoformat(),
            "sender": {
                "id": sender.id if sender else None,
                "name": sender.name if sender else "Unknown",
                "email": sender.email if sender else ""
            },
            "recipient": {
                "id": recipient.id if recipient else None,
                "name": recipient.name if recipient else "Unknown",
                "email": recipient.email if recipient else ""
            }
        }
        
        await manager.broadcast_to_chat(
            message=message_data,
            recipient_id=recipient_id,
            sender_id=user_id,
            order_id=order_id
        )
        
    except Exception as e:
        print(f"Error processing WebSocket message: {e}")
        raise
    finally:
        db.close()