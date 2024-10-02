'use client'
import "../../create-product/create-product.css"
import { FormSubmit, InputChange } from '@/app/types/html-elements';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useEffect, useRef, useState } from 'react'
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import ImageList from "../../../(component)/products/ImageList";
import { HttpError } from "@/lib/utils/http";
import { setNotify } from "@/lib/features/notifySlice";
import { uploadApiRequest } from "../../../api-request/upload.api";
import { privateProductApiRequest } from "../../../api-request/products.api";
import { CiCirclePlus } from "react-icons/ci";
import { productsApiRequest } from "@/app/api-request/products.api";
import { getProductDetail, updateProduct } from "@/lib/features/productdetailSlice";
import { ImageObject } from "@/app/types/schema/image";
import { findDuplicate } from "@/lib/utils/func";

export default function UpdateProduct({ params }: { params: { id: string } }) {
    const initialState: CreateProduct = {
        product_sku: '',
        title: '',
        price: 0,
        description: 'Đây là mô tả mặc định',
        content: 'Đây là nội dung mặc định',
    }

    const token = useAppSelector(state => state.auth).token
    const productDetail = useAppSelector(state => state.productDetail)
    const dispatch = useAppDispatch()

    const categories = useAppSelector(state => state.categories).data

    const [product, setProduct] = useState(initialState)
    const [category, setCategory] = useState('')
    const [colors, setColors] = useState<string[]>([])
    const [sizes, setSizes] = useState<string[]>([])
    const [publish, setPublish] = useState(false)
    const [images, setImages] = useState<(Blob | ImageObject)[]>([])
    const [validation, setValidation] = useState<{ [key: string]: string }>({})

    const [inventory, setInventory] = useState(
        colors.flatMap(color => sizes.map(size => ({ color, size, quantity: 0 })))
    );

    const fileUpRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!params.id) return;
        const fetchData = async () => {
            try {
                if (productDetail.data_cached.every(item => item._id !== params.id)) {
                    const res = await productsApiRequest.getProduct(params.id)
                    dispatch(getProductDetail(res.payload))
                    setProduct(res.payload)
                    setCategory(res.payload.category?._id || '')
                    setImages(res.payload.images)
                    setPublish(res.payload.isPublished)

                    let colorsArr: string[] = []
                    let sizesArr: string[] = []
                    let inventoryMap: {
                        color: string;
                        size: string;
                        quantity: number;
                    }[] = []

                    res.payload.variants?.map(variant => {
                        if (!colorsArr.includes(variant.color)) {
                            colorsArr.push(variant.color)
                        }
                    })
                    res.payload.variants?.map(variant => {
                        if (!sizesArr.includes(variant.size)) return sizesArr.push(variant.size)
                    })

                    colorsArr.forEach(c => {
                        sizesArr.forEach(s => {
                            const inven = res.payload.variants?.find(variant => s === variant.size && c === variant.color)
                            inven && inventoryMap.push({ color: inven.color, size: inven.size, quantity: inven.inventory })
                        })
                    })

                    setColors(colorsArr)
                    setSizes(sizesArr)
                    setInventory(inventoryMap)
                } else {
                    const product_cached = productDetail.data_cached.find(data => data._id === params.id)
                    if (product_cached) {
                        setProduct(product_cached)
                        setCategory(product_cached.category?._id || '')
                        setImages(product_cached.images || [])
                        setPublish(product_cached.isPublished)

                        let colorsArr: string[] = []
                        let sizesArr: string[] = []
                        let inventoryMap: {
                            color: string;
                            size: string;
                            quantity: number;
                        }[] = []

                        product_cached.variants?.map(variant => {
                            if (!colorsArr.includes(variant.color)) {
                                colorsArr.push(variant.color)
                            }
                        })
                        product_cached.variants?.map(variant => {
                            if (!sizesArr.includes(variant.size)) return sizesArr.push(variant.size)
                        })

                        colorsArr.forEach(c => {
                            sizesArr.forEach(s => {
                                const inven = product_cached.variants?.find(variant => s === variant.size && c === variant.color)
                                inven && inventoryMap.push({ color: inven.color, size: inven.size, quantity: inven.inventory })
                            })
                        })

                        setColors(colorsArr)
                        setSizes(sizesArr)
                        setInventory(inventoryMap)
                    }
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
        fetchData()
    }, [params.id, dispatch, productDetail.data_cached])


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

        if (colors.length <= 0) {
            msg.color = '*Màu sắc sản phẩm là bắt buộc'
        }

        if (sizes.length <= 0) {
            msg.size = '*Kích thước sản phẩm là bắt buộc'
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
        if (!isValid) return dispatch(setNotify({ error: 'Không thể cập nhật, vui lòng kiểm tra lại' }));
        let variants: Variant[] = []

        colors.forEach(color => {
            sizes.forEach(size => {
                const quantity = inventory.find(item => item.color == color && item.size == size)?.quantity || 0
                if (product.variants?.find(variant => variant.color === color && variant.size === size)) {
                    const old_variant = product.variants?.find(variant => variant.color === color && variant.size === size)
                    old_variant && variants.push({ ...old_variant, inventory: quantity })
                } else {
                    const variant: Variant = { size, color, inventory: quantity }
                    variants.push(variant)
                }
            })
        })

        const formData = new FormData()
        const uploadedImages: ImageObject[] = []
        images.forEach(item => {
            if (item instanceof Blob) {
                formData.append('files', item)
            } else {
                uploadedImages.push(item)
            }
        })

        try {
            dispatch(setNotify({ loading: true }))
            const upload = await uploadApiRequest.uploadImages(token, dispatch, formData)

            const images = [...uploadedImages, ...upload.payload.images];
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

            const res = await privateProductApiRequest.update(token, dispatch, params.id, body)

            dispatch(updateProduct(res.payload))
            dispatch(setNotify({ success: 'Cập nhật sản phẩm thành công' }))
            // After product creation, trigger revalidation of the home page
            const revalidateRes = await fetch('/api/revalidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path: '/' })
            });
  
            if (!revalidateRes.ok) {
                dispatch(setNotify({ error: 'Failed to revalidate homepage'}));
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

    return (
        <div>
            <div className='content-header'>
                <h2>Cập nhật sản phẩm</h2>
            </div>

            <div className="update-product-wrapper">
                <div className="create_product">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="row">
                                <label className="p-0" htmlFor="product_id">Mã sản phẩm</label>
                                <input type="text" name="product_sku" id="product_sku"
                                    value={product.product_sku} onChange={handleChangeInput} />
                                <span className='validate-msg-product-create'>{validation.product_sku}</span>
                            </div>

                            <div className="row">
                                <label className="p-0" htmlFor="title">Tên sản phẩm</label>
                                <input type="text" name="title" id="title"
                                    value={product.title} onChange={handleChangeInput} />
                                <span className='validate-msg-product-create'>{validation.title}</span>
                            </div>

                            <div className="row">
                                <label className="p-0" htmlFor="price">Giá</label>
                                <input type="number" name="price" id="price"
                                    value={product.price} onChange={handleChangeInput} />
                                <span className='validate-msg-product-create'>{validation.price}</span>
                            </div>

                            <div className="row">
                                <label className="p-0" htmlFor="description">Mô tả</label>
                                <textarea name="description" id="description" required
                                    value={product.description} rows={4} onChange={handleChangeInput} />
                            </div>

                            <div className="row">
                                <label className="p-0" htmlFor="content">Nội dung</label>
                                <textarea name="content" id="content" required
                                    value={product.content} rows={5} onChange={handleChangeInput} />
                            </div>

                            <div className="row">
                                <label className="p-0" htmlFor="categories">Danh mục</label>
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
                            <label className="p-0" htmlFor="">Hình ảnh sản phẩm</label>
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
                                <label className="p-0" htmlFor="">Biến thể: </label>
                                <div className="variant-options">
                                    <div className="color-options">
                                        <label className="p-0" htmlFor="color">Màu sắc: </label>
                                        {
                                            colors.length > 0 && colors.map((color, idx) => (
                                                <div key={idx} className="color-input">
                                                    <input
                                                        value={color}
                                                        onChange={(e: InputChange) => handleOnChangeColorInput(e, idx)}
                                                        required
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
                                        <label className="p-0" htmlFor="color">Kích thước: </label>
                                        {
                                            sizes.length > 0 && sizes.map((size, idx) => (
                                                <div key={idx} className="size-input">
                                                    <input
                                                        value={size}
                                                        onChange={(e: InputChange) => handleOnChangeInputSize(e, idx)}
                                                        required
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
                                    <label className="p-0" htmlFor="">Danh sách các biến thể: </label>
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
                            <label className="p-0" htmlFor="">Ẩn/hiện</label>
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
                        <button type="submit">Cập nhật</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
