'use client'
import { useState } from "react";
import './auth.css'
import { FormSubmit, InputChange } from "../types/html-elements";
import { BiShow, BiHide } from 'react-icons/bi'
import Link from 'next/link'

export default function Login() {
  const [user, setUser] = useState<LoginRequest>({
    email: '',
    password: ''
  })
  const [validateMsg, setValidateMsg] = useState<{ [key: string]: string }>()

  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const msg: { [key: string]: string } = {}

    if (!user.email) {
      msg.email = '*Bạn chưa nhập email'
    } else if (!user.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      msg.email = '*Email không hợp lệ'
    }

    if (!user.password) {
      msg.password = '*Bạn chưa nhập mật khẩu'
    } else if (user.password.length < 6) {
      msg.password = '*Mật khẩu phải có độ dài tối thiểu 6 ký tự'
    }

    setValidateMsg(msg)
    if (Object.keys(msg).length > 0) return false
    return true
  }

  const onChangeInput = (e: InputChange) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const loginSubmit = async (e: FormSubmit) => {
    e.preventDefault()
    const isValid = validate()
    if (!isValid) return

    await fetch(`api/auth`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(async(res) => {
      if(!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        return;
      } 
      window.location.href = '/';
    })
    .catch(err => {
      console.log(err)
    })
  }


  return (
    <div className='login-page'>
      <form onSubmit={loginSubmit} className="form-signin-signout">
        <div className='auth__heading_form'>
          <div className='sign__in_heading'>
            <h2 className='active'>Đăng nhập</h2>
          </div>
          <div className='sign__up_heading'>
            <h2><Link href="/register">Đăng ký</Link></h2>
          </div>
        </div>

        <input className="email-field-input" type="text" name="email" placeholder='Nhập email...'
          value={user.email}
          onChange={onChangeInput}
        />
        <span style={{ color: 'red', fontWeight: '300' }}>{validateMsg?.email}</span>

        <div className='password_wrapper'>
          <input className="password-field-input" type={showPass ? 'text' : 'password'} name="password" placeholder='Mật khẩu'
            value={user.password}
            autoComplete="on"
            onChange={onChangeInput}
          />
          <small onClick={() => setShowPass(!showPass)}>
            {showPass ? <BiHide /> : <BiShow />}
          </small>
        </div>

        <span style={{ color: 'red', fontWeight: '300' }}>{validateMsg?.password}</span>

        <div className="sign-up-btn-link">
          <button type="submit">Đăng nhập</button>
        </div>

        <div className="forget__btn_link">
          <span><Link href="/forgotpassword">Quên mật khẩu?</Link></span>
        </div>
      </form>
      <div className="signin-with-social">
        <span>Hoặc đăng nhập với</span>
        <div className='google-login-button-wrapper'>
          {/* <GoogleLogin
            onSuccess={credentialResponse => {
              const data = jwt_decode(credentialResponse.credential)
              responseGoogleSuccess(data)
            }}
            onError={() => {
              responseGoogleFailure('login failed!')
            }}
            width='280px'
          /> */}
        </div>
        <div className='facebook-login-button-wrapper'>
          {/* <FacebookLogin
            appId="1820452108356438"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            cssClass="facebook-login-button"
            icon={<FaFacebookF />}
            textButton='Đăng nhập với Facebook'
          /> */}
        </div>
      </div>

    </div>
  )
}
