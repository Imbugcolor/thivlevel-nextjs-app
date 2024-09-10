'use client'
import "../auth.css"
import { userApiRequest } from '@/app/api-request/user.api'
import { FormSubmit, InputChange } from '@/app/types/html-elements'
import { HttpError } from "@/lib/utils/http"
import Link from 'next/link'
import React, { useState } from 'react'
import { BiHide, BiShow } from 'react-icons/bi'

export default function Register() {
    const initialState = {
        username: '',
        email: '',
        password: '',
        verify_password: ''
    }

    const [user, setUser] = useState(initialState)

    const [validateMsg, setValidateMsg] = useState<{[key: string]: string}>({})
    const [successMessage, setSuccessMessage] = useState<string>('')

    const [showPass, setShowPass] = useState(false)

    const validate = () => {
        const msg: {[key: string]: string} = {}
        if (!user.username) {
            msg.username = '*Bạn chưa nhập username'
        }
        if (!user.email) {
            msg.email = '*Bạn chưa nhập email'
        } else if (!user.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            msg.email = '*Email không hợp lệ'
        }

        if (!user.password) {
            msg.password = '*Bạn chưa nhập mật khẩu'
        } else if (user.password.length < 6) {
            msg.password = '*Mật khẩu phải có độ dài tối thiểu 6 ký tự'
        } else if (user.password.match(/^(?=.*\s)/)) {
            msg.password = '*Mật khẩu không được chứa khoảng cách'
        } else if (!user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
            msg.password = '*Mật khẩu phải chứa chữ cái in hoa, chữ cái thường và chữ số'
        }

        if (!user.verify_password) {
            msg.verify_password = '*Bạn chưa nhập xác nhận lại mật khẩu'
        } else if (user.password !== user.verify_password) {
            msg.verify_password = '*Xác nhạn lại mật khẩu chưa chính xác'
        }

        setValidateMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    const onChangeInput = (e: InputChange) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const registerSubmit = async (e: FormSubmit) => {
        e.preventDefault()
        const isValid = validate()
        if (!isValid) return
        try {
            const { verify_password, ...body } = user 
            await userApiRequest.register(body)
            setSuccessMessage('Hãy kiểm tra email để kích hoạt tài khoản')
            setUser(initialState)
        } catch (error: any) {
            if (error instanceof HttpError) {
                // Handle the specific HttpError
                console.log("Error message:", error.message);
                // Example: show error message to the user
                setValidateMsg({ credential: error.message })
              } else {
                // Handle other types of errors
                console.log("An unexpected error occurred:", error);
                setValidateMsg({ credential: 'An unexpected error occurred' })
            }
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={registerSubmit} className="form-signin-signout">
                <div className='auth__heading_form'>
                    <div className='sign__in_heading'>
                        <h2><Link href="/auth">Đăng nhập</Link></h2>
                    </div>
                    <div className='sign__up_heading'>
                        <h2 className='active'>Đăng ký</h2>
                    </div>
                </div>

                {
                    successMessage && <div>
                        <span style={{ color: 'green' }}>{successMessage}</span>
                    </div>
                }

                {
                    validateMsg.credential && <div>
                        <span style={{ color: 'red' }}>*{validateMsg.credential}</span>
                    </div>
                }

                <input type="text" name="username" placeholder="Nhập họ tên..."
                    value={user.username}
                    onChange={onChangeInput}
                />
                <span style={{ color: 'red', fontWeight: '300' }}>{validateMsg.username}</span>


                <input type="text" name="email" placeholder="Nhập email..."
                    value={user.email}
                    onChange={onChangeInput}
                />
                <span style={{ color: 'red', fontWeight: '300' }}>{validateMsg.email}</span>

                <div className='password_wrapper'>
                    <input type={showPass ? 'text' : 'password'} name="password" placeholder="Mật khẩu"
                        value={user.password}
                        onChange={onChangeInput}
                    />
                    <span style={{ color: 'red', fontWeight: '300' }}>{validateMsg.password}</span>
                    <small onClick={() => setShowPass(!showPass)}>
                        {showPass ? <BiHide /> : <BiShow />}
                    </small>
                </div>

                <input type={showPass ? 'text' : 'password'} name="verify_password" placeholder="Xác nhận mật khẩu"
                    value={user.verify_password}
                    onChange={onChangeInput}
                />
                <span style={{ color: 'red', fontWeight: '300' }}>{validateMsg.verify_password}</span>

                <div className="row">
                    <button type="submit">Đăng ký</button>
                </div>
            </form>
        </div>
    )
}
