interface Review {
    _id: string,
    rating: number,
    comment: string,
    user: Reviewer,
    createdAt: string,
    updatedAt: string,
}

interface Reviewer {
    imageProfile: ImageObject,
    _id: string,
    username: string
}