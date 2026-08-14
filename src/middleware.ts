import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define protected API methods
  const isProtectedApiMethod = ['POST', 'PUT', 'DELETE'].includes(request.method)
  
  // Determine if route requires auth
  const isDashboard = pathname.startsWith('/me')
  const isProtectedApiRoute = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth') && isProtectedApiMethod

  if (isDashboard || isProtectedApiRoute) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      if (isDashboard) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 })
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (error) {
      // Token is invalid or expired
      const response = isDashboard
        ? NextResponse.redirect(new URL('/login', request.url))
        : NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
      
      // Clear the invalid cookie
      response.cookies.delete('auth_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
