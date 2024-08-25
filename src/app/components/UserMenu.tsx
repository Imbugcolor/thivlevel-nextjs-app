'use client'
import { useAppSelector } from '@/lib/hooks'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { CgProfile } from 'react-icons/cg'
import { BiLogOut } from 'react-icons/bi'
import { MdHistory } from 'react-icons/md'
import { HiOutlineShoppingBag } from 'react-icons/hi'

export default function UserMenu() {
  const user = useAppSelector((state) => state.auth).user

  const logout = () => {

  }

  if (!user) return null;
  return (
    <>
         <li className="user__container">
                    <div className="user__wrapper">
                        <div className='user__name'>
                            <span>{user.username}</span>
                            <RiArrowDropDownLine />
                        </div>
                        <Image src={user.imageProfile.url} width={100} height={100} referrerPolicy="no-referrer" alt="profile-avt" />
                    </div>
                    <ul className="user__dropdown">
                        <li>
                            <Link href="/user">
                                <CgProfile style={{ fontSize: 20 }} />
                                <span>Thông tin</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/history">
                                <MdHistory style={{ fontSize: 20 }} />
                                <span>Đơn hàng của tôi</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/" onClick={logout}>
                                <BiLogOut style={{ fontSize: 20 }} />
                                <span>Đăng xuất</span>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <div className="cart-icon">
                        {/* <span>{cart ? cart.cart.items.length : 0}</span> */}
                        <Link href="/cart">
                            <HiOutlineShoppingBag />
                        </Link>
                    </div>
                </li>
    </>
  )
}
