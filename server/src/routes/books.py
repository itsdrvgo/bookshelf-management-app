from fastapi import HTTPException, Query
from ..router import router
from ..lib.validations.book import Book, CreateBook, SortBooksRequest
from ..lib.db import books_db, book_id_counter
from ..lib.utils import get_book_index, format_response, merge_sort, bubble_sort, filter_books_by_search
from typing import Optional
from ..config.const import DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_PAGE_SIZE

@router.get("/books")
def get_books(
    search: str = Query(None, description="Search term to filter books"),
    page: int = Query(DEFAULT_PAGINATION_PAGE, description="Page number, starting from 1", ge=1),
    page_size: int = Query(DEFAULT_PAGINATION_PAGE_SIZE, description="Number of books per page", ge=1, le=50)
):
    books = books_db[::-1]
    if search:
        books = filter_books_by_search(books, search)
    
    total_books = len(books)
    total_pages = (total_books + page_size - 1) // page_size
    
    start_idx = (page - 1) * page_size
    end_idx = min(start_idx + page_size, total_books)
    paginated_books = books[start_idx:end_idx]
    
    return format_response(data={
        "books": paginated_books,
        "pagination": {
            "total": total_books,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    })

@router.get("/books/{book_id}")
def get_book(book_id: int):
    index = get_book_index(book_id)
    if index == -1:
        raise HTTPException(status_code=404, detail="Book not found")
    return format_response(data=books_db[index])

@router.post("/books")
def bulk_create_books(values: list[CreateBook]):
    global book_id_counter
    new_books = []
    for value in values:
        new_book = Book(id=book_id_counter, **value.model_dump())
        book_id_counter += 1
        books_db.append(new_book)
        new_books.append(new_book)
    return format_response(data=new_books)

@router.post("/books/sort")
def sort_books(
    req: SortBooksRequest, 
    search: str = Query(None, description="Search term to filter books"),
    page: int = Query(DEFAULT_PAGINATION_PAGE, description="Page number, starting from 1", ge=1),
    page_size: int = Query(DEFAULT_PAGINATION_PAGE_SIZE, description="Number of books per page", ge=1, le=50)
):
    key = req.sort_by
    if (key not in ["title", "author", "year"]):
        raise HTTPException(status_code=400, detail="Invalid sort_by key")
    
    books = books_db.copy()
    
    if search:
        books = filter_books_by_search(books, search)
    
    books = merge_sort(books, key)
    # books = bubble_sort(books, key)
    
    total_books = len(books)
    total_pages = (total_books + page_size - 1) // page_size
    
    start_idx = (page - 1) * page_size
    end_idx = min(start_idx + page_size, total_books)
    paginated_books = books[start_idx:end_idx]
    
    return format_response(data={
        "books": paginated_books,
        "pagination": {
            "total": total_books,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    })

@router.patch("/books/{book_id}")
def update_book(book_id: int, values: CreateBook):
    index = get_book_index(book_id)
    if (index == -1):
        raise HTTPException(status_code=404, detail="Book not found")
    books_db[index] = Book(id=book_id, **values.model_dump())
    return format_response(data=books_db[index])

@router.delete("/books/{book_id}")
def delete_book(book_id: int):
    index = get_book_index(book_id)
    if (index == -1):
        raise HTTPException(status_code=404, detail="Book not found")
    deleted_book = books_db.pop(index)
    return format_response(data=deleted_book)