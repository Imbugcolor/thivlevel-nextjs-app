import "../../product/productdetail.css"
import "../styles/quickview.css"
import { cartApiRequest } from '@/app/api-request/cart.api'
import { getCart } from '@/lib/features/cartSlice'
import { setNotify } from '@/lib/features/notifySlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import React, { DragEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import Rating from '../Rating'
import Image from 'next/image'
import { BsCartCheck } from 'react-icons/bs'
import SoldIcon from '../../../images/sold.png'
import { FiPlus } from 'react-icons/fi'
import { GrFormSubtract } from 'react-icons/gr'
import Link from 'next/link'
import { IoCloseOutline } from 'react-icons/io5'
import { useRouter } from "next/navigation"
import { clearProductView } from "@/lib/features/quickviewSlice"
import { convertStringToSEO } from "@/lib/utils/func"

export default function QuickView() {
    const token = useAppSelector(state => state.auth).token
    const roles = useAppSelector(state => state.auth).user?.role
    const product = useAppSelector(state => state.quickview).product
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [addCartLoading, setAddCartLoading] = useState(false)

    const [colors, setColors] = useState<{ [color: string]: string[] }>({})
    const [sizes, setSizes] = useState<{ [size: string]: string[] }>({})

    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedVariant, setSelectedVariant] = useState<Variant>()
    const [quantity, setQuantity] = useState(1)
    const [slideIndex, setSlideIndex] = useState(1)
    const [width, setWidth] = useState(0)
    const [start, setStart] = useState(0)
    const [change, setChange] = useState(0)
    const slideRef = useRef<HTMLInputElement>(null)

    const [validation, setValidation] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        if (!slideRef.current) return;
        const scrollWidth = slideRef.current.scrollWidth
        const childrenElementCount = slideRef.current.childElementCount
        const width = scrollWidth / childrenElementCount
        setWidth(width)
    }, [])

    const plusSlides = (n: number) => {
        setSlideIndex(prev => prev + n)
        slideShow(slideIndex + n)
    }

    const slideShow = (n: number) => {
        if (product) {
            if (n > product.images.length) setSlideIndex(1)
            if (n < 1) setSlideIndex(product.images.length)
        }
    }

    // Drag
    function dragStart(e: DragEvent<HTMLDivElement>) {
        setStart(e.clientX)
    }

    function dragOver(e: DragEvent<HTMLDivElement>) {
        let touch = e.clientX
        setChange(start - touch)
    }

    function dragEnd(e: DragEvent<HTMLDivElement>) {
        if (!slideRef.current) return;
        if (change > 0)
            slideRef.current.scrollLeft += width
        else
            slideRef.current.scrollLeft -= width
    }

    useEffect(() => {
        if (!slideRef.current || !width) return;
        let numOfThumb = Math.round(slideRef.current.offsetWidth / width)
        slideRef.current.scrollLeft = slideIndex > numOfThumb ? (slideIndex - 1) * width : 0
    }, [width, slideIndex])


    /* zoom Image */
    const handleZoomImage = (e: MouseEvent<HTMLDivElement>, index: number) => {
        const imageDisplay = document.getElementsByClassName('mySlides')[index] as HTMLElement
        if (imageDisplay) {
            // Example: Change --zoom-display based on some condition or interaction
            imageDisplay.style.setProperty('--zoom-display', 'block');

            let pointer = {
                x: (e.nativeEvent.offsetX * 100) / imageDisplay.offsetWidth,
                y: (e.nativeEvent.offsetY * 100) / imageDisplay.offsetHeight
            }

            imageDisplay.style.setProperty('--zoom-x', pointer.x + "%")
            imageDisplay.style.setProperty('--zoom-y', pointer.y + "%")
        }
    }

    const handleMouseLeave = (index: number) => {
        const imageDisplay = document.getElementsByClassName('mySlides')[index] as HTMLElement
        if (imageDisplay) {
            imageDisplay.style.setProperty('--zoom-display', 'none');
        }
    };

    useEffect(() => {
        if (product && product.variants) {
            const colorToSizes = product.variants.reduce((acc: { [color: string]: string[] }, variant) => {
                if (!acc[variant.color]) {
                    acc[variant.color] = []; // Use a Set to avoid duplicates
                }
                if (!acc[variant.color].includes(variant.size) && variant.inventory > 0) {
                    acc[variant.color].push(variant.size);
                }
                return acc;
            }, {});

            setColors(colorToSizes);

            const sizeToColors = product.variants?.reduce((acc: { [size: string]: string[] }, variant) => {
                if (!acc[variant.size]) {
                    acc[variant.size] = []; // Use a Set to avoid duplicates
                }
                if (!acc[variant.size].includes(variant.color) && variant.inventory > 0) {
                    acc[variant.size].push(variant.color);
                }
                return acc;
            }, {});

            if (sizeToColors) {
                const order = ["XS", "S", "M", "L", "XL", "XXL"];

                const sortedObj: { [key: string]: string[] } = {};
                const unsortObj: { [key: string]: string[] } = {};

                order.forEach(key => {
                    if (sizeToColors[key]) {
                        sortedObj[key] = sizeToColors[key];
                    }
                });

                Object.keys(sizeToColors).forEach(s => {
                    if(!order.includes(s)) {
                        unsortObj[s] = sizeToColors[s]
                    }
                })

                setSizes({...sortedObj, ...unsortObj });
            }
        }
    }, [product])

    const colorAvailable = (color: string) => {
        if (!selectedSize) return true;
        if (sizes[selectedSize] && sizes[selectedSize].includes(color)) return true;
        return false;
    }

    const sizeAvailable = (size: string) => {
        if (!selectedColor) return true;
        if (colors[selectedColor] && colors[selectedColor].includes(size)) return true;
        return false;
    }

    useEffect(() => {
        if (selectedColor && selectedSize) {
            if (product && product.variants) {
                const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
                if (variant) {
                    setSelectedVariant(variant)
                }
            }
        }
    }, [selectedColor, selectedSize, product])

    const handleAddCart = async () => {
        if (!token) {
            handleCloseView()
            return router.replace(`/auth`)
        }

        if (!selectedColor) {
            const message = 'Hãy chọn màu sắc.'
            return setValidation({ color: message })
        }

        if (!selectedSize) {
            const message = 'Hãy chọn kích thước.'
            return setValidation({ size: message })
        }

        if (product && selectedVariant && token) {
            setAddCartLoading(true)
            const addCartRequest = { productId: product._id, variantId: selectedVariant._id as string, quantity }
            const addCart = await cartApiRequest.addCart(token, dispatch, addCartRequest)
            dispatch(getCart(addCart.payload))
            setAddCartLoading(false)
            dispatch(setNotify({ success: 'Đã thêm vào giỏ hàng' }))
        }
    }

    function handleCloseView() {
        dispatch(clearProductView())
        setQuantity(1)
        setSelectedColor('')
        setSelectedSize('')
        setSelectedVariant(undefined)
        setSlideIndex(1)
    }

    if (!product) return null;
    return (
        <div className='view-detail-product-modal quickview'>
            <section className="product-details">
                <div className="product-page-img">
                    {
                        product &&
                        product.images.map((image, index) => (
                            <div key={index} className="mySlides"
                                style={{
                                    display: (index + 1) === slideIndex ? "block" : "none",
                                    "--url": `url(${image.url})`,
                                    "--zoom-x": "0%", "--zoom-y": "0%",
                                    "--zoom-display": "none"
                                } as React.CSSProperties}
                                onMouseMove={(e) => handleZoomImage(e, index)}
                                onMouseLeave={() => handleMouseLeave(index)}
                            >
                                <div className="numbertext">{index + 1} / {product.images.length}</div>
                                <Image src={image.url} alt="" width={500} height={500} priority />
                            </div>
                        ))
                    }
                    <a href="#!" className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
                    <a href="#!" className="next" onClick={() => plusSlides(+1)}>&#10095;</a>

                    <div className="slider-img" draggable={true} ref={slideRef}
                        onDragStart={dragStart}
                        onDragOver={dragOver}
                        onDragEnd={dragEnd}
                    >
                        {
                            product &&
                            product.images.map((image, index) => (
                                <div key={index}
                                    className={`slider-box ${index + 1 === slideIndex ? 'active' : ''}`}
                                    onClick={() => setSlideIndex(index + 1)}
                                >
                                    <Image src={image.url} alt="" width={500} height={500} priority />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="product-page-details">
                    <strong>{product?.title}</strong>

                    <p className="product-category">
                        #{product?.product_sku}
                        <label>/ Phân loại: </label>
                        {
                            product && product.category &&
                            <span>{product.category.name}</span>
                        }
                    </p>
                    <div className="review-detail-product">
                        <Rating color="#ffce3d" value={product?.rating as number} text={''} />
                        <span className='num-review-product'>&#40; {product?.reviews?.length} đánh giá &#41;</span>
                    </div>
                    <p className="product-price">
                        ${product?.price}
                    </p>

                    <div className='description__product_wrapper'>
                        <div className='description_heading'>
                            Đặc điểm nổi bật
                        </div>
                        <p className="small-desc">{product?.description}</p>
                    </div>

                    <div className='select__type_wrapper'>
                        <span>Chọn màu sắc: </span>
                        <div className="product-options size-select" style={{ marginBottom: '10px' }}>
                            {
                                colors &&
                                Object.keys(colors).map((color, index) => (
                                    <div className="size" key={index}>
                                        <input type='radio' name='color' key={index} value={color} id={color}
                                            onChange={() => setSelectedColor(color)}
                                            checked={selectedColor === color}
                                            disabled={colorAvailable(color) == false}
                                        />
                                        <label
                                            htmlFor={color}
                                            style={{ opacity: colorAvailable(color) ? 1 : 0.5 }}
                                        >{color}
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            validation.color &&
                            <span style={{ color: 'red' }}>{validation.color}</span>
                        }
                    </div>

                    <div className='select__type_wrapper'>
                        <span>Chọn size: </span>
                        <div className='size-select' style={{ marginBottom: '10px' }}>
                            {
                                sizes &&
                                Object.keys(sizes).map((sz, index) => {
                                    return <div className='size' key={index}>
                                        <input type='radio' name='size' key={index} value={sz} id={sz}
                                            onChange={() => setSelectedSize(sz)}
                                            checked={selectedSize === sz}
                                            disabled={sizeAvailable(sz) == false}
                                        />
                                        <label
                                            htmlFor={sz}
                                            style={{ opacity: sizeAvailable(sz) ? 1 : 0.5 }}
                                        >{sz}
                                        </label>
                                    </div>
                                })
                            }
                        </div>
                        {
                            validation.size &&
                            <span style={{ color: 'red' }}>{validation.size}</span>
                        }
                    </div>

                    {/* <div className="product-page-offer">
                                <i className="fa-solid fa-tag" />20% Discount
                            </div> */}
                    {
                        selectedVariant &&
                        <div className="product-sold">
                            <BsCartCheck />
                            <strong>{selectedVariant.inventory}<span> sản phẩm có sẵn .</span></strong>
                        </div>

                    }

                    <div className="product-sold">
                        <Image src={SoldIcon} alt="SoldIcon" width={0} height={0} />
                        <strong>{product?.sold ? product?.sold : 0}<span> sản phẩm đã bán.</span></strong>
                    </div>

                    <div className="quantity-btn">
                        <span className='quantity__label'>Số lượng: </span>
                        <div className='quantity__controll_wrapper'>
                            <button onClick={() => quantity === 1 ? setQuantity(1) : setQuantity(quantity - 1)}><GrFormSubtract /></button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}><FiPlus /></button>
                        </div>
                    </div>

                    {
                        roles && roles.includes('admin') ? null :
                        <div className="cart-btns">
                        
                            <button className="add-cart"
                                onClick={handleAddCart}
                                disabled={addCartLoading}
                                style={{ opacity: addCartLoading ? 0.7 : 1 }}
                            >
                                Thêm vào giỏ hàng
                            </button>

                            <Link className="view-detail" href={`/product/${convertStringToSEO(product.title)}-${product._id}.html`} onClick={handleCloseView}>
                                Xem chi tiết
                            </Link>
                        </div>
                    }
                </div>
            </section>
            <div className="view-close" onClick={handleCloseView}>
                <IoCloseOutline />
            </div>
        </div>
    )
}
