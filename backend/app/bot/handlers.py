import httpx
from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message
from aiogram.exceptions import TelegramBadRequest
from app.core.config import settings
from app.core.database import get_db

router = Router()


async def get_contract_winner() -> str | None:
    """Вызывает get fun winner() на контракте через toncenter."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://testnet.toncenter.com/api/v2/runGetMethod",
            params={
                "address": settings.contract_address,
                "method": "winner",
                "stack": "[]",
            },
        )
        data = response.json()

    if not data.get("ok"):
        return None

    stack = data["result"]["stack"]
    if not stack or stack[0][0] == "null":
        return None

    # Адрес возвращается как cell, парсим из него
    try:
        cell_data = stack[0][1]
        # toncenter возвращает адрес как slice с bytes в base64
        import base64
        from pytoniq_core import Cell
        cell_bytes = base64.b64decode(cell_data["bytes"])
        cell = Cell.one_from_boc(cell_bytes)
        addr = cell.begin_parse().load_address()
        return str(addr)
    except Exception:
        return None


@router.message(Command("start"))
async def cmd_start(message: Message):
    await message.answer(
        "👋 Добро пожаловать в TON Auction!\n\n"
        "Здесь проходят аукционы за доступ в закрытый чат.\n\n"
        "Чтобы участвовать — открой мини-приложение.",
    )


@router.message(Command("startauction"))
async def cmd_startauction(message: Message):
    if message.from_user.id != settings.owner_tg_id:
        await message.answer("❌ Эта команда только для владельца.")
        return

    await message.answer(
        "🚀 Чтобы запустить новый аукцион:\n\n"
        "1. Открой мини-приложение\n"
        "2. Нажми «Запустить аукцион»\n"
        "3. Подтверди транзакцию в Tonkeeper"
    )


@router.message(Command("claim"))
async def cmd_claim(message: Message):
    telegram_id = message.from_user.id

    # Ищем кошелёк пользователя в БД
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT wallet_address FROM users WHERE telegram_id = ?",
            (telegram_id,),
        )
        row = await cursor.fetchone()
    finally:
        await db.close()

    if not row:
        await message.answer(
            "❌ Кошелёк не найден.\n\n"
            "Сначала подключи TON-кошелёк в мини-приложении."
        )
        return

    wallet_address = row["wallet_address"]

    # Получаем победителя с контракта
    winner_address = await get_contract_winner()

    if not winner_address:
        await message.answer("⏳ Аукцион ещё не завершён или победитель не определён.")
        return

    # Нормализуем оба адреса к raw формату для сравнения
    try:
        from pytoniq_core import Address as TonAddress
        def normalize(addr: str) -> str:
            return TonAddress(addr).to_str(is_user_friendly=False).lower()
        wallet_norm = normalize(wallet_address)
        winner_norm = normalize(winner_address)
    except Exception:
        wallet_norm = wallet_address.lower()
        winner_norm = winner_address.lower()

    if wallet_norm != winner_norm:
        await message.answer("❌ Твой кошелёк не является победителем этого аукциона.")
        return

    # Проверяем не отправляли ли уже инвайт
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT invite_sent FROM winners WHERE wallet_address = ?",
            (wallet_address,),
        )
        winner_row = await cursor.fetchone()
    finally:
        await db.close()

    if winner_row and winner_row["invite_sent"]:
        await message.answer("✅ Инвайт уже был отправлен ранее. Проверь личные сообщения.")
        return

    # Создаём инвайт-ссылку
    try:
        invite = await message.bot.create_chat_invite_link(
            chat_id=settings.chat_id,
            member_limit=1,
        )
    except TelegramBadRequest as e:
        await message.answer(f"❌ Не удалось создать инвайт: {e}")
        return

    # Отправляем инвайт
    await message.answer(
        f"🎉 Поздравляем! Ты победитель аукциона.\n\n"
        f"Твоя персональная ссылка для входа в чат:\n{invite.invite_link}"
    )

    # Сохраняем в БД
    db = await get_db()
    try:
        import time
        await db.execute(
            """
            INSERT INTO winners (wallet_address, invite_sent, finalized_at)
            VALUES (?, 1, ?)
            ON CONFLICT(wallet_address) DO UPDATE SET invite_sent = 1
            """,
            (wallet_address, int(time.time())),
        )
        await db.commit()
    finally:
        await db.close()
