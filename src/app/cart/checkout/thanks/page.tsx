import styles from '../vnpay/vnpay.module.css'
import Link from 'next/link'
import React from 'react'

export default function Thanks() {
    return (
        <div className='container-box'>
            <div className={styles.card}>

                <h1 className={styles.title}>Đặt hàng thành công!</h1>
                <p className={styles.message}>Cảm ơn bạn đã ủng hộ chúng tôi.</p>

                <Link href="/" className={styles.button}>
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    )
}
