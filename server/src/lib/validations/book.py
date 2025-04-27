from pydantic import BaseModel, Field
from typing import Optional

class Book(BaseModel):
    id: int
    title: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)
    year: int
    genre: str = Field(..., min_length=1)

class CreateBook(BaseModel):
    title: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)
    year: int
    genre: str = Field(..., min_length=1)

class SortBooksRequest(BaseModel):
    books: Optional[list[Book]] = None
    sort_by: str
