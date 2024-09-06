import { NUM_PER_PAGE } from '@/config';
import './styles/paginator.css'
import React from 'react'

export interface ListData {
    data: any[];
    total: number;
    page: number;
}

export default function Paginator<T extends ListData>({ list, total, limit, callback }: { list: T, total: number, limit?: number, callback: (num: number) => void }) {
    const { page } = list

    const totalPages = Math.ceil(total/( limit ? limit : NUM_PER_PAGE))
    const newArr = [...Array(totalPages)].map((_, i) => i + 1)

    const isActive = (index: number) => {
        if (index === page) return 'active';
        return ''
    }

    const handlePagination = (num: number) => {
        // dispatch({type: CHANGE_PAGE, payload: num })
        callback(num)
    }

    return (
        <nav aria-label="Page navigation example"
            style={{ cursor: 'pointer' }}>
            <ul className="pagination">
                {
                    page > 1 &&
                    <li className="page-item" onClick={() => handlePagination(page - 1)}>
                        <span className="page-link" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </span>
                    </li>
                }

                {
                    newArr.map(num => (
                        <li key={num} className={`page-item ${isActive(num)}`}
                            onClick={() => handlePagination(num)}>
                            <span className="page-link">
                                {num}
                            </span>
                        </li>
                    ))
                }

                {
                    page < totalPages &&
                    <li className="page-item"
                        onClick={() => handlePagination(page + 1)}>
                        <span className="page-link" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </span>
                    </li>
                }

            </ul>
        </nav>
    )
}

