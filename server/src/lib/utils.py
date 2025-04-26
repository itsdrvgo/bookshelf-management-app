from typing import Optional
from fastapi import HTTPException, Header
import os
from .db import books_db

def validate_api_key(x_api_key: Optional[str] = Header(None)):
    if x_api_key != os.environ.get("API_SECRET"):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    
def get_book_index(book_id: int) -> int:
    for index, book in enumerate(books_db):
        if book.id == book_id:
            return index
    return -1

def format_response(data=None, success=True, message=None):
    response = {"success": success}
    if message:
        response["longMessage"] = message
    if data is not None:
        response["data"] = data
    return response