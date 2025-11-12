from fastapi import FastAPI


app = FastAPI()


@app.get("/")
def api_gateway():
    return {"service": "api-gateway"}
