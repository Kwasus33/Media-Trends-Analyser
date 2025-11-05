from fastapi import FastAPI


app = FastAPI()


@app.get("/")
async def agent_service():
    return {"service": "agent"}
