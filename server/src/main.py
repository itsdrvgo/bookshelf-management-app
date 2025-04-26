from fastapi import FastAPI, Depends
from .router import router
from dotenv import load_dotenv
from .lib.utils import validate_api_key
from .routes import books
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, dependencies=[Depends(validate_api_key)])
