import { BOOKS_SORT_OPTIONS } from "@/config/const";
import { z } from "zod";

export const bookSchema = z.object({
    id: z
        .number({
            required_error: "ID is required",
            invalid_type_error: "ID must be a number",
        })
        .int("ID must be an integer")
        .nonnegative("ID must be a non-negative number"),
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string",
        })
        .min(1, "Title must be at least 1 character long"),
    author: z
        .string({
            required_error: "Author is required",
            invalid_type_error: "Author must be a string",
        })
        .min(1, "Author must be at least 1 character long"),
    year: z
        .number({
            required_error: "Year is required",
            invalid_type_error: "Year must be a number",
        })
        .int("Year must be an integer")
        .nonnegative("Year must be a non-negative number")
        .max(
            new Date().getFullYear(),
            "Year must be less than or equal to the current year"
        ),
    genre: z
        .string({
            required_error: "Genre is required",
            invalid_type_error: "Genre must be a string",
        })
        .min(1, "Genre must be at least 1 character long"),
});

export const createBookSchema = bookSchema.omit({ id: true });
export const updateBookSchema = createBookSchema.partial();

export const sortBookSchema = z.object({
    books: bookSchema.array().nonempty("Books array cannot be empty"),
    sortBy: z.enum(BOOKS_SORT_OPTIONS, {
        required_error: "Sort by is required",
        invalid_type_error: "Sort by must be a string",
    }),
});

export type Book = z.infer<typeof bookSchema>;
export type CreateBook = z.infer<typeof createBookSchema>;
export type UpdateBook = z.infer<typeof updateBookSchema>;
export type SortBook = z.infer<typeof sortBookSchema>;
