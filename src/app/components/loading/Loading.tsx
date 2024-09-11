import "./loading.css"
import React from 'react'

export default function Loading() {
    return (
        <div className="loading"
            style={{ background: '#0008', color: 'white', top: 0, left: 0, zIndex: 104 }}>
            <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}
