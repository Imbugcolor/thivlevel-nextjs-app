import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin",
  description: "Clothing store for you",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}
