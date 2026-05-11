import asyncio
import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
from app.api.users import router as users_router
from app.api.notify import router as notify_router
from app.bot.bot import start_bot


def run_bot_in_thread():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start_bot())


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    thread = threading.Thread(target=run_bot_in_thread, daemon=True)
    thread.start()
    yield


app = FastAPI(title="TON Auction API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(notify_router)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/debug/users")
async def debug_users():
    from app.core.database import get_db
    db = await get_db()
    try:
        cursor = await db.execute("SELECT wallet_address, telegram_id, username, avatar_url FROM users")
        rows = await cursor.fetchall()
    finally:
        await db.close()
    return [{"wallet": r["wallet_address"], "tg_id": r["telegram_id"], "username": r["username"], "avatar_url": r["avatar_url"]} for r in rows]
