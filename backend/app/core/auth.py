import hashlib
import hmac
import json
from urllib.parse import unquote, parse_qsl
from fastapi import Header, HTTPException
from app.core.config import settings


def verify_init_data(init_data: str) -> dict:
    """Проверяет подпись Telegram initData и возвращает данные пользователя."""
    params = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = params.pop("hash", None)

    if not received_hash:
        raise HTTPException(status_code=401, detail="Missing hash")

    # Строка для проверки: отсортированные key=value через \n
    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(params.items())
    )

    # Ключ = HMAC-SHA256("WebAppData", bot_token)
    secret_key = hmac.new(
        b"WebAppData",
        settings.bot_token.encode(),
        hashlib.sha256,
    ).digest()

    # Ожидаемый hash
    expected_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_hash, received_hash):
        raise HTTPException(status_code=401, detail="Invalid initData signature")

    # Парсим user из initData
    user_json = params.get("user")
    if not user_json:
        raise HTTPException(status_code=401, detail="Missing user in initData")

    return json.loads(unquote(user_json))


async def get_current_user(x_init_data: str = Header(...)) -> dict:
    """FastAPI dependency — проверяет initData и возвращает данные пользователя."""
    return verify_init_data(x_init_data)
