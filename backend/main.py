from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from routers import routers
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from utils.ws_manager import manager
import json
from datetime import datetime
from config.database import SessionLocal
from models.messages import Message
from models.users import User

app = FastAPI(title="Freelance API")

app.include_router(routers)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/{image_name}')
async def get_image(image_name: str):
    return FileResponse(f'./images/{image_name}')

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket.accept()
    await manager.connect(user_id, websocket)

    try:
        while True:
            data_str = await websocket.receive_text()
            data = json.loads(data_str)
            
            if data.get("type") == "message":
                sender_id = user_id
                recipient_id = data["recipient_id"]
                message = data["message"]

                message_data = {
                    "type": "message",
                    "sender_id": sender_id,
                    "recipient_id": recipient_id,
                    "message": message,
                    "created_at": datetime.now().isoformat(),
                }

                await manager.broadcast_to_chat(
                    message=message_data,
                    recipient_id=recipient_id,
                    sender_id=sender_id
                )

    except WebSocketDisconnect:
        manager.disconnect(user_id)
        print(f"User {user_id} disconnected")
