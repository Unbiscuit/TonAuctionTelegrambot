from aiogram import Bot, Dispatcher
from app.core.config import settings
from app.bot.handlers import router

bot = Bot(token=settings.bot_token)
dp = Dispatcher()
dp.include_router(router)


async def start_bot():
    await dp.start_polling(bot)
