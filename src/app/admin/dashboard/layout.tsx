import './dashboard.css'
import Link from 'next/link'
import Logo from '../../../images/thivlevel-logo-4.png'
import Image from "next/image";
import ProfileDropdown from "../(component)/ProfileDropdown";
import { SidebarData } from "../(component)/Sidebar/Sidebar";
import { SubMenu } from "../(component)/SubMenu";
import { Metadata } from 'next';
import LogoutSection from '../(component)/LogoutSection';

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Clothing store for you",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
        <div className='nav'>
          <Link href="/admin/dashboard" className='nav-icon'>
            <Image src={Logo} style={{ width: '150px', height: '50px' }} alt="logo"/>
          </Link>

          <div className='flex-div'>
            <Link href='/admin/profile' className='admin-profile'>
                <ProfileDropdown />
            </Link>

            <LogoutSection />
          </div>
        </div>

        <nav className='sidebar-nav'>
          <div className='sidebar-wrap'>
            {SidebarData.map((item, index) => (
              <SubMenu
                item={item}
                key={index}
              />
            ))}
          </div>
          <div className='main-content'>
            {children}
          </div>
        </nav>
    </>
    );
}
