from aiogram import Bot, Dispatcher
from app.core.config import settings
from app.bot.handlers import router

bot = Bot(token=settings.bot_token)
dp = Dispatcher()
dp.include_router(router)


async def start_bot():
    import asyncio
    while True:
        try:
            await dp.start_polling(bot, handle_signals=False)
        except Exception as e:
            print(f"Bot polling error: {e}, restarting in 5s...")
            await asyncio.sleep(5)
