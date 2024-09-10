'use client'
import React, { useState } from 'react'
import UserImage from './UserImage';
import SearchBar from './SearchBar';
import Link from 'next/link';
import { CiUser } from 'react-icons/ci'
import * as CgIcons from 'react-icons/cg'
import * as MdIcons from 'react-icons/md'
import * as BiIcons from 'react-icons/bi'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { Twirl as Hamburger } from 'hamburger-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setNotify } from '@/lib/features/notifySlice';
import { userApiRequest } from '../api-request/user.api';

export default function NavMobile({ token }: { token: string | undefined }) {
    const cart = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(false);

    const handleLogout = async<E extends Element = HTMLAnchorElement>(
        e: React.MouseEvent<E, MouseEvent>
    ) => {
        e.preventDefault()
        if (token) {
            dispatch(setNotify({ loading: true }))
            try {
                await userApiRequest.logOut(token, dispatch)
                dispatch(setNotify({ loading: false }))
            } catch (error) {
                dispatch(setNotify({ loading: false }))
                console.log("An unexpected error occurred:", error);
                dispatch(setNotify({ error: 'Có lỗi xảy ra' }))
                  
            }
            // window.location.href = '/auth';
        }
    }

    const loggedRouterMobile = () => {
        return (
            <>
                <li className="user__container-mobile">
                    <ul>
                        <li className="cart-icon">
                            <span>{cart ? cart.items.length : 0}</span>
                            <Link href="/cart" onClick={() => setOpen(false)}>
                                <HiOutlineShoppingBag style={{ fontSize: 24, marginRight: 15 }} />
                                <span>Giỏ hàng</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/user/profile" onClick={() => setOpen(false)}>
                                <CgIcons.CgProfile style={{ fontSize: 24, marginRight: 15 }} />
                                <span>Thông tin</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/user/purchase" onClick={() => setOpen(false)}>
                                <MdIcons.MdHistory style={{ fontSize: 24, marginRight: 15 }} />
                                <span>Đơn hàng của tôi</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/" onClick={(e) => handleLogout(e)}>
                                <BiIcons.BiLogOut style={{ fontSize: 20, marginRight: 15 }} />
                                <span>Đăng xuất</span>
                            </Link>
                        </li>
                    </ul>
                </li>
            </>
        )
    }
  return (
    <>
      <div className="header-nav-tablet-mobile">
                {
                    token &&
                        <div className="user__wrapper">
                            <UserImage />
                        </div>
                }
                <div className="navbar-icon">
                    <Hamburger
                        color="rgb(64, 64, 64)" toggled={open}
                        size={40} rounded toggle={setOpen}
                    />
                </div>
                <div className={`navbar-tablet-mobile-wrapper ${open ? 'active' : ''}`}>
                    <div className='search__bar_mobile'>
                        <SearchBar />
                    </div>
                    <ul>
                        <li><Link href="/" onClick={() => setOpen(false)}>Trang chủ</Link></li>
                        <li><Link href="/products" onClick={() => setOpen(false)}>Shop</Link></li>
                        <li><Link href="/about/introduction" onClick={() => setOpen(false)}>About us</Link></li>
                        {
                            token && loggedRouterMobile()
                        }
                    </ul>
                    <div className='sign_in__mobile_wrapper'>
                        {
                            !token &&
                            <Link href="/auth" onClick={() => setOpen(false)}>
                                <div className='sign_in__mobile'>
                                    <CiUser />
                                    <h4>ĐĂNG NHẬP</h4>
                                    <MdKeyboardArrowRight />
                                </div>
                            </Link>
                        }
                    </div>
                </div>
            </div>
            {
            open && <div className="header-nav-tablet-mobile overlay"
                onClick={() => setOpen(false)}
            ></div> 
            }
    </>
  )
}
