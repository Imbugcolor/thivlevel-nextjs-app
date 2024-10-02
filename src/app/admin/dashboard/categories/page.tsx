'use client'
import "./categories.css"
import { FormSubmit } from '@/app/types/html-elements'
import { setNotify } from '@/lib/features/notifySlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { HttpError } from '@/lib/utils/http'
import React, { useState } from 'react'
import { privateCategoriesRequest } from '../../api-request/categories.api'
import { createCategory, deleteCategory, updateCategory } from "@/lib/features/categorySlice"
import { HiOutlineTrash } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";

export default function Categories() {
    const token = useAppSelector(state => state.auth).token
    const categories = useAppSelector(state => state.categories).data
    const dispatch = useAppDispatch()
    const [category, setCategory] = useState('')
    const [onEdit, setOnEdit] = useState<Category | null>(null)

    const editCategory = (category: Category) => {
        setOnEdit(category)
        setCategory(category.name)
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Smooth scroll animation
        });
    }

    const handleSubmit = async (e: FormSubmit) => {
        e.preventDefault()
        if (!token || !category) return;
        try {
            if (onEdit) {
                const res = await privateCategoriesRequest.update(token, dispatch, onEdit._id, { name: category })
                dispatch(updateCategory(res.payload))
                setOnEdit(null)
                setCategory('')
            } else {
                const res = await privateCategoriesRequest.create(token, dispatch, { name: category })
                dispatch(createCategory(res.payload))
                setCategory('')
            }
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

    const handledeleteCategory = async (category: Category) => {
        if(!token) return;
        try {
            const res = await privateCategoriesRequest.delete(token, dispatch, category._id)
            dispatch(deleteCategory(category._id))
            console.log(res.payload)
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

    const cancelAction = () => {
        if (onEdit) {
            setOnEdit(null)
            setCategory('')
        } else {
            setCategory('')
        }
    }
    return (
        <div>
            <div className='content-header'>
                <h2>Danh mục sản phẩm</h2>
            </div>

            <div className="categories-wrapper">
                <div className="categories">
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="category" value={category} required
                            placeholder="Tên danh mục..."
                            onChange={e => setCategory(e.target.value)}
                        />

                        <button className="create__cat_btn" type="submit">{onEdit ? "Lưu" : "Tạo"}</button>
                        {
                            (category || onEdit) &&
                            <button
                                className="cancel__update_btn"
                                type="button" onClick={cancelAction}
                                disabled={!category && !onEdit}
                            >Hủy</button>
                        }
                    </form>

                    <div>
                        {
                            categories.map(category => (
                                <div className="row" key={category._id}>
                                    <p>{category.name}</p>
                                    <div>
                                        <button className="update__cat_btn category-btn" onClick={() => editCategory(category)}><CiEdit /></button>
                                        <button className="remove__cat_btn category-btn" onClick={() => handledeleteCategory(category)}><HiOutlineTrash /></button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
