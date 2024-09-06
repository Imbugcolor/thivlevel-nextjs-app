'use client'
import './styles/searchbar.css'
import React, { useEffect, useState } from 'react'
import { GoSearch } from 'react-icons/go'
import useDebounce from '../hooks/useDebounce';
import { productsApiRequest } from '../api-request/products.api';
import Link from 'next/link';
import Image from 'next/image';
import { InputChange } from '../types/html-elements';
import { replaceAccentedCharacters } from '@/lib/utils/regex';

export default function SearchBar() {
    const [wordEntered, setWordEntered] = useState('')
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState<Product[]>([])
    const [openResult, setOpenResult] = useState(false)
    const [moveOut, setMoveOut] = useState(false)

    useDebounce(async () => {
        if(wordEntered) {
            setLoading(true)
            const searchData = await productsApiRequest.getList(8, 1, { search: wordEntered })
            setSearch(searchData.payload.data);
            setOpenResult(true)
            setLoading(false)
        }
    }, [wordEntered], 800
    );

    const handleSearch = (e: InputChange) => {
        setSearch([])
        setMoveOut(false)
        setOpenResult(false)
        setWordEntered(e.target.value)
    }

    const handleCloseSearch = () => {
        setWordEntered('')
        setSearch([])
    }

    return (
        <div className="filter_menu product">
            <div className="search search__bar_wrapper" >
                <div className="search__input_icon">
                    <GoSearch />
                </div>
                <input className="search-input-bd-none search__bar_input" type="text" placeholder="Nhập sản phẩm bạn muốn tìm kiếm ..."
                    value={wordEntered}
                    onChange={handleSearch}
                />
                <div className='close_search_bar' style={{ opacity: wordEntered ? 1 : 0 }}
                    onClick={handleCloseSearch}>
                    Hủy
                </div>
                {
                    wordEntered && search.length > 0 &&
                    <ul className="list_item_suggest">
                        <li className='key_search_msg'>
                            <GoSearch /> kết quả cho &apos;{wordEntered}&apos;
                        </li>
                        {
                            search.map((item, index) => {
                                return index > 15 ? null :
                                    <li key={item._id} className="item_suggest_result">
                                        <div className='left__item_suggest_result'>
                                            <Link href={`/product/${item._id}`} className="redirect_item_result" onClick={(e) => {
                                                setWordEntered((e.target as HTMLElement).innerText)
                                                setOpenResult(false)
                                                setSearch([])
                                                setMoveOut(true)
                                            }}>
                                                {item.title}
                                            </Link>
                                            <span>{item.price} $</span>
                                        </div>
                                        <div className='right__item_suggest_result'>
                                            <Link href={`/product/${item._id}`} className="redirect_item_result" onClick={(e) => {
                                                setWordEntered((e.target as HTMLElement).innerText)
                                                setOpenResult(false)
                                                setSearch([])
                                                setMoveOut(true)
                                            }}>
                                                <Image src={item.images[0].url} width={500} height={500} alt='product-image-search' />
                                            </Link>
                                        </div>
                                    </li>
                            })
                        }
                    </ul>
                }
                {
                    wordEntered && search.length == 0 && openResult && !moveOut &&
                    <ul className="list_item_suggest">
                        <li className='not__found_msg'>
                            <GoSearch /> Không có kết quả cho &apos;{wordEntered}&apos;
                        </li>
                    </ul>
                }
            </div>

        </div >
    )
}
