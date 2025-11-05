from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from routers import routers
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from utils.ws_manager import manager

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
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id)
