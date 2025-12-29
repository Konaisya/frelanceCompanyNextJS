from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"User {user_id} connected. Connections: {len(self.active_connections[user_id])}")

    def disconnect(self, user_id: int, websocket: WebSocket = None):
        if user_id in self.active_connections:
            if websocket and websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not websocket:
                self.active_connections[user_id] = []
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
            print(f"User {user_id} disconnected")

    async def send_personal_message(self, message: dict, user_id: int):
        for connection in self.active_connections.get(user_id, []):
            await connection.send_json(message)

    async def broadcast_to_chat(self, message: dict, recipient_id: int, sender_id: int):
        await self.send_personal_message(message, recipient_id)
        await self.send_personal_message(message, sender_id)


manager = ConnectionManager()
