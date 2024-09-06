'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Breadcrumbs() {

    const pathname = usePathname()
    const BreadcrumbsArray = pathname.split('/')
    BreadcrumbsArray.shift()

  
    if (!BreadcrumbsArray[0]) return <></>
    return (
        <>
            <ul className="container-box breadcrumbs" style={{ fontSize: '15px' }}>
                <li style={{ display: 'flex', gap: '5px' }}>
                    <Link href='/' style={{ color: '#16617b' }}>
                        Home
                    </Link>
                </li>
                <li>
                    <h4> {'>'} </h4>
                </li>
                {BreadcrumbsArray.map((item, index) => {
                    const href = '/' +
                        BreadcrumbsArray.slice(0, index + 1).join('/');
                    return (
                        <div key={index} style={{ display: 'flex', gap: '10px'}}>
                            <li style={{ display: 'flex', gap: '5px' }}>
                                <Link href={href} style={{ color: index < BreadcrumbsArray.length - 1 ? '#16617b' : '#888' }}>
                                    {item}
                                </Link>
                            </li>
                            <li>
                                {index < BreadcrumbsArray.length - 1 && (
                                    <h4> {'>'} </h4>
                                )}
                            </li>
                        </div>
                    );
                })}
            </ul>
        </>
    )
}