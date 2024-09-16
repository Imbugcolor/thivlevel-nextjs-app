'use client'
import { userApiRequest } from '@/app/api-request/user.api'
import { setNotify } from '@/lib/features/notifySlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Link from 'next/link'
import React from 'react'
import { BiLogOut } from 'react-icons/bi'

export default function LogoutSection() {
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
        }
    }

    return (
        <Link href="/" className='logOut' onClick={handleLogout}>
            <BiLogOut style={{ marginRight: 10 }} />
            Đăng xuất
        </Link>
    )
}
