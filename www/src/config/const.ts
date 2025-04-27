export const DEFAULT_MESSAGES = {
    ERRORS: {
        GENERIC: "An error occurred, please try again later",
        USER_FETCHING: "Please wait while we fetch your user data",
        NOT_FOUND: "The requested resource was not found",
    },
} as const;

export const BOOKS_SORT_OPTIONS = ["title", "author", "year"] as const;

export const DEFAULT_PAGINATION_PAGE = 1 as const;
export const DEFAULT_PAGINATION_PAGE_SIZE = 20 as const;
