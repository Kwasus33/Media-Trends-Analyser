from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.v1.articles import router as data_router


app = FastAPI()
app.include_router(data_router)


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exception: ValueError):
    return JSONResponse(status_code=404, content={"detail": str(exception)})


@app.exception_handler(RuntimeError)
async def runtime_error_handler(request: Request, exception: RuntimeError):
    return JSONResponse(
        status_code=500, content={"detail": "Internal configuration error"}
    )


@app.exception_handler(Exception)
async def exception_error_handler(request: Request, exception: Exception):
    return JSONResponse(
        status_code=502, content={"detail": "Error communicating with external source"}
    )


@app.get("/")
async def scrapper_service():
    return {"service": "data-scraper"}
