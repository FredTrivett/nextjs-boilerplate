import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    if (isOnDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    return NextResponse.next()
})

// Optionally configure middleware to only run on specific paths
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}