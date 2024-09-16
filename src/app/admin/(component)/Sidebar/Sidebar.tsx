import { BiAddToQueue, BiCategory, BiReceipt } from "react-icons/bi";
import { FaChartPie, FaUsers, FaUserShield } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";

export const SidebarData = [
    {
        title: 'Thống kê',
        path: '/admin/dashboard/charts',
        icon: <FaChartPie />
    },
    {
        title: 'Người dùng',
        path: '/admin/dashboard/users',
        icon: <FaUsers />
    },
    {
        title: 'Quản lý',
        path: '/admin/dashboard/staff',
        icon: <FaUserShield />
    },

    {
        title: 'Sản phẩm',
        path: '/admin/dashboard/products',
        icon: <GiClothes />
    },
    {
        title: 'Tạo sản phẩm',
        path: '/admin/dashboard/create-product',
        icon: <BiAddToQueue />
    },
    {
        title: 'Tạo danh mục',
        path: '/admin/dashboard/categories',
        icon: <BiCategory />
    },

    {
        title: 'Đơn hàng',
        path: '/admin/dashboard/orders',
        icon: <BiReceipt />
    }

]