import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from './lib/jwt.payload'

const privatePaths = ['/user', '/cart']
const adminPaths = ['/admin/profile','/admin/dashboard']
const authPaths = ['/auth', '/admin/auth']
// const productEditRegex = /^\/products\/\d+\/edit$/

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('refreshtoken')?.value

  // USER Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // ADMIN Chưa đăng nhập thì không cho vào admin paths
  if (adminPaths.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/admin/auth', request.url))
  }

  // Đăng nhập rồi thì không cho vào login/register nữa
  if (authPaths.some((path) => pathname.startsWith(path)) && token) {
      const decode: JwtPayload = jwtDecode(token);
      // TRƯỜNG HỢP LÀ ADMIN 
      if (decode.role.some(rl => rl === 'admin')) {
        return NextResponse.redirect(new URL('/admin/dashboard/charts', request.url))
      }
      // TRƯỜNG HỢP NGƯỜI DÙNG 
      return NextResponse.redirect(new URL('/', request.url))
  }

  // Admin đăng nhập thì chuyển qua trang dashboard
  if (pathname === '/' && token) {
    const decode: JwtPayload = jwtDecode(token);
    // TRƯỜNG HỢP LÀ ADMIN 
    if (decode.role.some(rl => rl === 'admin')) {
      return NextResponse.redirect(new URL('/admin/dashboard/charts', request.url))
    }
    // TRƯỜNG HỢP NGƯỜI DÙNG 
    return NextResponse.next()
  }

  // Không cho USER truy cập vào ADMIN Path
  if (adminPaths.some((path) => pathname.startsWith(path)) && token) {
    const decode: JwtPayload = jwtDecode(token);
    // TRƯỜNG HỢP LÀ ADMIN 
    if (!decode.role.some(rl => rl === 'admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // ADMIN Đăng nhập rồi thì không cho vào trang của USER nữa
  if (privatePaths.some((path) => pathname.startsWith(path)) && token) {
    const decode: JwtPayload = jwtDecode(token);
    // TRƯỜNG HỢP LÀ ADMIN 
    if (decode.role.some(rl => rl === 'admin')) {
      return NextResponse.redirect(new URL('/admin/dashboard/charts', request.url))
    }
  }
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
// matcher: ['/auth', '/register', '/products/:path*']
export const config = {
  matcher: ['/', '/products', '/product/:path*', '/about/:path*', '/auth/:path*', '/user/:path*', '/cart/:path*', '/admin/auth','/admin/profile', '/admin/dashboard/:path*']
}