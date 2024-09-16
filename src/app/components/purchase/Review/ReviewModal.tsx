import { reviewApiRequest } from "@/app/api-request/review.api";
import "./review-modal.css"
import { FormSubmit } from '@/app/types/html-elements';
import { OrderItem } from '@/app/types/schema/order';
import { clearItemReview } from '@/lib/features/reviewSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { addReviewProduct } from "@/lib/features/productdetailSlice";
import { setNotify } from "@/lib/features/notifySlice";
import { UnknowAvatar } from "@/lib/utils/unknow.avatar";

export default function ReviewModal({ item }: { item: OrderItem }) {
  const token = useAppSelector(state => state.auth).token
  const user = useAppSelector(state => state.auth).user
  const dispatch = useAppDispatch()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [validation, setValidation] = useState<{[key: string]: string}>({})
  const [success, setSucess] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const reviewSubmit = async(e: FormSubmit) => {
    e.preventDefault()
    const isValid = validate()
    if (!token || !isValid || success) return;

    try {
        setLoading(true)
        const body = { productId: item.productId._id, rating, comment }
        const res = await reviewApiRequest.addReview(token, dispatch, body)

        dispatch(addReviewProduct(res.payload))
        setRating(0)
        setComment('')
        setLoading(false)
        setSucess(true)
    } catch (err: any) {
        setLoading(false)
        setRating(0)
        setComment('')
        console.log(err)
        dispatch(setNotify({ error: err.message || 'Lỗi khi gửi đánh giá'}))
    }
  }

  return (
    <div className='review__feedback_modal'>
        <div className='review__container'>
            <div>
                <h2 className='tag-name' style={{ marginTop: '20px' }}>Đánh giá của bạn</h2>
            </div>
            <div className='review__item'>
                <Image src={item.productId.images[0].url} alt='review' width={500} height={500} priority/>
                <p>{item.productId.title}</p>
            </div>
            <div className='review__form'>
                <form className="form" onSubmit={reviewSubmit}>
                    <div>
                        { validation[Object.keys(validation)[0]] && <span style={{ color: 'red' }}>{validation[Object.keys(validation)[0]]}</span> }
                        { success && <span style={{ color: 'green' }}>Cảm ơn bạn đã đánh giá</span>}
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
                                                disabled={loading || success}
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
                        <div className="form-review">
                            {/* <label htmlFor="comment">Comment</label> */}
                            <div className="review__avt-user">
                                <Image 
                                  src={user?.avatar || UnknowAvatar} 
                                  alt="user" 
                                  draggable={false} 
                                  width={500}
                                  height={500}
                                  priority
                                  />
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Viết đánh giá ở đây..."
                                required
                                disabled={loading || success} 
                            ></textarea>
                        </div>

                        <div className='send'>
                            <button className={!loading || !success ? "primary active" : "primary"} type="submit">
                                Gửi
                            </button>
                        </div>

                    </div>

                </form>
            </div>
        </div>
        <div className="modal-close-btn" onClick={() => dispatch(clearItemReview())}>
          <IoCloseOutline />
        </div>
    </div>
)
}
