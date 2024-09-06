import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn mua",
  description: "Clothing store for you",
};

export default function PurchaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}
