import React, { useEffect, useState } from 'react'
import Rating from '../Rating';
import { IoIosStar } from 'react-icons/io';
import { Line } from 'rc-progress';
import { count_element_in_array } from '@/lib/utils/func';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { FaStar } from 'react-icons/fa';
import Image from 'next/image';
import { FormSubmit } from '@/app/types/html-elements';
import ReviewList from './ReviewList';
import { setNotify } from '@/lib/features/notifySlice';
import { useRouter } from 'next/navigation';
import { reviewApiRequest } from '@/app/api-request/review.api';
import { addReviewProduct } from '@/lib/features/productdetailSlice';

export default function Reviews({ product }: { product: Product }) {
    const router = useRouter()
    const user = useAppSelector(state => state.auth).user
    const token = useAppSelector(state => state.auth).token
    const dispatch = useAppDispatch()
    const [perRating, setPerRating] = useState<number[]>([])
    const [hover, setHover] = useState<number | null>(null)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [validation, setValidation] = useState<{[key: string]: string}>({})

    const calcPercent = (countArray: number[], starsArray: number[]) => {
        const perStars: number[] = [];
        for(let i=0; i < countArray.length; i++){
           const per = countArray[i] / starsArray.length * 100
           perStars.push(Number(per.toFixed(0)))
        } 
        return perStars
    }

    useEffect(() => {
        if(product.reviews) {
            if(product.reviews?.length > 0){
                const ratingsArray = product.reviews.flat()
                const starsArray = ratingsArray.map(item => { return item.rating; })
    
                const stars = [];

                for(let i=1;i<=5;i++){
                    const countStars = count_element_in_array(starsArray, i)
                    stars.push(countStars)
                }

                const perRatingResult = calcPercent(stars,starsArray)
                setPerRating(perRatingResult)
            } else {
                setPerRating([0,0,0,0,0])
            }
        }
      
    }, [product.reviews])
    
    const validate = () => {
        const message: {[key: string]: string} = {}

        if (!rating) {
            message.rating = '*Hãy đánh giá sao.'
        }

        if (!comment) {
            message.rating = '*Hãy để lại lời đánh giá.'
        }

        setValidation(message)
        if (Object.keys(message).length > 0) return false
        return true
    }

    const handleSubmitReview = async(e: FormSubmit) => {
        e.preventDefault()
        if(!token) {
            return router.replace(`/auth?previous=product/${product._id}`)
        }

        const isValid = validate()
        if (!isValid) return;

        try {
            const body = { productId: product._id, rating, comment }
            const res = await reviewApiRequest.addReview(token, dispatch, body)

            dispatch(addReviewProduct(res.payload))
            setRating(0)
            setComment('')
            dispatch(setNotify({ success: 'Cảm ơn bạn đã đánh giá!'}))
        } catch (err: any) {
            setRating(0)
            setComment('')
            console.log(err)
            dispatch(setNotify({ error: err.message || 'Lỗi khi gửi đánh giá'}))
        }
    }
    return (
        <div className='review-section'>
            <div className='Reviews'>
                <h2 className='tag-color'>Khách hàng đánh giá ({product.reviews?.length})</h2>
                <div className='rating-statistics'>
                    <div className='rating-left-side'>
                        <div className='rating-num-statistics'>
                            <span>{product.rating?.toFixed(1)}</span>
                        </div>
                        <div className='rating-stars-statistics'>
                            <Rating color="#ffce3d" value={product.rating as number} text={''} />
                        </div>
                    </div>
                    <div className='rating-right-side'>
                        <div className='rating-percent-statistics'>
                            <div className='heading-right-side'>
                                <span>Tỉ lệ đánh giá: </span>
                            </div>
                            {
                                perRating.map((item, index) => {
                                    return <div className='rating-bar-percent' key={index}>
                                        <div className='label-rating-percent'>
                                            <div className='label-num-rating'>{index + 1}
                                            </div>
                                            <IoIosStar />
                                        </div>
                                        <Line percent={item}
                                            strokeWidth={1}
                                            strokeColor="#000"
                                            strokeLinecap='square'
                                            style={{ height: '10px', maxWidth: '250px', width: '100%' }} 
                                        />
                                        <span className='rating-num-percent'>{item}%</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <ReviewList productId={product._id}/>
            </div>
            {token ? (

                <form className="form" onSubmit={handleSubmitReview}>
                    <div>
                        <h2 className='tag-name' style={{ marginTop: '20px' }}>Đánh giá của bạn</h2>
                    </div>
                    <div className="rating-wrapper">
                        <div className='rating-star'>
                            <label htmlFor="rating" style={{ paddingRight: 10, textTransform: 'uppercase', color: '#555', fontWeight: 500 }}>Rate</label>
                            {
                                [...Array(5)].map((star, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <label key={ratingValue}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={ratingValue}
                                                onClick={() => setRating(ratingValue)}
                                                style={{ display: 'none' }}
                                            />
                                            <FaStar
                                                className='star'
                                                color={ratingValue <= (hover || rating) ? "#ffce3d" : "#cccdd3"}
                                                style={{ cursor: 'pointer' }}
                                                size={30}
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(null)} />
                                        </label>
                                    )
                                })
                            }
                        </div>
                        <div className="form-comment">
                            {/* <label htmlFor="comment">Comment</label> */}
                            <div className="comment-avt-user">
                                <Image 
                                    src={user?.avatar || "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg"} 
                                    alt="avt" draggable={false} priority width={500} height={500} 
                                />
                            </div>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Viết đánh giá ở đây..."
                                required
                            ></textarea>
                        </div>

                        <div className='send'>
                            <button className={comment ? "primary active" : "primary"} type="submit">
                                Gửi
                            </button>
                        </div>

                    </div>

                </form>

            ) : null}
        </div>
    )
}
