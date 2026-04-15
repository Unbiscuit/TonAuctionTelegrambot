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


@app.get("/debug/users")
async def debug_users():
    from app.core.database import get_db
    db = await get_db()
    try:
        cursor = await db.execute("SELECT wallet_address, telegram_id, username FROM users")
        rows = await cursor.fetchall()
    finally:
        await db.close()
    return [{"wallet": r["wallet_address"], "tg_id": r["telegram_id"], "username": r["username"]} for r in rows]
