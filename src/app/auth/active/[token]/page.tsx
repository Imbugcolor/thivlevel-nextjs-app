'use client'
import { HttpError } from "@/lib/utils/http"
import "./active.css"
import { userApiRequest } from '@/app/api-request/user.api'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { MdDone } from 'react-icons/md'

export default function Active({ params }: { params: { token: string } }) {
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (params.token) {
            const activeAccount = async () => {
                try {
                    setLoading(true)
                    const res = await userApiRequest.active(params.token)
                    setSuccess('Kích hoạt tài khoản thành công')
                    setLoading(false)
                } catch (error: any) {
                    if (error instanceof HttpError) {
                        // Handle the specific HttpError
                        console.log("Error message:", error.message);
                        // Example: show error message to the user
                        setErr(error.message)
                        setLoading(false)
                      } else {
                        // Handle other types of errors
                        console.log("An unexpected error occurred:", error);
                        setErr('An unexpected error occurred')
                        setLoading(false)
                    }
                }
            }
            activeAccount()
        }
    }, [params.token])

    return (
        <div className="container-box">
            <div className='active_page'>

                <div className='form__message_container'>
                    {
                        loading ? <div> Đang xác thực ...</div> :
                        <div className='form__message'>
                            {
                                err &&
                                <div className='failed_active'>
                                    <IoCloseCircleOutline style={{ marginRight: '5px' }}/>
                                    <span>{err}</span>
                                </div>
                            }

                            {

                                success &&
                                <div className='success_active'>
                                    <MdDone style={{ marginRight: '5px' }}/>
                                    <span>{success}</span>
                                </div>
                            }

                            <Link href='/auth'
                                style={{ textDecoration: 'none' }}>
                                <button className='back-to-sign-in'>
                                    Sign in
                                </button>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
