import { axios } from "../axios";
import { Book, CreateBook, ResponseData, UpdateBook } from "../validations";

class BookQuery {
    private async getBooks(search?: string) {
        const params = new URLSearchParams();
        if (search) params.append("search", search);

        const response = await axios.get<ResponseData<Book[]>>(
            `/books${params.toString() ? `?${params.toString()}` : ""}`
        );
        if (!response.data.success) throw new Error(response.data.longMessage);
        return response.data.data;
    }

    async scan(options?: { sortBy?: string; search?: string }) {
        const { sortBy, search } = options || {};
        const books = await this.getBooks(search);

        if (sortBy && sortBy !== "none") {
            const response = await axios.post<ResponseData<Book[]>>(
                "/books/sort",
                {
                    sort_by: sortBy,
                    books,
                }
            );
            if (!response.data.success)
                throw new Error(response.data.longMessage);
            return response.data.data;
        }

        return books;
    }

    async get(id: number) {
        const response = await axios.get<ResponseData<Book>>(`/books/${id}`);
        if (!response.data.success) throw new Error(response.data.longMessage);
        return response.data.data;
    }

    async create(values: CreateBook[]) {
        const response = await axios.post<ResponseData<Book[]>>(
            "/books",
            values
        );
        if (!response.data.success || !response.data.data)
            throw new Error(response.data.longMessage);
        return response.data.data;
    }

    async update(id: number, values: UpdateBook) {
        const response = await axios.patch<ResponseData<Book>>(
            `/books/${id}`,
            values
        );
        if (!response.data.success) throw new Error(response.data.longMessage);
        return response.data.data;
    }

    async delete(id: number) {
        const response = await axios.delete<ResponseData<Book>>(`/books/${id}`);
        if (!response.data.success) throw new Error(response.data.longMessage);
        return response.data.data;
    }
}

export const bookQueries = new BookQuery();
