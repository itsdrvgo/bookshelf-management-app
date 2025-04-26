import { GeneralShell } from "@/components/globals/layouts";
import { BooksPage, BooksToolbar } from "@/components/home";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default function Page() {
    return (
        <GeneralShell>
            <Suspense>
                <BooksToolbar />
                <Separator />
                <BooksPage />
            </Suspense>
        </GeneralShell>
    );
}
