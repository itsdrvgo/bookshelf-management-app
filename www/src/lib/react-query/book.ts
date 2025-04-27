import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queries } from "../queries";
import { BooksPaginatedResponse, PaginationParams } from "../queries/book";
import { handleClientError, parseToJSON } from "../utils";
import { Book, CreateBook, createBookSchema, UpdateBook } from "../validations";

export function useBooks() {
    const router = useRouter();

    const useScan = ({
        sortBy = "none",
        search,
        pagination,
        initialData,
    }: {
        sortBy?: string;
        search?: string;
        pagination?: PaginationParams;
        initialData?: BooksPaginatedResponse;
    } = {}) => {
        return useQuery({
            queryKey: [
                "books",
                "scan",
                sortBy,
                search,
                pagination?.page,
                pagination?.page_size,
            ],
            queryFn: async () => {
                const data = await queries.book.scan({
                    sortBy,
                    search,
                    pagination,
                });
                return data;
            },
            initialData,
        });
    };

    const useGet = ({
        id,
        initialData,
    }: {
        id: number;
        initialData?: Book;
    }) => {
        return useQuery({
            queryKey: ["books", "get", id],
            queryFn: async () => {
                const data = await queries.book.get(id);
                return data;
            },
            initialData,
        });
    };

    const useCreate = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Creating book...");
                return { toastId };
            },
            mutationFn: async (values: CreateBook[]) => {
                const data = await queries.book.create(values);
                return data;
            },
            onSuccess: (_, __, { toastId }) => {
                toast.success("Book created successfully", { id: toastId });
                router.refresh();
            },
            onError: (err, _, ctx) => {
                return handleClientError(err, {
                    id: ctx?.toastId,
                    duration: 5000,
                });
            },
        });
    };

    const useJSONCreate = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Creating books...");
                return { toastId };
            },
            mutationFn: async (file: File) => {
                const content = await file.text();
                const json = parseToJSON(content);

                if (!Array.isArray(json))
                    throw new Error("Data must be an array of books");

                const books = createBookSchema.array().parse(json);

                await queries.book.create(books);
                return books;
            },
            onSuccess: (_, __, { toastId }) => {
                toast.success("Books created successfully", { id: toastId });
                router.refresh();
            },
            onError: (err, _, ctx) => {
                return handleClientError(err, {
                    id: ctx?.toastId,
                    duration: 5000,
                });
            },
        });
    };

    const useUpdate = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Updating book...");
                return { toastId };
            },
            mutationFn: async ({
                id,
                values,
            }: {
                id: number;
                values: UpdateBook;
            }) => {
                const data = await queries.book.update(id, values);
                return data;
            },
            onSuccess: (_, __, { toastId }) => {
                toast.success("Book updated successfully", { id: toastId });
                router.refresh();
            },
            onError: (err, _, ctx) => {
                return handleClientError(err, {
                    id: ctx?.toastId,
                    duration: 5000,
                });
            },
        });
    };

    const useDelete = () => {
        return useMutation({
            onMutate: () => {
                const toastId = toast.loading("Deleting book...");
                return { toastId };
            },
            mutationFn: async (id: number) => {
                const data = await queries.book.delete(id);
                return data;
            },
            onSuccess: (_, __, { toastId }) => {
                toast.success("Book deleted successfully", { id: toastId });
                router.refresh();
            },
            onError: (err, _, ctx) => {
                return handleClientError(err, {
                    id: ctx?.toastId,
                    duration: 5000,
                });
            },
        });
    };

    return {
        useScan,
        useGet,
        useCreate,
        useJSONCreate,
        useUpdate,
        useDelete,
    };
}
