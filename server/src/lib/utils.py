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

def format_response(data=None, success=True, message=None):
    response = {"success": success}
    if message:
        response["longMessage"] = message
    if data is not None:
        response["data"] = data
    return response

def bubble_sort(items: list, key: str):
    result = items.copy()
    n = len(result)

    for i in range(n):
        for j in range(0, n-i-1):
            a = getattr(result[j], key)
            b = getattr(result[j+1], key)
            if str(a).lower() > str(b).lower():
                result[j], result[j+1] = result[j+1], result[j]

    return result

def merge_sort(items: list, key: str):
    if len(items) <= 1:
        return items
    
    items_copy = items.copy()
    
    mid = len(items_copy) // 2
    left_half = items_copy[:mid]
    right_half = items_copy[mid:]
    
    left_half = merge_sort(left_half, key)
    right_half = merge_sort(right_half, key)
    
    return _merge(left_half, right_half, key)

def _merge(left: list, right: list, key: str):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        a = getattr(left[i], key)
        b = getattr(right[j], key)
        
        if str(a).lower() <= str(b).lower():
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result