import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: siteConfig.description + " - " + siteConfig.name,
        template: "%s - " + siteConfig.name,
    },
};

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    );
}
