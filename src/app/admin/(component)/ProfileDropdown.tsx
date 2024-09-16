'use client'
import { useAppSelector } from '@/lib/hooks'
import { UnknowAvatar } from '@/lib/utils/unknow.avatar'
import Image from 'next/image'
import React from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'

export default function ProfileDropdown() {
    const user = useAppSelector(state => state.auth).user
    return (
        <>
            <div className='user__name' style={{ display: 'flex', alignItems: 'center', fontWeight: '300' }}>
                <span>{user?.username}</span>
                <RiArrowDropDownLine />
            </div>
            <Image
                className="admin_img_profile"
                src={user?.avatar || UnknowAvatar} 
                referrerPolicy="no-referrer" alt="profile-avt"
                width={500}
                height={500}
                priority />
        </>
    )
}
