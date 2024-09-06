import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/user']
const authPaths = ['/auth']

// const productEditRegex = /^\/products\/\d+\/edit$/

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('refreshtoken')?.value
  // Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  // Đăng nhập rồi thì không cho vào login/register nữa
  if (authPaths.some((path) => pathname.startsWith(path)) && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
// matcher: ['/auth', '/register', '/products/:path*']
export const config = {
  matcher: ['/auth/:path*', '/user/:path*']
}