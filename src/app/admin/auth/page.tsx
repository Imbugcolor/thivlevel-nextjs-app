'use client'
import '../../auth/auth.css'
import { useState } from "react";
import { BiShow, BiHide } from 'react-icons/bi'
import Link from 'next/link'
import { useAppDispatch } from "@/lib/hooks";
import { setNotify } from "@/lib/features/notifySlice";
import { FormSubmit, InputChange } from "@/app/types/html-elements";

export default function AdminLogin() {
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

      window.location.href = '/admin/dashboard';
      
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
            <h2 className='active'>Đăng nhập quản trị</h2>
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
            <div style={{ display: 'flex',
                          width: '84px'
                        }}>
                <svg
                aria-hidden="true"
                role="status"
                className="loading-paypal-checkout animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>  Loading...
          </div> : "Đăng nhập"
          }
          </button>
        </div>

        <div className="forget__btn_link">
          <span><Link href="/forgotpassword">Quên mật khẩu?</Link></span>
        </div>
      </form>
    </div>
  )
}
