import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description: "Clothing store for you",
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}
