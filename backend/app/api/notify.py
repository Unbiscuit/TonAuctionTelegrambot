from fastapi import APIRouter
from pydantic import BaseModel
from app.core.database import get_db
from app.bot.bot import bot
from app.core.config import settings

router = APIRouter(prefix="/api/notify", tags=["notify"])


class BidNotification(BaseModel):
    outbid_wallet: str   # кого перебили
    new_amount: float    # новая ставка в TON


class FinalizedNotification(BaseModel):
    winner_wallet: str   # победитель


async def get_telegram_id(wallet_address: str) -> int | None:
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT telegram_id FROM users WHERE wallet_address = ?",
            (wallet_address,),
        )
        row = await cursor.fetchone()
        return row["telegram_id"] if row else None
    finally:
        await db.close()


@router.post("/bid")
async def notify_bid(body: BidNotification):
    """Фронтенд вызывает когда кто-то перебил ставку."""
    telegram_id = await get_telegram_id(body.outbid_wallet)
    if telegram_id:
        await bot.send_message(
            telegram_id,
            f"😔 Твою ставку перебили!\n\n"
            f"Новая ставка: {body.new_amount:.2f} TON\n\n"
            f"Открой мини-приложение чтобы сделать новую ставку.",
        )
    return {"ok": True}


@router.post("/finalized")
async def notify_finalized(body: FinalizedNotification):
    """Фронтенд вызывает когда аукцион финализирован."""
    telegram_id = await get_telegram_id(body.winner_wallet)
    if telegram_id:
        await bot.send_message(
            telegram_id,
            f"🏆 Поздравляем! Ты победил в аукционе!\n\n"
            f"Напиши /claim чтобы получить доступ в закрытый чат.",
        )

    # Уведомляем владельца
    await bot.send_message(
        settings.owner_tg_id,
        f"✅ Аукцион завершён!\n\n"
        f"Победитель: `{body.winner_wallet}`",
    )

    return {"ok": True}
