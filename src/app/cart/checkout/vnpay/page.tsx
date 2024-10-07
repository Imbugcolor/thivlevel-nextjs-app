'use client'
import styles from './vnpay.module.css'
import { vnpayApiRequest } from '@/app/api-request/vnpay.api';
import { HttpError } from '@/lib/utils/http';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function VnpayCheckoutResult() {
    const [loading, setLoading] = useState(true)
    const [isSuccess, setIsSuccess] = useState<null | boolean>(null)
    const [isFailed, setIsFailed] = useState<null | boolean>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Access the full query string from the URL
            const qs = window.location.search;
            const verify = async () => {
                try {
                    setLoading(true)
                    const response = await vnpayApiRequest.verifyReturnUrl(qs)
                    if (response.payload.success === true) {
                        setIsSuccess(true)
                    } else {
                        setIsFailed(true)
                    }
                } catch (error) {
                    if (error instanceof HttpError) {
                        console.log("Error message:", error.message);
                        setError(error.message)
                    } else {
                        console.log("An unexpected error occurred:", error);
                        setError('Lỗi không xác định.')
                    }
                } finally {
                    setLoading(false)
                }
            }

            verify()
        }
    }, []); // Only run this effect on mount

    return (
        <div className='container-box'>
            {
                loading && <div className={styles.card}>Loading...</div>
            }
            <div className={styles.card}>
                {
                    isSuccess && 
                    <>
                        <h1 className={styles.title}>Hoàn tất thanh toán!</h1>
                        <p className={styles.message}>Cảm ơn bạn đã ủng hộ chúng tôi.</p>
                    </>
                }

                {
                    isFailed &&
                     <>
                        <h1 className={`${styles.title} ${styles.red}`}>Thanh toán thất bại!</h1>
                        <p className={styles.message}>Thanh toán bị hủy</p>
                        {
                            error && <p className={styles.message}>{error}</p>
                        }
                    </>
                }

                <Link href="/" className={styles.button}>
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    )
}
