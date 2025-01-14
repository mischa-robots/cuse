import os
import subprocess
import base64
from fastapi import APIRouter, HTTPException
from typing import Dict
from pydantic import BaseModel

class TypeTextRequest(BaseModel):
    text: str
    display_num: int = 1
    typing_delay: int = 12
    typing_group_size: int = 50

class KeyPressRequest(BaseModel):
    key: str
    display_num: int = 1

class MouseMoveRequest(BaseModel):
    x: int
    y: int
    display_num: int = 1

class DisplayRequest(BaseModel):
    display_num: int = 1

router = APIRouter(prefix="/computer", tags=["computer"])

@router.get("/screenshot")
async def screenshot(display_num: int = 1) -> str:
    try:
        path = f"./screenshot_{subprocess.getoutput('date +%Y-%m-%dT%H:%M:%S')}.png"
        subprocess.getoutput(f"DISPLAY=:{display_num} scrot -p {path}")
        with open(path, 'rb') as image_file:
            image = base64.b64encode(image_file.read()).decode('utf-8')
        os.remove(path)
        return image
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/key")
async def key(body: KeyPressRequest) -> None:
    try:
        subprocess.getoutput(f"DISPLAY=:{body.display_num} xdotool key -- {body.key}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/type")
async def type_text(body: TypeTextRequest) -> None:
    try:
        groups = body.text.split(f".{1,body.typing_group_size}")
        for group in groups:
            subprocess.getoutput(f"DISPLAY=:{body.display_num} xdotool type --delay {body.typing_delay} -- {group}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mouse-move")
async def mouse_move(body: MouseMoveRequest) -> None:
    try:
        subprocess.getoutput(f"DISPLAY=:{body.display_num} xdotool mousemove --sync {body.x} {body.y}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/left-click")
async def left_click(body: DisplayRequest) -> None:
    try:
        subprocess.getoutput(f"DISPLAY=:{body.display_num} xdotool click --repeat 1 --delay 100 1")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/right-click")
async def right_click(body: DisplayRequest) -> None:
    try:
        subprocess.getoutput(f"DISPLAY=:{body.display_num} xdotool click --repeat 1 --delay 100 3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/middle-click")
async def middle_click(body: DisplayRequest) -> None:
    try:
        subprocess.getoutput(f"DISPLAY=:{body.display_num} xdotool click --repeat 1 --delay 100 2")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/double-click")
async def double_click(body: DisplayRequest) -> None:
    try:
        subprocess.getoutput(f"DISPLAY=:{body.display_num} xdotool click --repeat 2 --delay 100 1")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cursor-position")
async def cursor_position(display_num: int = 1) -> Dict[str, int]:
    try:
        res = subprocess.getoutput(f"DISPLAY=:{display_num} xdotool getmouselocation --shell")
        x = int(res.split("X=")[1].split("\n")[0])
        y = int(res.split("Y=")[1].split("\n")[0])
        return {"x": x, "y": y}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
