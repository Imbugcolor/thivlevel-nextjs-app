'use client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Image from 'next/image';
import Link from 'next/link';
import React, { LinkHTMLAttributes } from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { CgProfile } from 'react-icons/cg'
import { BiLogOut } from 'react-icons/bi'
import { MdHistory } from 'react-icons/md'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { userApiRequest } from '../api-request/user.api';
import { setNotify } from '@/lib/features/notifySlice';
import { UnknowAvatar } from '@/lib/utils/unknow.avatar';

export default function UserMenu() {
    const user = useAppSelector((state) => state.auth).user
    const cart = useAppSelector((state) => state.cart)
    const token = useAppSelector((state) => state.auth).token
    const dispatch = useAppDispatch()

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

    if (!user) return <>
        <li className="user__container">
            <div className="user__wrapper">
                <div className='user__name'>
                    <span style={{ width: '2.5rem' }}></span>
                    <RiArrowDropDownLine />
                </div>
                <Image src={UnknowAvatar} width={100} height={100} referrerPolicy="no-referrer" alt="profile-avt" />
            </div>
        </li>
        <div className="cart-icon">
            {/* <span>{cart ? cart.cart.items.length : 0}</span> */}
            <Link href="/cart">
                <HiOutlineShoppingBag />
            </Link>
        </div>
    </>
    return (
        <>
            <li className="user__container">
                <div className="user__wrapper">
                    <div className='user__name'>
                        <span>{user.username}</span>
                        <RiArrowDropDownLine />
                    </div>
                    <Image src={user.avatar} width={100} height={100} referrerPolicy="no-referrer" alt="profile-avt" />
                </div>
                <ul className="user__dropdown">
                    <li>
                        <Link href="/user/profile">
                            <CgProfile style={{ fontSize: 20 }} />
                            <span>Thông tin</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/user/purchase">
                            <MdHistory style={{ fontSize: 20 }} />
                            <span>Đơn hàng của tôi</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" onClick={handleLogout}>
                            <BiLogOut style={{ fontSize: 20 }} />
                            <span>Đăng xuất</span>
                        </Link>
                    </li>
                </ul>
            </li>
            <div className="cart-icon">
                <span>{cart ? cart.items.length : 0}</span>
                <Link href="/cart">
                    <HiOutlineShoppingBag />
                </Link>
            </div>
        </>
    )
}
