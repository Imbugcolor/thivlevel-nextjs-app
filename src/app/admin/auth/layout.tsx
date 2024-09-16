import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin login",
    description: "Clothing store for you",
};

export default function AdminAuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        children
    );
}
