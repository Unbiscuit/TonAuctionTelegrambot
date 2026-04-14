from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.telegram import get_avatar_url

router = APIRouter(prefix="/api/users", tags=["users"])


class ConnectWalletRequest(BaseModel):
    wallet_address: str
    username: str | None = None
    avatar_url: str | None = None


@router.post("/connect")
async def connect_wallet(
    body: ConnectWalletRequest,
    user: dict = Depends(get_current_user),
):
    telegram_id = user["id"]
    db = await get_db()
    try:
        await db.execute(
            """
            INSERT INTO users (wallet_address, telegram_id, username, avatar_url)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(wallet_address) DO UPDATE SET
                telegram_id = excluded.telegram_id,
                username    = excluded.username,
                avatar_url  = excluded.avatar_url
            """,
            (body.wallet_address, telegram_id, body.username, body.avatar_url),
        )
        await db.commit()
    finally:
        await db.close()

    return {"ok": True}


@router.get("/by-wallet")
async def get_user_by_wallet(wallet: str):
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT telegram_id, username, avatar_url FROM users WHERE wallet_address = ?",
            (wallet,),
        )
        row = await cursor.fetchone()
    finally:
        await db.close()

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "telegram_id": row["telegram_id"],
        "username": row["username"],
        "avatar_url": row["avatar_url"],
    }


@router.get("/avatar")
async def get_avatar(user: dict = Depends(get_current_user)):
    telegram_id = user["id"]
    avatar_url = await get_avatar_url(telegram_id)
    return {"avatar_url": avatar_url}


@router.get("/me")
async def get_profile(user: dict = Depends(get_current_user)):
    telegram_id = user["id"]
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT wallet_address, username, avatar_url FROM users WHERE telegram_id = ?",
            (telegram_id,),
        )
        row = await cursor.fetchone()
    finally:
        await db.close()

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "wallet_address": row["wallet_address"],
        "username": row["username"],
        "avatar_url": row["avatar_url"],
    }
