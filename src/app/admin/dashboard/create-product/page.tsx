'use client'
import "./create-product.css"
import { FormSubmit, InputChange } from '@/app/types/html-elements';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useRef, useState } from 'react'
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import ImageList from "../../(component)/products/ImageList";
import { HttpError } from "@/lib/utils/http";
import { setNotify } from "@/lib/features/notifySlice";
import { uploadApiRequest } from "../../api-request/upload.api";
import { privateProductApiRequest } from "../../api-request/products.api";
import { CiCirclePlus } from "react-icons/ci";
import { findDuplicate } from "@/lib/utils/func";

export default function CreateProduct() {
    const initialState: CreateProduct = {
        product_sku: '',
        title: '',
        price: 0,
        description: 'Đây là mô tả mặc định',
        content: 'Đây là nội dung mặc định',
    }

    const token = useAppSelector(state => state.auth).token
    const dispatch = useAppDispatch()

    const categories = useAppSelector(state => state.categories).data

    const [product, setProduct] = useState(initialState)
    const [category, setCategory] = useState('')
    const [colors, setColors] = useState<string[]>([])
    const [sizes, setSizes] = useState<string[]>([])
    const [publish, setPublish] = useState(true)
    const [images, setImages] = useState<Blob[]>([])
    const [validation, setValidation] = useState<{ [key: string]: string }>({})

    const [inventory, setInventory] = useState(
        colors.flatMap(color => sizes.map(size => ({ color, size, quantity: 0 })))
    );

    const fileUpRef = useRef<HTMLInputElement>(null);

    const handleChangeInput = (e: InputChange) => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const handleChangeCategory = (e: InputChange) => {
        setCategory(e.target.value)
    }

    const handleOnChangeColorInput = (e: InputChange, idx: number) => {
        const newColors = colors.map((cl, index) => {
            return index === idx ? cl = e.target.value : cl
        })

        setColors(newColors)
    }

    const removeColor = (idx: number) => {
        const newColors = colors.filter((cl, index) => index !== idx)
        setColors(newColors)
    }

    const handleOnChangeInputSize = (e: InputChange, idx: number) => {
        const newSizes = sizes.map((size, index) => {
            return index === idx ? size = e.target.value : size
        })

        setSizes(newSizes)
    }

    const removeSize = (idx: number) => {
        const newSizes = sizes.filter((size, index) => index !== idx)
        setSizes(newSizes)
    }

    const handleOnChangeInputInventory = (e: InputChange, color: string, size: string) => {
        const newValue = parseInt(e.target.value) || 0;
        console.log(newValue)
        if (inventory.find(item => item.color == color && item.size == size)) {
            // Update the specific product variation
            setInventory((prevInventory) =>
                prevInventory.map(item =>
                    item.color === color && item.size === size
                        ? { ...item, quantity: newValue }
                        : item
                )
            );
        } else {
            // Update the inventory object directly using color-size as a key
            setInventory((prevInventory) => ([
                ...prevInventory,
                { color, size, quantity: newValue }
            ]));
        }
    }

    const handleUpload = (e: InputChange) => {
        const files = [...e.target.files]

        let newImages: Blob[] = []
        const types = ['image/png', 'image/jpeg', 'video/mp4', 'video/x-m4v', 'video/webm', 'video/m4v']

        files.forEach(file => {
            if (!file) return setValidation({ ...validation, file: '*Ảnh không tồn tại.' })

            if (file.size > 1024 * 1024 * 5) {
                return setValidation({ ...validation, file: '*Ảnh phải nhỏ hơn 5mb.' })
            }

            if (!types.includes(file.type))
                return setValidation({ ...validation, file: '*Không hỗ trợ loại ảnh.' })

            return newImages.push(file)
        })

        setImages([...images, ...newImages])

        e.target.value = null
    }

    const deleteImage = (index: number) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const validate = () => {
        const msg: { [key: string]: string } = {}

        if (!product.product_sku) {
            msg.product_sku = '*Chưa nhập mã sản phẩm'
        }

        if (!product.title) {
            msg.title = '*Tên sản phẩm là bắt buộc'
        }

        if (!product.price) {
            msg.price = '*Giá sản phẩm là bắt buộc'
        } else if (product.price < 0) {
            msg.price = '*Giá sản phẩm phải lớn hơn 0'
        }

        if (colors.length === 0) {
            msg.color = '*Màu sắc là bắt buộc'
        }

        if (sizes.length === 0) {
            msg.size = '*Kích thước là bắt buộc'
        }

        if (!category) {
            console.log(category)
            msg.category = '*Danh mục sản phẩm là bắt buộc'
        }

        if (images.length <= 0) {
            msg.images = '*Ảnh sản phẩm là bắt buộc'
        }

        if (findDuplicate(colors)) {
            msg.color = `*Màu [${findDuplicate(colors)}] bị trùng lặp`
        }

        if (findDuplicate(sizes)) {
            msg.size = `*Kích thước [${findDuplicate(sizes)}] bị trùng lặp`
        }

        setValidation(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    const handleSubmit = async (e: FormSubmit) => {
        e.preventDefault()
        if (!token) return;
        const isValid = validate()
        if (!isValid) return dispatch(setNotify({ error: 'Không thể tạo, vui lòng kiểm tra lại' }));
        let variants: Variant[] = []

        colors.forEach(color => {
            sizes.forEach(size => {
                const quantity = inventory.find(item => item.color == color && item.size == size)?.quantity || 0
                const variant: Variant = { size, color, inventory: quantity }
                variants.push(variant)
            })
        })

        const formData = new FormData()
        images.forEach(item => formData.append('files', item))

        try {
            dispatch(setNotify({ loading: true }))
            const upload = await uploadApiRequest.uploadImages(token, dispatch, formData)

            const images = upload.payload.images;
            const body = {
                product_sku: product.product_sku as string,
                title: product.title as string,
                price: Number(product.price),
                description: product.description as string,
                content: product.content as string,
                category,
                variants,
                images,
                isPublished: publish,
            }

            await privateProductApiRequest.create(token, dispatch, body)

            dispatch(setNotify({ success: 'Tạo sản phẩm thành công' }))
            setProduct(initialState)
            setCategory('')
            setColors([])
            setSizes([])
            setImages([])
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

    return (
        <div>
            <div className='content-header'>
                <h2>Tạo sản phẩm</h2>
            </div>

            <div className="content-wrapper">
                <div className="create_product">
                    <form onSubmit={handleSubmit}>
                        <div>

                            <div className="row">
                                <label htmlFor="product_id">Mã sản phẩm</label>
                                <input type="text" name="product_sku" id="product_sku"
                                    value={product.product_sku} onChange={handleChangeInput} />
                                <span className='validate-msg-product-create'>{validation.product_sku}</span>
                            </div>

                            <div className="row">
                                <label htmlFor="title">Tên sản phẩm</label>
                                <input type="text" name="title" id="title"
                                    value={product.title} onChange={handleChangeInput} />
                                <span className='validate-msg-product-create'>{validation.title}</span>
                            </div>

                            <div className="row">
                                <label htmlFor="price">Giá</label>
                                <input type="number" name="price" id="price"
                                    value={product.price} onChange={handleChangeInput} />
                                <span className='validate-msg-product-create'>{validation.price}</span>
                            </div>

                            <div className="row">
                                <label htmlFor="description">Mô tả</label>
                                <textarea name="description" id="description" required
                                    value={product.description} rows={4} onChange={handleChangeInput} />
                            </div>

                            <div className="row">
                                <label htmlFor="content">Nội dung</label>
                                <textarea name="content" id="content" required
                                    value={product.content} rows={4} onChange={handleChangeInput} />
                            </div>

                            <div className="row">
                                <label htmlFor="categories">Danh mục</label>
                                <select name="category" value={category} onChange={handleChangeCategory}>
                                    <option value="">Chọn danh mục cho sản phẩm</option>
                                    {
                                        categories.map((category) => (
                                            <option value={category._id} key={category._id}>
                                                {category.name}
                                            </option>
                                        ))
                                    }
                                </select>
                                <span className='validate-msg-product-create'>{validation.category}</span>
                            </div>
                        </div>

                        <div className="upload">
                            <label htmlFor="">Hình ảnh sản phẩm</label>
                            <input
                                type="file" name="file" id="file_up"
                                ref={fileUpRef}
                                multiple accept='image/*,video/*'
                                onChange={handleUpload} style={{ display: 'none' }}
                            />
                            <div
                                className="upload-product-images-btn"
                                onClick={() => fileUpRef.current?.click()}
                            >
                                <FaDownload style={{ marginRight: 5 }} />
                                Tải ảnh lên
                            </div>
                            <span className='validate-msg-product-create'>{validation.images}</span>
                            <ImageList images={images} deleteImage={deleteImage} />

                            <div className="variant">
                                <label htmlFor="">Biến thể: </label>
                                <div className="variant-options">
                                    <div className="color-options">
                                        <label htmlFor="color">Màu sắc: </label>
                                        {
                                            colors.length > 0 && colors.map((color, idx) => (
                                                <div key={idx} className="color-input">
                                                    <input
                                                        value={color}
                                                        onChange={(e: InputChange) => handleOnChangeColorInput(e, idx)}
                                                    />
                                                    <GoTrash onClick={() => removeColor(idx)} />
                                                </div>
                                            ))
                                        }
                                        <div className='add-option' onClick={() => setColors([...colors, ''])}>
                                            <CiCirclePlus /> Thêm màu sắc
                                        </div>
                                        <span className='validate-msg-product-create'>{validation.color}</span>
                                    </div>
                                    <div className="sizes-options">
                                        <label htmlFor="color">Kích thước: </label>
                                        {
                                            sizes.length > 0 && sizes.map((size, idx) => (
                                                <div key={idx} className="size-input">
                                                    <input
                                                        value={size}
                                                        onChange={(e: InputChange) => handleOnChangeInputSize(e, idx)}
                                                    />
                                                    <GoTrash onClick={() => removeSize(idx)} />
                                                </div>
                                            ))
                                        }
                                        <div className="add-option" onClick={() => setSizes([...sizes, ''])}>
                                            <CiCirclePlus /> Thêm kích thước
                                        </div>
                                        <span className='validate-msg-product-create'>{validation.size}</span>
                                    </div>
                                </div>

                                <div className="variant-options">
                                    <label htmlFor="">Danh sách các biến thể: </label>
                                    <table className="variants">
                                        <thead className="table-header">
                                            <tr>
                                                <th>MÀU SẮC</th>
                                                <th>KÍCH THƯỚC</th>
                                                <th>SỐ LƯỢNG</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            {
                                                colors.length > 0 && colors.map((color, colorIndex) => (
                                                    <React.Fragment key={colorIndex}>
                                                        <tr>
                                                            <th rowSpan={sizes.length + 1}>{color}</th>
                                                        </tr>
                                                        {
                                                            sizes.length > 0 && sizes.map((size, sizeIndex) => (
                                                                <tr key={sizeIndex}>
                                                                    <td>{size}</td>
                                                                    <td>
                                                                        <div>
                                                                            <input
                                                                                style={{ width: '100%' }}
                                                                                type="number"
                                                                                placeholder="Nhập số lượng"
                                                                                value={
                                                                                    inventory.find(
                                                                                        item => item.color === color && item.size === size
                                                                                    )?.quantity || ''
                                                                                }
                                                                                min={0}
                                                                                onChange={(e) => handleOnChangeInputInventory(e, color, size)}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <label htmlFor="">Ẩn/hiện</label>
                            <div className='publish_product'>
                                <div className="publish-toggle"
                                    onClick={() => setPublish(!publish)}>
                                    {
                                        publish ?
                                            <BsToggleOn style={{ color: '#0e9f6e' }} /> :
                                            <BsToggleOff style={{ color: '#ff5a1f' }} />
                                    }
                                </div>
                            </div>
                        </div>
                        <button type="submit">Tạo</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
