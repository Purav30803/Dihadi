from fastapi import FastAPI
from app.api.routes import users

app = FastAPI()

app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI User Signup API!"}
