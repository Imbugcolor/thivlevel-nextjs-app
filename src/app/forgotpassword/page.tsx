'use client'
import "../auth/auth.css"
import Link from 'next/link'
import React, { useState } from 'react'
import { FormSubmit } from '../types/html-elements'
import { userApiRequest } from "../api-request/user.api"
import { HttpError } from "@/lib/utils/http"

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSucess] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async(e: FormSubmit) => {
        e.preventDefault()
        setSucess('')
        setError('')
        try {
            setLoading(true)
            const res = await userApiRequest.forgotPassword(email)
            setSucess(res.payload.message)
            setLoading(false)
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

    const removeDefaultEvent = <E extends Element = HTMLAnchorElement>(
        e: React.MouseEvent<E, MouseEvent>) => {
            e.preventDefault()
    }

    return (
        <div className="login-page">
          <form onSubmit={handleSubmit} className="form-signin-signout">
            <div className='auth__heading_form'>
              <div className='sign__in_heading'>
                <h2 className='active'>Quên mật khẩu</h2>
              </div>
            </div>
        
            <input type="email" name="email" placeholder='Nhập email...'
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <div>
                {
                    success && <span style={{ color: 'green' }}>{success}</span>
                }
                {
                    error && <span style={{ color: 'red' }}>{error}</span>
                }
            </div>
    
            <div className="sign-up-btn-link">
              <button type="submit" disabled={loading}>Lấy mã xác nhận</button>
            </div>

            <div className="sign__btn_link" style={{ opacity: loading ? 0.6 : 1 }}>
                {
                    loading ? 
                    <span><Link href="#" onClick={removeDefaultEvent}>Đăng nhập</Link></span> :
                    <span><Link href="/auth">Đăng nhập</Link></span>
                }
            </div>
          </form>
        </div>
      )
    
}
