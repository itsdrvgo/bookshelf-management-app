"use client";

import { BOOKS_SORT_OPTIONS, DEFAULT_PAGINATION_PAGE } from "@/config/const";
import { convertValueToLabel } from "@/lib/utils";
import {
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
    useQueryState,
} from "nuqs";
import { useEffect, useState } from "react";
import { BookManageForm } from "../globals/forms";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export function BooksToolbar() {
    const [sortBy, setSortBy] = useQueryState(
        "sortBy",
        parseAsStringLiteral(["none", ...BOOKS_SORT_OPTIONS]).withDefault(
            "none"
        )
    );
    const [, setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(DEFAULT_PAGINATION_PAGE)
    );
    const [searchValue, setSearchValue] = useQueryState(
        "search",
        parseAsString.withDefault("")
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localSearchValue, setLocalSearchValue] = useState(searchValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localSearchValue !== searchValue) {
                setSearchValue(localSearchValue);
            }
        }, 500);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localSearchValue, searchValue]);

    return (
        <div className="flex items-center justify-between gap-5">
            <div className="flex flex-wrap items-center gap-2">
                <Input
                    type="search"
                    placeholder="Search by title..."
                    value={localSearchValue}
                    onChange={(event) => {
                        setLocalSearchValue(event.target.value);
                        setPage(DEFAULT_PAGINATION_PAGE);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            setSearchValue(localSearchValue);
                        }
                    }}
                    className="w-[150px] lg:w-[250px]"
                />

                <div className="flex items-center gap-2">
                    <Select
                        value={sortBy || "none"}
                        onValueChange={(value) =>
                            setSortBy(value as typeof sortBy)
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sort by</SelectLabel>
                                <SelectItem value="none">None</SelectItem>

                                <SelectSeparator />

                                {BOOKS_SORT_OPTIONS.map((option, i) => (
                                    <SelectItem key={i} value={option}>
                                        {convertValueToLabel(option)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSortBy("none")}
                    >
                        <Icons.RotateCcw />
                    </Button>
                </div>
            </div>

            <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Icons.Plus />
                Add Book
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Book</DialogTitle>
                        <DialogDescription>
                            Add a new book to your collection
                        </DialogDescription>
                    </DialogHeader>

                    <BookManageForm onFinish={() => setIsModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
