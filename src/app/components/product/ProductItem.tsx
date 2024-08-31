import "../styles/product-item.css"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Rating from '../Rating';

export default function ProductItem({ product }: { product: Product}) {
    return (
      <div className="col l-3 m-4 c-6">
        <div className="product_card">
          <div className="product_img">
            {
              product.images.length < 2 ?
              <Image className="product_img-0" src={product.images[0].url} alt="product_thumbnail" width={500} height={500}/> :
              <>
                <Image className="product_img-1" src={product.images[0].url} alt="product_thumbnail" width={500} height={500}/>
                <Image className="product_img-2" src={product.images[1]?.url} alt="product_thumbnail" width={500} height={500}/>
              </>
            }
            <div className="quick-view">
              Xem nhanh
            </div>
          </div>
  
          <div className="product_box">
            <h3 title={product.title}>
              <Link href={`/detail/${product._id}`}>
                {product.title}
              </Link>
            </h3>
            <Rating
              color="#ffce3d"
              value={product.rating as number}
              text={`${product.numReviews} reviews`}
            />
            <h4 className="product_price">${product.price}</h4>
          </div>
  
        </div>
      </div>
    )
}
