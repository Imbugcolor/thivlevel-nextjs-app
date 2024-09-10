interface ReviewState {
    data: Review[],
    total: number,
    page: number,
}
interface Review {
    _id: string,
    rating: number,
    comment: string,
    user: Reviewer,
    productId: string,
    createdAt: string,
    updatedAt: string,
}

interface Reviewer {
    _id: string,
    username: string
    avatar: string,
}