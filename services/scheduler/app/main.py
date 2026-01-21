from fastapi import FastAPI
from app.scheduler import scheduler, lifespan


app = FastAPI(lifespan=lifespan)


@app.get("/status")
def get_status():
    return {"status": "Scheduler is running", "jobs": str(scheduler.get_jobs())}
