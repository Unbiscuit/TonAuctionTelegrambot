from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    bot_token: str = ""
    chat_id: int = 0
    contract_address: str = ""
    owner_tg_id: int = 0


settings = Settings()
