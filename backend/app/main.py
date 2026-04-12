from fastapi import FastAPI

app = FastAPI(title="TON Auction API")


@app.get("/health")
async def health():
    return {"status": "ok"}
