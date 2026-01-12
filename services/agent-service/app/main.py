from fastapi import FastAPI
from app.api.v1.daily_summary import router as daily_summary_router
from app.api.v1.periodic_summary import router as periodic_summary_router

app = FastAPI(
    title="Agent Service", root_path="/agent/api/v1", servers=[{"url": "/agent/api/v1"}]
)

app.include_router(daily_summary_router)
app.include_router(periodic_summary_router)


@app.get("/")
async def agent_service():
    return {"service": "agent"}
