import aiosqlite
from pathlib import Path

DB_PATH = Path(__file__).parent.parent.parent / "data" / "auction.db"


async def get_db() -> aiosqlite.Connection:
    DB_PATH.parent.mkdir(exist_ok=True)
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    return db


async def init_db():
    DB_PATH.parent.mkdir(exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                wallet_address TEXT PRIMARY KEY,
                telegram_id    INTEGER NOT NULL,
                username       TEXT,
                avatar_url     TEXT
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS winners (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                wallet_address   TEXT NOT NULL,
                invite_sent      INTEGER NOT NULL DEFAULT 0,
                finalized_at     INTEGER NOT NULL
            )
        """)
        await db.commit()
