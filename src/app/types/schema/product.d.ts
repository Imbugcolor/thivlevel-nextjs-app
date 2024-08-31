interface Product {
    _id: string
    product_sku: string,
    title: string,
    description?: string,
    content?: string,
    images: ImageObject[],
    variants?: Variant[],
    price: number,
    sold?: number,
    rating?: number,
    numReviews?: number,
    isPublished: boolean,
    category?: string,
    reviews?: Review[],
    createdAt?: string,
    updatedAt?: string,
}