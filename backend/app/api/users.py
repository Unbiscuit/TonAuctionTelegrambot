from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.telegram import get_avatar_url
from pytoniq_core import Address as TonAddress


def normalize_address(addr: str) -> str:
    """Приводит TON-адрес к raw формату 0:hash для единообразного хранения."""
    try:
        return TonAddress(addr).to_str(is_user_friendly=False).lower()
    except Exception:
        return addr.lower()

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
    normalized = normalize_address(body.wallet_address)
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
            (normalized, telegram_id, body.username, body.avatar_url),
        )
        await db.commit()
    finally:
        await db.close()

    return {"ok": True}


@router.get("/by-wallet")
async def get_user_by_wallet(wallet: str):
    normalized = normalize_address(wallet)
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT telegram_id, username, avatar_url FROM users WHERE wallet_address = ?",
            (normalized,),
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
