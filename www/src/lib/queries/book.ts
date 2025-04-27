import { axios } from "../axios";
import { Book, CreateBook, ResponseData, UpdateBook } from "../validations";

export interface PaginationParams {
    page?: number;
    page_size?: number;
}

export interface PaginationResponse {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}

export interface BooksPaginatedResponse {
    books: Book[];
    pagination: PaginationResponse;
}

class BookQuery {
    private async getBooks(search?: string, pagination?: PaginationParams) {
        const response = await axios.get<ResponseData<BooksPaginatedResponse>>(
            "/books",
            {
                params: {
                    search,
                    ...(pagination?.page && { page: pagination.page }),
                    ...(pagination?.page_size && {
                        page_size: pagination.page_size,
                    }),
                },
            }
        );

        if (!response.data.success) throw new Error(response.data.longMessage);
        return response.data.data;
    }

    async scan(options?: {
        sortBy?: string;
        search?: string;
        pagination?: PaginationParams;
    }) {
        const { sortBy, search, pagination } = options || {};

        if (sortBy && sortBy !== "none") {
            const response = await axios.post<
                ResponseData<BooksPaginatedResponse>
            >(
                "/books/sort",
                { sort_by: sortBy },
                {
                    params: {
                        search,
                        ...(pagination?.page && { page: pagination.page }),
                        ...(pagination?.page_size && {
                            page_size: pagination.page_size,
                        }),
                    },
                }
            );

            if (!response.data.success)
                throw new Error(response.data.longMessage);
            return response.data.data;
        }

        return await this.getBooks(search, pagination);
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
