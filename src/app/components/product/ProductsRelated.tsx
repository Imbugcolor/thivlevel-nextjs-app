import { productsApiRequest } from '@/app/api-request/products.api'
import React, { useEffect, useState } from 'react'
import ProductItem from './ProductItem'

export default function ProductsRelated({ productId, categoryId }: { productId: string, categoryId: string }) {

  const [productsRelated, setProductsRelated] = useState<Product[]>([])

  useEffect(() => {
    (async () => {
      const res = await productsApiRequest.getList(4, 1, { category: categoryId })
      const data = res.payload.data.filter(product => product._id !== productId)
      setProductsRelated(data)
    })()
  }, [productId, categoryId])

  return (
    <div className="related-products">
      <h2 className='tag-color'>Sản phẩm liên quan</h2>
      <div className="products relate-products-list res-row">
        {
          productsRelated.length > 0 && productsRelated.map((product) =>
            <ProductItem key={product._id} product={product} />
          )
        }
      </div>
    </div>
  )
}
