from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api.v1.daily_summary import router as daily_summary_router
from app.api.v1.periodic_summary import router as periodic_summary_router

app = FastAPI(
    title="Agent Service", root_path="/agent/api/v1", servers=[{"url": "/agent/api/v1"}]
)

app.include_router(daily_summary_router)
app.include_router(periodic_summary_router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc),
            "path": request.url.path
        }
    )

@app.get("/")
async def agent_service():
    return {"service": "agent"}
