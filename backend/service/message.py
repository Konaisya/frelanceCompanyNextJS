from crud.messages import *
from schemas.messages import *
from models.messages import Message

class MessageService:
    def __init__(self, message_repository: MessageRepository):
        self.message_repository = message_repository

    def get_all_messages_filter_by(self, **filters):
        return self.message_repository.get_all_filter_by(**filters)
    
    def get_one_message_filter_by(self, **filters):
        return self.message_repository.get_one_filter_by(**filters)
    
    def get_chat_messages(self, id_user: int, id_recipient: int, id_order: Optional[int] = None):
        return self.message_repository.get_all_filter_by(
            id_order=id_order
        ).filter(
            (Message.id_user_sender == id_user) | (Message.id_user_recipient == id_user),
            (Message.id_user_sender == id_recipient) | (Message.id_user_recipient == id_recipient)
        ).order_by(Message.created_at)
    
    def create_message(self, new_message: dict):
        return self.message_repository.add(new_message)
    
