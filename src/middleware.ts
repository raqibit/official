import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// Middleware — protects all /admin routes
// Unauthenticated visitors are redirected to /admin/login
// ─────────────────────────────────────────────────────────────────────────────

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  const isAuthed = !!req.auth?.user

  if (isAdminRoute && !isLoginPage && !isAuthed) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect already-authed users away from login page
  if (isLoginPage && isAuthed) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
