import './styles/submenu.css'
import Link from 'next/link';

export function SubMenu({ item }: { item: SidebarItem }) {
    return (
        <>
            <Link href={item.path || '#!'} className='sidebar-link'>
                <div className='sidebar-item'>
                    {item.icon}
                    <span className='sidebar-label'>{item.title}</span>
                </div>
            </Link>
        </>
    )
}