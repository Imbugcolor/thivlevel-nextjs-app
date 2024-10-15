import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import './styles/header.css'
import SearchBar from './SearchBar'
import Logo from '../../images/thivlevel-logo-4.png'
import { cookies } from 'next/headers'
import UserMenu from './UserMenu'
import NavMobile from './NavMobile'
import { FaUserCircle } from "react-icons/fa";
import Notification from './notification/Notification'

export default function Header() {
    const cookieStore = cookies()
    const token = cookieStore.get('refreshtoken')?.value
    return (
        <header>
            <div className='container-box header__top'>
                <div className="logo">
                    <div style={{ width: 'fit-content' }}>
                        <Link href="/">
                            <Image src={Logo} priority alt="" className="header-logo"/>
                        </Link>
                    </div>
                </div>
                <div className='search__bar_header'>
                    <SearchBar />
                </div>

                <ul className="header-nav left__top_header">
                    <li className='notification-menu'>
                        <Notification />
                    </li>
                    {
                        token ? <UserMenu /> :
                            <li>
                                <div className='login__nav_icon'>
                                    <Link href="/auth"><span><FaUserCircle /></span></Link>
                                </div>
                                <div className='login_sign_up_nav'>
                                    <span><Link href="/auth">Đăng nhập</Link></span>
                                </div>
                            </li>
                    }
                </ul>

            </div>
            <div className='menu__nav_header_bottom'>
                <ul className="header-nav">
                    <li className="nav_1 menu_nav_li"><Link href="/">Trang chủ</Link></li>
                    <li className="nav_2 menu_nav_li"><Link href="/products">Sản phẩm</Link></li>
                    <li className="nav_3 menu_nav_li"><Link href="/about/introduction">Giới thiệu</Link></li>
                </ul>
            </div>

            <NavMobile token={token} />

        </header>
    )
}
