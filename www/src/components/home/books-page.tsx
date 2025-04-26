"use client";

import { BOOKS_SORT_OPTIONS } from "@/config/const";
import { useBooks } from "@/lib/react-query";
import { cn, sanitizeError } from "@/lib/utils";
import { Book } from "@/lib/validations";
import Image from "next/image";
import Link from "next/link";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useState } from "react";
import { BookManageForm } from "../globals/forms";
import { Icons } from "../icons";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    EmptyPlaceholder,
    EmptyPlaceholderContent,
    EmptyPlaceholderDescription,
    EmptyPlaceholderFooter,
    EmptyPlaceholderHeader,
    EmptyPlaceholderIcon,
    EmptyPlaceholderTitle,
} from "../ui/empty-placeholder";
import { Skeleton } from "../ui/skeleton";

export function BooksPage({ className, ...props }: GenericProps) {
    const [sortBy] = useQueryState(
        "sortBy",
        parseAsStringLiteral(["none", ...BOOKS_SORT_OPTIONS]).withDefault(
            "none"
        )
    );
    const [search] = useQueryState("search", parseAsString.withDefault(""));

    const { useScan } = useBooks();
    const { data, error, isPending } = useScan({ sortBy, search });

    if (error)
        return (
            <div className="flex justify-center">
                <EmptyPlaceholder>
                    <EmptyPlaceholderIcon>
                        <Icons.AlertTriangle />
                    </EmptyPlaceholderIcon>

                    <EmptyPlaceholderContent>
                        <EmptyPlaceholderHeader>
                            <EmptyPlaceholderTitle>Oops!</EmptyPlaceholderTitle>
                            <EmptyPlaceholderDescription>
                                {sanitizeError(error)}
                            </EmptyPlaceholderDescription>
                        </EmptyPlaceholderHeader>

                        <EmptyPlaceholderFooter>
                            <Button size="sm" asChild>
                                <Link href="/dashboard">Go Back</Link>
                            </Button>
                        </EmptyPlaceholderFooter>
                    </EmptyPlaceholderContent>
                </EmptyPlaceholder>
            </div>
        );

    if (!isPending && data?.length === 0)
        return (
            <div className="flex justify-center">
                <EmptyPlaceholder>
                    <EmptyPlaceholderIcon>
                        <Icons.AlertTriangle />
                    </EmptyPlaceholderIcon>

                    <EmptyPlaceholderContent>
                        <EmptyPlaceholderHeader>
                            <EmptyPlaceholderTitle>
                                No books found
                            </EmptyPlaceholderTitle>
                            <EmptyPlaceholderDescription>
                                You don&apos;t have any books yet. Start adding
                                some to your collection.
                            </EmptyPlaceholderDescription>
                        </EmptyPlaceholderHeader>
                    </EmptyPlaceholderContent>
                </EmptyPlaceholder>
            </div>
        );

    return (
        <section
            className={cn(
                "grid grid-cols-2 gap-5 md:grid-cols-4 xl:grid-cols-5",
                className
            )}
            {...props}
        >
            {isPending &&
                Array.from({ length: 20 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
                ))}

            {data?.map((book) => <BookCard key={book.id} book={book} />)}
        </section>
    );
}

function BookCard({ book }: { book: Book }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const { useScan, useDelete } = useBooks();
    const [sortBy] = useQueryState(
        "sortBy",
        parseAsStringLiteral(["none", ...BOOKS_SORT_OPTIONS]).withDefault(
            "none"
        )
    );
    const [search] = useQueryState("search", parseAsString.withDefault(""));

    const { refetch } = useScan({ sortBy, search });
    const { mutateAsync, isPending } = useDelete();

    const handleDelete = async () => {
        await mutateAsync(book.id);
        refetch();
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <div key={book.id} className="aspect-[3/4] space-y-2">
                <div
                    className="group relative size-full cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setIsViewModalOpen(true)}
                >
                    <Image
                        src={`https://picsum.photos/seed/${book.id}/500/500`}
                        alt={book.title}
                        width={500}
                        height={500}
                        className="size-full object-cover"
                    />

                    <div className="absolute bottom-0 left-0 w-full translate-y-0 bg-black/60 p-1 px-2 transition-all ease-in-out group-hover:translate-y-0 md:translate-y-full md:p-2">
                        <p className="text-sm md:text-base">{book.year}</p>
                        <p className="text-xs text-muted-foreground">
                            {book.genre}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {book.author}
                        </p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-8"
                            >
                                <Icons.MoreVertical />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => setIsViewModalOpen(true)}
                                >
                                    <Icons.Eye className="size-4" />
                                    <span>View</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    <Icons.Pencil className="size-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => setIsDeleteModalOpen(true)}
                            >
                                <Icons.Trash2 className="size-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                        <DialogDescription>
                            Edit the book details
                        </DialogDescription>
                    </DialogHeader>

                    <BookManageForm
                        book={book}
                        onFinish={() => setIsEditModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="overflow-hidden p-0 sm:max-w-[700px]">
                    <DialogHeader className="hidden">
                        <DialogTitle>Book Details {book.title}</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col md:flex-row">
                        <div className="relative aspect-[3/4] w-full md:w-2/5">
                            <Image
                                src={`https://picsum.photos/seed/${book.id}/500/750`}
                                alt={book.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="flex flex-col p-6 md:w-3/5">
                            <button
                                className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
                                onClick={() => setIsViewModalOpen(false)}
                            >
                                <Icons.X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </button>

                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        {book.title}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        by {book.author}
                                    </p>
                                </div>

                                <div className="flex space-x-2">
                                    <div className="rounded-full bg-secondary px-3 py-1 text-xs">
                                        {book.genre}
                                    </div>
                                    <div className="rounded-full bg-secondary px-3 py-1 text-xs">
                                        {book.year}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <h3 className="text-sm font-medium">
                                        Description
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        This is a beautiful copy of &ldquo;
                                        {book.title}&rdquo; by {book.author},
                                        published in {book.year}. This{" "}
                                        {book.genre} book is part of your
                                        personal collection.
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center justify-between border-t pt-4">
                                    <div>
                                        <h3 className="text-sm font-medium">
                                            Book ID
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {book.id}
                                        </p>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setIsViewModalOpen(false);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            <Icons.Pencil />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                setIsViewModalOpen(false);
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            <Icons.Trash2 />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogTitle>
                        Are you sure you want to delete this book?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the book from your collection.
                    </AlertDialogDescription>

                    <AlertDialogFooter>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
