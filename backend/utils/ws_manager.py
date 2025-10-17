from fastapi import WebSocket
from typing import Dict
from typing import Optional

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}
    
    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
    
    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
    
    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)
    
    async def broadcast_to_chat(self, message: dict, recipient_id: int, sender_id: int, order_id: Optional[int] = None):
        for user_id in [recipient_id, sender_id]:
            if user_id in self.active_connections:
                await self.active_connections[user_id].send_json(message)

manager = ConnectionManager()