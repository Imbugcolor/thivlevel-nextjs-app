'use client'
import { useState } from "react";
import './auth.css'
import { FormSubmit, InputChange } from "../types/html-elements";
import { BiShow, BiHide } from 'react-icons/bi'
import Link from 'next/link'
import { useAppDispatch } from "@/lib/hooks";
import { setNotify } from "@/lib/features/notifySlice";
import { useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import ButtonLoading from "../components/loading/ButtonLoading";

export default function Login() {
  const searchParams = useSearchParams()
  const previousUrl = searchParams.get('previous')
  
  const [user, setUser] = useState<LoginRequest>({
    email: '',
    password: ''
  })
  const dispatch = useAppDispatch()
  const [validateMsg, setValidateMsg] = useState<{ [key: string]: string }>()
  const [showPass, setShowPass] = useState(false)
  const [disableForm, setDisableForm] = useState(false)
  const [loading, setLoading] = useState(false)

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

    if(disableForm) return;

    const isValid = validate()
    if (!isValid) return

    setDisableForm(true)
    setLoading(true)
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
        setDisableForm(false)
        setLoading(false)
        return dispatch(setNotify({ error: errorData.message ? errorData.message : 'Đăng nhập thất bại'}))
      } 
      setLoading(false)

      if(previousUrl) {
        window.location.href = `/${previousUrl}`
      } else {
        window.location.href = '/';
      }
      
      dispatch(setNotify({ success: 'Đăng nhập thành công'}))
    })
    .catch(err => {
      setLoading(false)
      setDisableForm(false)
      console.log(err)
      return dispatch(setNotify({ error: err.message ? err.message : 'Đăng nhập thất bại'}))
    })
  }

  const googleButton = useGoogleLogin({
    onSuccess: tokenResponse => handleGoogleLogin(tokenResponse.code),
    flow: 'auth-code',
  })

  const handleGoogleLogin = async(code: string) => {
    setDisableForm(true)
    setLoading(true)
    await fetch(`api/auth/google`, {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(async(res) => {
      if(!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        setDisableForm(false)
        setLoading(false)
        return dispatch(setNotify({ error: errorData.message ? errorData.message : 'Đăng nhập thất bại'}))
      } 
      setLoading(false)

      if(previousUrl) {
        window.location.href = `/${previousUrl}`
      } else {
        window.location.href = '/';
      }
      
      dispatch(setNotify({ success: 'Đăng nhập thành công'}))
    })
    .catch(err => {
      setLoading(false)
      setDisableForm(false)
      console.log(err)
      return dispatch(setNotify({ error: err.message ? err.message : 'Đăng nhập thất bại'}))
    })
  }

  return (
    <div className='login-page'>
      <form onSubmit={loginSubmit} className="form-signin-signout" style={{ opacity: disableForm ? 0.6 : 1}}>
        <div className='auth__heading_form'>
          <div className='sign__in_heading'>
            <h2 className='active'>Đăng nhập</h2>
          </div>
          <div className='sign__up_heading'>
            <h2><Link href="/auth/register">Đăng ký</Link></h2>
          </div>
        </div>

        <input className="email-field-input" type="text" name="email" placeholder='Nhập email...'
          value={user.email}
          onChange={onChangeInput}
          disabled={disableForm}
        />
        <span style={{ color: 'red', fontWeight: '300' }}>{validateMsg?.email}</span>

        <div className='password_wrapper'>
          <input className="password-field-input" type={showPass ? 'text' : 'password'} name="password" placeholder='Mật khẩu'
            value={user.password}
            autoComplete="on"
            onChange={onChangeInput}
            disabled={disableForm}
          />
          <small onClick={() => setShowPass(!showPass)}>
            {showPass ? <BiHide /> : <BiShow />}
          </small>
        </div>

        <span style={{ color: 'red', fontWeight: '300' }}>{validateMsg?.password}</span>

        <div className="sign-up-btn-link">
          <button type="submit" 
                  style={{ display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>{ 
            loading ?
            <ButtonLoading /> : "Đăng nhập"
          }
          </button>
        </div>

        <div className="forget__btn_link">
          <span><Link href="/forgotpassword">Quên mật khẩu?</Link></span>
        </div>
      </form>
      <div className="signin-with-social">
        <span>Hoặc đăng nhập với</span>
        <div className='google-login-button-wrapper' onClick={googleButton}>
            <div className='google-btn-login'>        
                <FcGoogle /> 
            </div>
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
