import httpx
from app.core.config import settings


async def get_avatar_url(telegram_id: int) -> str | None:
    """Получает URL аватарки пользователя через Telegram Bot API."""
    async with httpx.AsyncClient() as client:
        # Получаем список фото профиля
        response = await client.get(
            f"https://api.telegram.org/bot{settings.bot_token}/getUserProfilePhotos",
            params={"user_id": telegram_id, "limit": 1},
        )
        data = response.json()

        if not data.get("ok") or not data["result"]["total_count"]:
            return None

        file_id = data["result"]["photos"][0][-1]["file_id"]

        # Получаем путь к файлу
        response = await client.get(
            f"https://api.telegram.org/bot{settings.bot_token}/getFile",
            params={"file_id": file_id},
        )
        data = response.json()

        if not data.get("ok"):
            return None

        file_path = data["result"]["file_path"]
        return f"https://api.telegram.org/file/bot{settings.bot_token}/{file_path}"
