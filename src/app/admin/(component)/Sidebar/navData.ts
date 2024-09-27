interface NavItems {
    charts: string
    users: string 
    products: string 
    categories: string
    orders: string 
}

interface NavLinks {
    charts: string
    users: string
    products: string
    createProduct: string
    categories: string
    orders: string
}

export const navItems: NavItems = {
    charts: '/admin/dashboard/charts',
    users: '/admin/dashboard/users',
    products: '/admin/dashboard/products',
    categories: '/admin/dashboard/categories',
    orders: '/admin/dashboard/orders'
}

export const navLinks: NavLinks = {
    charts: '/admin/dashboard/charts',
    users: '/admin/dashboard/users',
    products: '/admin/dashboard/products',
    createProduct: '/admin/dashboard/create-product',
    categories: '/admin/dashboard/categories',
    orders: '/admin/dashboard/orders'
}