from fastapi import HTTPException, Query
from ..router import router
from ..lib.validations.book import Book, CreateBook, SortBooksRequest
from ..lib.db import books_db, book_id_counter
from ..lib.utils import get_book_index, format_response

def filter_books_by_search(books, search_term=None):
    if not search_term:
        return books
    
    search_term = search_term.lower()
    filtered_books = []
    
    for book in books:
        if (search_term in book.title.lower() or 
            search_term in book.author.lower() or 
            search_term in str(book.year).lower()):
            filtered_books.append(book)
            
    return filtered_books

@router.get("/books")
def get_books(search: str = Query(None, description="Search term to filter books")):
    books = books_db[::-1]
    if search:
        books = filter_books_by_search(books, search)
    return format_response(data=books)

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
def sort_books(req: SortBooksRequest, search: str = Query(None, description="Search term to filter books")):
    key = req.sort_by
    if (key not in ["title", "author", "year"]):
        raise HTTPException(status_code=400, detail="Invalid sort_by key")
    
    books = req.books.copy()
    
    if search:
        books = filter_books_by_search(books, search)
    
    n = len(books)
    for i in range(n):
        for j in range(0, n-i-1):
            a = getattr(books[j], key)
            b = getattr(books[j+1], key)
            if str(a).lower() > str(b).lower():
                books[j], books[j+1] = books[j+1], books[j]
                
    return format_response(data=books)

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