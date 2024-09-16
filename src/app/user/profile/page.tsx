'use client'
import { userApiRequest } from "@/app/api-request/user.api"
import "./profile.css"
import { FormSubmit, InputChange } from '@/app/types/html-elements'
import { AddressProfile } from '@/app/types/profile.address'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { GrSubtract } from 'react-icons/gr'
import { HttpError } from "@/lib/utils/http"
import { setNotify } from "@/lib/features/notifySlice"
import { updateUser } from "@/lib/features/authSlice"
import moment from "moment"
import LocationUpdate from "@/app/components/profile/LocationUpdate"
import { UnknowAvatar } from "@/lib/utils/unknow.avatar"

interface profileState {
  username: string,
  phone: string,
  gender: string,
  dob: string | '',
}

export default function Profile() {
  const token = useAppSelector(state => state.auth).token
  const user = useAppSelector(state => state.auth).user

  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState<profileState | null>(null)
  const [photo, setPhoto] = useState<Blob | string>(UnknowAvatar)

  const [address, setAddress] = useState<AddressProfile | string>('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)

  const [avtChange, setAvtChange] = useState(false)

  const [validation, setValidation] = useState<{ [key: string]: string }>({})
  const [validationPassword, setValidationPassword] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username,
        phone: user.phone ? user.phone : '',
        gender: user.gender, dob: user.dateOfbirth ? moment(user.dateOfbirth).format('YYYY-MM-DD') : ''
      })
      setPhoto(user.avatar)
      if (user.address) {
        setAddress(user.address)
      }
    }
  }, [user])

  async function handleUpload(e: InputChange) {
    e.preventDefault()

    const file = e.target.files[0]
    // Validate image
    try {
      if (!file)
        return setValidation({ file: 'Tệp không tồn tại.' })

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return setValidation({ file: 'Tệp phải có định dạng JPGE/PNG' })


      if (file.size > 5 * 1024 * 1024)
        return setValidation({ file: "Tệp phải nhỏ hơn 3mb" })

      setAvtChange(true)
      setPhoto(file)
      return setValidation({ file: "" })

    } catch (err) {
      console.log(err)
    }
  }

  const handleChangeFile = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleChangeAddress = () => {
    if (loading) return;
    if (addressRef.current) 
    addressRef.current.classList.add('active')
  }

  const validate = () => {
    const msg: {[key: string] : string} = {}
    if(!currentPassword) {
        msg.current = "*Chưa nhập mật khẩu hiện tại "
    }

    if(!newPassword) {
        msg.new = "*Chưa nhập mật khẩu mới"
    } else if (newPassword === currentPassword) {
        msg.new = "*Không được trùng với mật khẩu hiện tại"
    } else if (newPassword.length < 6) {
        msg.new = '*Mật khẩu phải có độ dài tối thiểu 6 ký tự'
    } else if (newPassword.match(/^(?=.*\s)/)) {
        msg.new = '*Mật khẩu không được chứa khoảng cách'
    } else if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
        msg.new = '*Mật khẩu phải chứa chữ cái in hoa, chữ cái thường và chữ số'
    }

    if(!verifyPassword) {
        msg.verify = "*Xác nhận mật khẩu là bắt buộc"
    } else if (verifyPassword !== newPassword) {
        msg.verify = "*Xác nhận mật khẩu không chính xác"
    }

    setValidationPassword(msg)
    if(Object.keys(msg).length > 0) return false
    return true
  }

  const handleChangePassword = async() => {
    const isValid = validate()
    if(!isValid) return
    try {
      if (token) {
        setLoading(true)
        const body = { old_password: currentPassword, new_password: newPassword }
        await userApiRequest.updatePassword(token, dispatch, body)
        setLoading(false)
        dispatch(setNotify({ success: 'Thay đổi mật khẩu thành công' }))
        setCurrentPassword('')
        setNewPassword('')
        setVerifyPassword('')
      }

    } catch (error) {
      if (error instanceof HttpError) {
        // Handle the specific HttpError
        console.log("Error message:", error.message);
        // Example: show error message to the user
        setLoading(false)
        dispatch(setNotify({ error: error.message }))
      } else {
        // Handle other types of errors
        console.log("An unexpected error occurred:", error);
        setLoading(false)
        dispatch(setNotify({ error: "An unexpected error occurred" }))
      }
    }
  }

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault()

    const formData = new FormData()

    try {
      if (token && profile) {
        setLoading(true)
        const { dob, ...update } = profile
        if (photo instanceof Blob) {
          formData.append('file', photo)
          await userApiRequest.updatePhoto(token, dispatch, formData)
        }
        const res = await userApiRequest.updateProfile(token, dispatch,
          address ? { ...update, dateOfbirth: new Date(dob).toISOString(), address: address as AddressProfile }
            : { ...update, dateOfbirth: new Date(dob).toISOString() })
        setAvtChange(false)
        dispatch(updateUser(res.payload))
        dispatch(setNotify({ success: 'Cập nhật thành công' }))
        setLoading(false)
      }

    } catch (error) {
      if (error instanceof HttpError) {
        // Handle the specific HttpError
        console.log("Error message:", error.message);
        // Example: show error message to the user
        setLoading(false)
        dispatch(setNotify({ error: error.message }))
      } else {
        // Handle other types of errors
        console.log("An unexpected error occurred:", error);
        setLoading(false)
        dispatch(setNotify({ error: "An unexpected error occurred" }))
      }
    }
  }

  return (
    <div className="container-box">
      <div className="user-profile-container">
        <div className="res-row">
          <div className="user-header">
            <h2 className="header-title">Thông tin của tôi</h2>
            <p className="header-description">Quản lý thông tin cá nhân</p>
          </div>
        </div>
        <div className="profile-container res-row">
          <div className="col l-3 m-3 c-12 profile-user-avt">
            <div>
              {
                photo &&
                <>
                  {
                    (photo instanceof Blob && avtChange) ?
                      <Image
                        src={URL.createObjectURL(photo)}
                        alt="photo"
                        width={500}
                        height={500}
                        priority
                      /> :
                      <Image src={photo as string} alt="photo" width={500} height={500} priority />
                  }
                </>
              }
              <input type="file" size={60} onChange={handleUpload} ref={inputRef} />
              <button className='select-img' onClick={handleChangeFile}>Chọn ảnh</button>
              <span>Kích thước file tối đa: 5 MB <br /> Định dạng: .JPEG, .PNG</span>
              {
                validation.file &&
                <span style={{ color: 'red' }}>{validation.file}</span>
              }
            </div>
            <div className='user__sidebar_menu'>
              <h3><GrSubtract /> Tài khoản của tôi</h3>
              <ul>
                <li><Link href={'/user/profile'} className='sidebar__option-menu active'>Thông tin của tôi</Link></li>
                <li><Link href={'/user/purchase'} className='sidebar__option-menu'>Đơn hàng của tôi</Link></li>
              </ul>
            </div>
          </div>

          <div className="col l-6 m-6 c-12 user-infor-wrapper">
            <div className='heading__form__user__infor'>
              <h4>Thông tin</h4>
            </div>
            {
              profile &&
              <>
                <form onSubmit={handleSubmit}>
                  <div className="user-infor-field">
                    <label>ID</label>
                    <input type="text" id="user-id" value={user?._id || ''} disabled />
                  </div>

                  <div className="user-infor-field">
                    <label>Tên</label>
                    <input type="text" id="user-name"
                      value={profile.username}
                      onChange={e => setProfile({ ...profile, username: e.target.value } as profileState)}
                      disabled={loading}
                    />
                  </div>

                  <div className="user-infor-field">
                    <label>Email</label>
                    <input type="text" id="user-email" value={user?.email || ''} disabled />
                  </div>

                  <div className="user-infor-field">
                    <label>Số điện thoại</label>
                    <div className='user__field__group'>
                      <a href='#!' className='region-number'>
                        +84
                      </a>
                      <input type="text" id="user-phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                  </div>

                  <div className="user-infor-field">
                    <label>Địa chỉ</label>
                    <div className="user__field__group">
                      <div>
                        {address ? `${(address as AddressProfile).detailAddress}, ${(address as AddressProfile).ward.label}, ${(address as AddressProfile).district.label}, ${(address as AddressProfile).city.label}`
                          : `${address}`}
                      </div>
                      <a href="#!" className="edit-field-icon"
                        onClick={handleChangeAddress}>
                        <FaEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                      </a>
                      <div className="address-form" ref={addressRef}>
                        <LocationUpdate element={"address-form"} onSave={setAddress} initAddress={address} />
                      </div>
                    </div>
                  </div>

                  <div className="user-infor-field">
                    <label>Giới tính</label>
                    <div id="user-gender">
                      <div className="user-gender-item">
                        <input type="radio" name="gender" value="MALE" id="male"
                          checked={profile.gender === "MALE" ? true : false}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value } as profileState)}
                          disabled={loading}
                        />
                        <label htmlFor="male">Nam</label>
                      </div>
                      <div className="user-gender-item">
                        <input type="radio" name="gender" value="FEMALE" id="female"
                          checked={profile.gender === "FEMALE" ? true : false}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value } as profileState)}
                          disabled={loading}
                        />
                        <label htmlFor="female">Nữ</label>
                      </div>
                      <div className="user-gender-item">
                        <input type="radio" name="gender" value="OTHER" id="other"
                          checked={profile.gender === "OTHER" ? true : false}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value } as profileState)}
                          disabled={loading}
                        />
                        <label htmlFor="other">Khác</label>
                      </div>
                    </div>
                  </div>

                  <div className="user-infor-field">
                    <label htmlFor="">Ngày sinh</label>
                    <input type="date" value={profile.dob}
                      onChange={e => setProfile({ ...profile, dob: e.target.value } as profileState)}
                      disabled={loading}
                    />
                  </div>
                  <div className="user-infor-field">
                    <label>Thời gian tạo</label>
                    <div id="user-created-time">{user && new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>

                  <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Đang lưu' : 'Lưu thay đổi'}</button>
                </form>
              </>
            }
          </div>

          {
            user?.authStrategy === 'LOCAL' ?
              <div className="col l-3 m-3 c-12 change-password">
                <div className="change-password-wrapper">
                  <h4 className="change-password-heading">Đổi mật khẩu</h4>
                  <div className="change-password-input-wrapper">
                    <div className="password-input-item">
                      <label htmlFor="user-current-password">Mật khẩu hiện tại</label>
                      <input type="password" id="user-current-password"
                        value={currentPassword} 
                        onChange={e => setCurrentPassword(e.target.value)} 
                        disabled={loading}
                        />
                      <span style={{ color: 'red', fontSize: '13px', display: 'block' }}>{validationPassword.current}</span>
                    </div>
                    <div className="password-input-item">
                      <label htmlFor="user-new-password">Mật khẩu mới</label>
                      <input type="password" id="user-new-password"
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)}
                        disabled={loading}
                         />
                      <span style={{ color: 'red', fontSize: '13px', display: 'block' }}>{validationPassword.new}</span>
                    </div>
                    <div className="password-input-item">
                      <label htmlFor="user-verify-password">Xác nhận mật khẩu</label>
                      <input type="password" id="user-verify-password"
                        value={verifyPassword} 
                        onChange={e => setVerifyPassword(e.target.value)} 
                        disabled={loading}
                        />
                      <span style={{ color: 'red', fontSize: '13px', display: 'block' }}>{validationPassword.verify}</span>
                    </div>
                    <button className="change-password-btn"
                      onClick={handleChangePassword}
                      disabled={loading}
                      style={{ opacity: loading ? 0.6 : 1}}
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
              :
              null
          }
        </div>
        <div className="update-phone-profile-box">
          {/* {<UpdatePhoneForUser />} */}
        </div>
        <div className="verify-phone-profile-box">
          {/* {<VerifyPhoneNumber />} */}
        </div>
      </div>
    </div>
  )
}
