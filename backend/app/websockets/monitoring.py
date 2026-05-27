import asyncio
import random
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["realtime monitoring"])


@router.websocket("/ws/monitoring")
async def monitoring_socket(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "soil_moisture": round(35 + random.random() * 35, 1),
                    "temperature_c": round(22 + random.random() * 10, 1),
                    "humidity": round(50 + random.random() * 40, 1),
                    "sensor_status": "online",
                    "alerts": random.choice([[], ["Irrigation window recommended"], ["Disease scan due today"]]),
                }
            )
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        return
