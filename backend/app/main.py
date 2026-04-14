import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.database import init_db
from app.api.users import router as users_router
from app.api.notify import router as notify_router
from app.bot.bot import start_bot


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    asyncio.create_task(start_bot())
    yield


app = FastAPI(title="TON Auction API", lifespan=lifespan)

app.include_router(users_router)
app.include_router(notify_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
