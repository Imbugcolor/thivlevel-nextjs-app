'use client'
import "../auth/auth.css"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FormSubmit } from '../types/html-elements'
import { useSearchParams } from 'next/navigation'
import { userApiRequest } from '../api-request/user.api'
import { HttpError } from '@/lib/utils/http'
import { MdDone } from "react-icons/md"

export default function Recovery() {
    const searchParams = useSearchParams()
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPasword, setConfirmPassword] = useState('')
    const [isReset, setIsReset] = useState(false)
    const [validation, setValidation] = useState<{ [key: string]: string }>({})

    const id = searchParams.get('id')
    const token = searchParams.get('token')

    useEffect(() => {
        if (id && token) {
            const getVerify = async () => {
                try {
                    await userApiRequest.verifyTokenRecovery(id, token);
                    setIsVerified(true)
                } catch (error) {
                    if (error instanceof HttpError) {
                        setLoading(false)
                        // Handle the specific HttpError
                        console.log("Error message:", error.message);
                        // Example: show error message to the user
                        setError(error.message)
                    } else {
                        setLoading(false)
                        // Handle other types of errors
                        console.log("An unexpected error occurred:", error);
                        setError('Lỗi không xác định')
                    }
                }
            }
            getVerify()
        }
    }, [id, token])

    const validate = () => {
        const msg: { [key: string]: string } = {}

        if (!password) {
            msg.password = '*Hãy nhập mật khẩu mới'
        }

        if (!confirmPasword) {
            msg.confirmPassword = '*Hãy xác nhận lại mật khẩu'
        }

        if (password && confirmPasword && password !== confirmPasword) {
            msg.confirmPassword = '*Xác nhận lại mật khẩu không trùng khớp'
        }

        setValidation(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    const resetPasswordSubmit = async (e: FormSubmit) => {
        e.preventDefault()
        if (!id || !token) return;
        const isValid = validate()
        if (!isValid) return;
        try {
            setLoading(true)
            const body = { id, token, password }
            await userApiRequest.resetPassword(body)
            setIsReset(true)
        } catch (error) {
            if (error instanceof HttpError) {
                setLoading(false)
                // Handle the specific HttpError
                console.log("Error message:", error.message);
                // Example: show error message to the user
                setError(error.message)
            } else {
                setLoading(false)
                // Handle other types of errors
                console.log("An unexpected error occurred:", error);
                setError('Lỗi không xác định')
            }
        }
    }

    return (
        <div className="login-page">
            {
                isReset ? <div style={{ textAlign: 'center', color: 'green' }}>
                    <MdDone style={{ marginRight: '5px' }}/>
                    Cập nhật mật khẩu thành công
                        <div className="sign__btn_link">
                            <span><Link href="/auth" className="submit__btn">Đăng nhập</Link></span>
                        </div>
                    </div> :
                    <form onSubmit={resetPasswordSubmit} className="form-signin-signout">
                        <div className='auth__heading_form'>
                            <div className='sign__in_heading'>
                                <h2 className='active'>Khôi phục tài khoản</h2>
                            </div>
                        </div>

                        <div>
                            {
                                error && <span style={{ color: 'red' }}>{error}</span>
                            }
                        </div>

                        <input type="password" name="password" placeholder='Nhập mật khẩu mới'
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading || !isVerified}
                        />
                        <div>
                            {
                                validation.password && <span style={{ color: 'red' }}>{validation.password}</span>
                            }
                        </div>

                        <input type="password" name="confirmPassword" placeholder='Xác nhận mật khẩu'
                            autoComplete="on"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading || !isVerified}
                        />
                        <div>
                            {
                                validation.confirmPassword && <span style={{ color: 'red' }}>{validation.confirmPassword}</span>
                            }
                        </div>

                        <div className="row" style={{ opacity: loading || !isVerified ? 0.6 : 1 }}>
                            <button type="submit" disabled={loading || !isVerified}>Xác nhận</button>
                        </div>

                        <div className="sign__btn_link">
                            <span><Link href="/auth">Đăng nhập</Link></span>
                        </div>
                    </form>
            }
        </div>
    )
}
