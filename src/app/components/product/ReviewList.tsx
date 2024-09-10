import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Rating from '../Rating';
import moment from 'moment';
import { reviewApiRequest } from '@/app/api-request/review.api';
import Paginator from '../Paginator';

export default function ReviewList({ productId }: { productId: string }) {
    const [reviewsData, setReviewsData] = useState<ReviewState>()
    const [reviews, setReviews] = useState<Review[]>([])
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState('')

    useEffect(() => {
        const fetchReviews = async () => {
            const res = await reviewApiRequest.getReview(productId, 5, page, { sort })

            setReviewsData({ ...res.payload, page: Number(res.payload.page) })
            setReviews(res.payload.data)
        }

        fetchReviews()
    }, [productId, page, sort])

    const handleChangePage = (page: number) => {
        setPage(page)
    }

    return (
        <>
            <div className="row" style={{ margin: '15px 0' }}>
                <span>Sắp xếp theo thời gian: </span>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value=''>Mới nhất</option>
                    <option value='sort=oldest'>Cũ nhất</option>
                </select>
            </div>
            {
                reviews.length === 0 && (
                    <p style={{ color: '#585151', fontWeight: '300', fontSize: '15px', fontStyle: 'italic' }}>Không có đánh giá</p>
                )
            }
            {
                reviews.map(review => (
                    <div className='review' key={review._id}>
                        <div className="review-wrapper">
                            <Image
                                src={review.user.avatar} alt="avt-reviewer"
                                width={500} height={500} priority
                            />
                            <div className="">
                                <strong>{review.user.username}</strong>
                                <Rating color="#ffce3d" value={review.rating} text={''} />
                                <span>{moment(review.createdAt).calendar()}</span>
                                <p>{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
            {
                reviewsData && reviewsData.total > 1 &&
                <Paginator<ReviewState>
                    list={reviewsData}
                    total={reviewsData.total}
                    limit={5}
                    callback={handleChangePage}
                />
            }
        </>
    );
}
