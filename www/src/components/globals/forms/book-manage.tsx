"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BOOKS_SORT_OPTIONS } from "@/config/const";
import { useBooks } from "@/lib/react-query";
import { Book, CreateBook, createBookSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PageProps {
    book?: Book;
    onFinish?: () => void;
}

export function BookManageForm({ book, onFinish }: PageProps) {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null!);

    const [sortBy] = useQueryState(
        "sortBy",
        parseAsStringLiteral(["none", ...BOOKS_SORT_OPTIONS]).withDefault(
            "none"
        )
    );
    const [search] = useQueryState("search", parseAsString.withDefault(""));

    const form = useForm<CreateBook>({
        resolver: zodResolver(createBookSchema),
        defaultValues: {
            title: book?.title || "",
            author: book?.author || "",
            genre: book?.genre || "",
            year: book?.year || new Date().getFullYear(),
        },
    });

    const { useScan, useCreate, useJSONCreate, useUpdate } = useBooks();
    const { refetch } = useScan({ search, sortBy });
    const { mutateAsync: createBooks, isPending: isCreating } = useCreate();
    const { mutateAsync: updateBooks, isPending: isUpdating } = useUpdate();
    const { mutateAsync: createBulkBooks, isPending: isBulkCreating } =
        useJSONCreate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleBulkUpload = async () => {
        if (!file) return toast.error("No file selected");
        await createBulkBooks(file);
        fileInputRef.current.value = "";
        setFile(null);
        refetch();
        onFinish?.();
    };

    const handleSubmit = async (values: CreateBook) => {
        if (book) await updateBooks({ id: book.id, values });
        else await createBooks([values]);

        refetch();
        form.reset();
        onFinish?.();
    };

    const isPending = isCreating || isBulkCreating || isUpdating;

    return (
        <Form {...form}>
            {!book && (
                <>
                    <div
                        className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-10"
                        onClick={() => {
                            if (!file) fileInputRef.current.click();
                        }}
                    >
                        <input
                            type="file"
                            accept=".json"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div className="flex flex-col items-center gap-2">
                            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                <Icons.LibraryBig className="size-6" />
                            </div>

                            {!file && (
                                <p className="text-sm text-muted-foreground">
                                    Click to upload a JSON file with book data
                                </p>
                            )}
                        </div>

                        {file && (
                            <p className="text-sm text-muted-foreground">
                                Selected: {file.name}
                            </p>
                        )}

                        {file && (
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    onClick={handleBulkUpload}
                                    disabled={!file || isPending}
                                    size="sm"
                                    variant="secondary"
                                >
                                    Upload
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        setFile(null);
                                        fileInputRef.current.click();
                                    }}
                                    disabled={isPending}
                                    size="sm"
                                    variant="destructive"
                                >
                                    Change
                                </Button>
                            </div>
                        )}
                    </div>

                    <Separator />
                </>
            )}

            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>

                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="The Best Book Ever Written"
                                    disabled={isPending}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Author</FormLabel>

                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="John Doe"
                                    disabled={isPending}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Genre</FormLabel>

                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Fiction"
                                    disabled={isPending}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year</FormLabel>

                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="2023"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(
                                            /\D/g,
                                            ""
                                        );
                                        field.onChange(+value);
                                    }}
                                    disabled={isPending}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => onFinish?.()}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        size="sm"
                        disabled={isPending || !form.formState.isDirty}
                    >
                        Save Book
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
