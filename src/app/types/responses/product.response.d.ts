interface ProductDataResponse {
    page: string,
    total: number,
    data: Product[],
}

interface ProductDetailDataResponse extends Product {}