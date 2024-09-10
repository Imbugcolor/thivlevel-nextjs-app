import "./about.css"
import Link from 'next/link'

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "Clothing store for you",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="container-box">
            <div className="res-row about-container">
                <div className="col l-3 m-3 c-12">
                    <div className="group-menu">
                        <div className="heading">Danh mục trang</div>
                        <ul className="page-items">
                            <li>
                                <Link href='/about/introduction'>Giới thiệu</Link>
                            </li>
                            <li>
                                <Link href='/about/guarantee'>Chính sách đổi trả</Link>
                            </li>
                            <li>
                                <Link href='/about/privacyPolicy'>Chính sách bảo mật</Link>
                            </li>
                            <li>
                                <Link href='/about/termOfService'>Điều khoản dịch vụ</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col l-9 m-9 c-12">
                    <div className="page-wrapper">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
