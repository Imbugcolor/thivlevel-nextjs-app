import "./styles/footer.css"
import Image from 'next/image'
import React from 'react'
import FbIcon from '../../images/icon_fbn.webp'
import InsIcon from '../../images/icon_instan.webp'
import TiktokIcon from '../../images/icon_tiktok.webp'
import CodLogo from '../../images/cod-logo.webp'
import Visa from '../../images/visa.png'
import Mastercard from '../../images/mastercard.png'
import Jcb from '../../images/jcb.png'
import Eftpos_au from '../../images/eftpos_au.png'
import Diners from '../../images/diners.png'
import Discover from '../../images/discover.png'
import Amex from '../../images/amex.png'
import Unionpay from '../../images/unionpay.png'
import Logo from '../../images/thivlevel-logo-4.png'
import { AiFillMail, AiFillPhone } from 'react-icons/ai'
import { ImLocation } from 'react-icons/im'
import Link from 'next/link'


export default function Footer() {
    return (
        <footer className="footer">
            <div className="container-box">
                <div className="res-row">
                    <div className="col l-4 m-4 c-12 footer-item">
                        <div className="footer-logo">
                            <Image src={Logo} alt="logo" style={{ height: '65px', width: 'auto' }}/>
                            <ul>
                                <li>
                                    <AiFillMail />
                                    <span>
                                        vtclothes.shop@gmail.com
                                    </span>
                                </li>
                                <li>
                                    <AiFillPhone />
                                    <span>
                                        0123 456 789
                                    </span>
                                </li>
                                <li>
                                    <ImLocation />
                                    <span>
                                        71/9 XVNT
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col l-4 m-4 c-6 footer-item">
                        <div className="footer-item policy">
                            <h4 className="footer-item-header">Về ThivLevel</h4>
                            <ul>
                                <li>
                                    <Link href="/about/introduction">
                                        Giới thiệu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about/guarantee">
                                        Chính sách đổi trả
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about/privacyPolicy">
                                        Chính sách bảo mật
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about/termOfService">
                                        Điều khoản dịch vụ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col l-4 m-4 c-6 footer-item">
                        <div className="footer-item social-network">
                            <div>
                                <h4 className="footer-item-header">THEO DÕI CHÚNG TÔI</h4>
                                <ul>
                                    <li>
                                        <a href="https://www.facebook.com/profile.php?id=100088054956329" target="_blank">

                                            <Image className="social__media_icon" src={FbIcon} alt='facebook'/>
                                            <span>
                                                Fanpage ThiV Level
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!">
                                            <Image className="social__media_icon" src={InsIcon} alt='instagram'/>
                                            <span>
                                                Instagram ThiV Level
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!">
                                            <Image className="social__media_icon" src={TiktokIcon} alt='tiktok'/>
                                            <span>
                                                Tiktok ThiV Level
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className='payment__method_footer'>
                                <h4 className="footer-item-header">Phương thức thanh toán</h4>
                                <div className='payment__method_icon'>
                                    <Image className="social__media_icon" alt='partner' src={CodLogo} />
                                    <Image className="social__media_icon" alt='partner' src={Visa} />
                                    <Image className="social__media_icon" alt='partner' src={Mastercard} />
                                    <Image className="social__media_icon" alt='partner' src={Jcb} />
                                    <Image className="social__media_icon" alt='partner' src={Amex} />
                                    <Image className="social__media_icon" alt='partner' src={Diners} />
                                    <Image className="social__media_icon" alt='partner' src={Discover} />
                                    <Image className="social__media_icon" alt='partner' src={Unionpay} />
                                    <Image className="social__media_icon" alt='partner' src={Eftpos_au} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col l-12 m-12 c-12">
                        <h5 className="copyright">@Since 2022 THIVLEVEL</h5>
                    </div>
                </div>
            </div>
        </footer>
    )
}
