import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Clothing store for you",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}
