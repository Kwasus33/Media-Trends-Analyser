from fastapi import FastAPI


app = FastAPI()


@app.get("/")
async def scrapper_service():
    return {"service": "data-scrapper"}
