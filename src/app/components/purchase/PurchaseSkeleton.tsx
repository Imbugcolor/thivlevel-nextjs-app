import React from 'react'

export default function PurchaseSkeleton() {
    return (
        <>
        {
            [0,1].map(element => ( 
                <div className="my__order_item" key={element}>
                    <div className="my__order_item_heading">
                        <h3 className="skeleton my_order_status" style={{ width: '250px', height: '25px'}}>
                           <span className=''></span>
                        </h3>
                        <span className='skeleton my__order_number'></span>
                        <span className='skeleton my__order_number uppercase'></span>
                    </div>
                    <div className="skeleton my__order_item_images" style={{ width: '200px', height: '250px'}}>
                    </div>
                    <div>
                        <div className="skeleton my__order_item_bottom" style={{ width: '150px', height: '20px' }}>
                        </div>
                        <div className="skeleton my__order_item_view" style={{ width: '100%', height: '30px' }}>
                        </div>
                    </div>
                </div>
            ))
        }
        </>
    )
}
