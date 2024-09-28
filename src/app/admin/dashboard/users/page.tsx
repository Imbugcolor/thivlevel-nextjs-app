'use client'
import './users.css'
import React, { useEffect, useState } from 'react'
import { privateUsersApiRequest } from '../../api-request/users.api'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { HttpError } from '@/lib/utils/http'
import { setNotify } from '@/lib/features/notifySlice'
import { changeUsersPage, getUsers, searchUsers, sortUsers, UserState } from '@/lib/features/userSlice'
import { RiLockPasswordLine } from 'react-icons/ri'
import { FaEye } from 'react-icons/fa'
import Paginator from '@/app/components/Paginator'
import { NUM_PER_PAGE } from '@/config'
import { InputChange } from '@/app/types/html-elements'
import { GoSearch } from 'react-icons/go'

export default function Users() {
    const token = useAppSelector(state => state.auth).token
    const users = useAppSelector(state => state.users)
    const dispatch = useAppDispatch()
    const [searchInput, setSearchInput] = useState('')

    const search = () => {
        dispatch(searchUsers(searchInput))
    }

    const sort = (e: InputChange) => {
        dispatch(sortUsers(e.target.value))
    }

    const handleChangePage = (num: number) => {
        dispatch(changeUsersPage(num))
    }

    useEffect(() => {
        if (token) {
            const fetch = async () => {
                try {
                    const res = await privateUsersApiRequest.get(token, dispatch, NUM_PER_PAGE, users.page, users.filter);
                    dispatch(getUsers({
                        data: res.payload.data,
                        total: res.payload.total,
                        page: parseInt(res.payload.page)
                    }))
                } catch (error) {
                    if (error instanceof HttpError) {
                        // Handle the specific HttpError
                        console.log("Error message:", error.message);
                        // Example: show error message to the user
                        dispatch(setNotify({ error: error.message }))
                    } else {
                        // Handle other types of errors
                        console.log("An unexpected error occurred:", error);
                        dispatch(setNotify({ error: "An unexpected error occurred" }))
                    }
                }
            }
            fetch()
        }
    }, [token, dispatch, users.page, users.filter])

    return (
        <div>
            <div className='content-header'>
                <h2>Người dùng</h2>
            </div>

            <div className="users-wrapper">
                <div className='users-filter'>
                    <div className="search-user">
                        <input className="search-user-input" value={searchInput} type="text" placeholder="Tìm kiếm bằng tên/ emai/ sđt"
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter")
                                    search();
                            }} />
                        <button className="search-btn" onClick={search}>
                            <GoSearch />
                        </button>
                    </div>
                    <div className="sort-user">
                        <div className="sort">
                            <div>
                                <select value={users.filter.sort} onChange={sort}>
                                    <option value="">Sắp xếp: Tự động</option>
                                    <option value="sort=-createdAt">Mới nhất</option>
                                    <option value="sort=createdAt">Cũ nhất</option>
                                    <option value="sort=username">Name</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="users-list">
                    <div className='products__count_number'>
                        <span>Hiển thị {users.data.length} / {users.total} người dùng</span>
                    </div>
                    <table className="users-list-table">
                        <thead className="table-header">
                            <tr>
                                <th>ID</th>
                                <th>USERNAME</th>
                                <th>EMAIL</th>
                                <th>SĐT</th>
                                <th>NGÀY TẠO</th>
                                <th>VAI TRÒ</th>
                                <th>TRẠNG THÁI</th>
                                <th>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {
                                users.data.length > 0 ? users.data.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-id">
                                                <span style={{ textTransform: 'uppercase' }}
                                                    title={user._id}>...{user._id.slice(-5)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-name">
                                                <span>{user.username}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-name">
                                                <span>{user.email ? user.email : ''}</span>
                                            </div>
                                        </td>
                                        <td>{user.phone ? user.phone : ''}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>{user.role.map(r => <span key={r}> {r}</span>)}</td>
                                        <td>
                                            Active
                                        </td>
                                        <td>
                                            <div className="user-actions">
                                                <div className="edit-user">
                                                    <a href="#!">
                                                        <FaEye style={{ color: '#9e9e9e' }} />
                                                    </a>
                                                </div>
                                                <div className="lock-user">
                                                    <a href="#!">
                                                        <RiLockPasswordLine style={{ color: '#9e9e9e' }} />
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) :
                                    <tr>
                                        <td style={{ borderBottom: 'none', textAlign: 'left' }}>
                                            <div>
                                                Không tìm thấy kết quả tìm kiếm.
                                            </div>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <Paginator<UserState>
                    list={users}
                    total={users.total}
                    callback={handleChangePage}
                />
            </div>
        </div>
    )
}
