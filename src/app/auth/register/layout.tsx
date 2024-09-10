import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Clothing store for you",
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}
