import styles from "./page.module.css";
import './styles/home.css'
import MySlider from "./components/MySlider";
import { SlPaypal, SlDiamond } from 'react-icons/sl'
import { FiShoppingBag } from 'react-icons/fi'
import { RiHandHeartLine } from 'react-icons/ri'
import Image from "next/image";
import RecomFYBanner from '../images/banner-clothing.jpg'
import BestSABanner from '../images/best-seller-banner.jpg'
import NewABanner from '../images/img-banner-index.jpg'
import Link from "next/link";
import { productsApiRequest } from "./api-request/products.api";
import ProductItem from "./components/product/ProductItem";

export default async function Home() {
  const iconStyle = {
    color: '#d93938',
    fontSize: '26px'
  }

  const recommendDataResponse = await productsApiRequest.getRecommendList(8)
  const bestSellerDataResponse = await productsApiRequest.getBestSeller(8)
  const recommendList = recommendDataResponse.payload.data
  const bestSellerList = bestSellerDataResponse.payload.data
  
  return (
    <main className={styles.main}>
       <>
            <MySlider></MySlider>
            <div className="res-row service-container">
                <div className="col l-3 m-3 c-12">
                    <div className="service-item">
                        <div className="service-icon"><FiShoppingBag style={iconStyle} /></div>
                        <div className="service-content">
                            <h4 className="service-heading">Miễn phí giao hàng</h4>
                            <p className="service-des">Miễn phí ship với đơn hàng &gt; 300k</p>
                        </div>
                    </div>
                </div>
                <div className="col l-3 m-3 c-12">
                    <div className="service-item">
                        <div className="service-icon"><SlPaypal style={iconStyle} /></div>
                        <div className="service-content">
                            <h4 className="service-heading">Thanh toán Paypal</h4>
                            <p className="service-des">Thanh toán trực tuyến với Paypal</p>
                        </div>
                    </div>
                </div>
                <div className="col l-3 m-3 c-12">
                    <div className="service-item">
                        <div className="service-icon"><SlDiamond style={iconStyle} /></div>
                        <div className="service-content">
                            <h4 className="service-heading">Khách hàng VIP</h4>
                            <p className="service-des">Ưu đãi cho khách hàng VIP</p>
                        </div>
                    </div>
                </div>
                <div className="col l-3 m-3 c-12">
                    <div className="service-item">
                        <div className="service-icon"><RiHandHeartLine style={iconStyle} /></div>
                        <div className="service-content">
                            <h4 className="service-heading">Hỗ trợ bảo hành</h4>
                            <p className="service-des">Đổi, sửa đồ tại tất cả store</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col l-10 l-o-1">
                <div className="res-row best-seller-container">
                    <div className='banner__products_wrapper'>
                        <Image className="banner__products_type_list" 
                        src={RecomFYBanner} 
                        priority 
                        width={0} 
                        height={0}
                        style={{width: '100%', height: 'auto'}}
                        alt="banner_1" />
                    </div>
                    <div className="col l-12 m-12 c-12">
                        {
                            recommendList?.length > 0 &&
                            <div className="res-row products">
                                {
                                    recommendList.map((product: Product) => {
                                        return <ProductItem key={product._id} product={product}/>
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className="res-row best-seller-container">
                    <div className='banner__products_wrapper'>
                        <Image className="banner__products_type_list" 
                        priority
                        width={0} 
                        height={0}
                        style={{width: '100%', height: 'auto'}}
                        src={BestSABanner} alt="banner_2"/>
                    </div>
                    <div className="col l-12 m-12 c-12">
                        {
                            bestSellerList?.length > 0 &&
                            <div className="res-row products">
                                {
                                    bestSellerList.map(product => {
                                        return <ProductItem key={product._id} product={product}/>
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>

                <div className="res-row best-seller-container">
                    <div className='banner__products_wrapper'>
                        <Image className="banner__products_type_list" src={NewABanner} 
                        priority 
                        width={0} 
                        height={0}
                        style={{width: '100%', height: 'auto'}} 
                        alt="banner_3"/>
                    </div>
                    <div className="col l-12 m-12 c-12">
                        {/* {
                            loading.newarrival ? <div><Loading/></div> :
                            <div className="res-row products">
                                {
                                    newArrival.map(product => {
                                        return <ProductItem key={product._id} product={product}
                                            setCurrentProduct={setCurrentProduct} handleViewDetail={handleViewDetail}
                                        />
                                    })
                                }
                            </div>
                        } */}
                    </div>
                </div>
                <div className="res-row">
                    <div className="l-12 m-12 c-12">
                        <div className="watch-more-products-wrapper">
                            <Link href="/products" className="watch-more-products">
                                Xem thêm
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="product-view-detail-box">
                    {/* {currentProduct && <QuickViewProduct detailProduct={currentProduct} />} */}
                </div>
            </div>
        </>
    </main>
  );
}
