import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/response.css"
import StoreProvider from "./StoreProvider";
import { cookies } from "next/headers";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thivlevel",
  description: "Clothing store for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies()
  const token = cookieStore.get('refreshtoken')?.value

  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider refreshToken={token}>
          <Header />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}