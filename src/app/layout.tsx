import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/response.css"
import StoreProvider from "./StoreProvider";
import { cookies } from "next/headers";
import Header from "./components/Header";
import ReapopProvider from "./ReapopProvider";
import Notify from "./components/toast/Notify";
import Breadcrumbs from "./components/Breadcrumb";
import Footer from "./components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import QuickViewLayout from "./components/product/QuickViewLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thivlevel",
  description: "Clothing store for you",
  icons: {
    icon: 'https://res.cloudinary.com/dnv2v2tiz/image/upload/v1725970736/nestjs-app-images/thivlevel-low-resolution_qbljwn.png',
  },
  openGraph: {
    images: 'https://res.cloudinary.com/dnv2v2tiz/image/upload/v1725969836/nestjs-app-images/slider3_qf1scn.png'
  }
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
      <GoogleOAuthProvider clientId="711887640793-m0i8nt5fjdidt4urjpio2jpd88suip6n.apps.googleusercontent.com">
        <StoreProvider refreshToken={token}>
          <ReapopProvider>
            <Header />
            <Notify />
            <QuickViewLayout />
            <div className="margin-header"></div>
            <Breadcrumbs />
            {children}
            <Footer />
          </ReapopProvider>
        </StoreProvider>
      </GoogleOAuthProvider>
      </body>
    </html>
  );
}
