import { ImageObject } from '@/app/types/schema/image'
import Image from 'next/image'
import React from 'react'
import { FaTrash } from 'react-icons/fa'

export default function ImageList({ images, deleteImage }: { images: (Blob | ImageObject)[], deleteImage: (index: number) => void }) {
    return (
        <ul className="file-list">
            {
                images.map((file, index) => {
                    if (file instanceof Blob) {
                        return (<li key={index} className="file-item">
                            <Image src={URL.createObjectURL(file)} alt="image" 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }} width={500} height={500}/>
                            <div className="actions">
                                <div className="delete-image">
                                    <FaTrash
                                        onClick={() => deleteImage(index)}
                                    />
                                </div>
                            </div>
                        </li>)  
                    } else {
                        return (<li key={index} className="file-item">
                            <Image src={file.url} alt="image" 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }} width={500} height={500}/>
                            <div className="actions">
                                <div className="delete-image">
                                    <FaTrash
                                        onClick={() => deleteImage(index)}
                                    />
                                </div>
                            </div>
                        </li>)  
                    }
                })
            }
        </ul>
    )
}
