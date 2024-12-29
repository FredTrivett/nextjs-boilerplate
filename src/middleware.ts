import { auth } from "./auth"
import { NextResponse } from "next/server"
import { createClient } from '@/lib/supabase/server'

export default auth(async (req) => {
    const session = req.auth
    const isLoggedIn = !!session
    const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    if (isOnDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (isLoggedIn && session.user) {
        const supabase = await createClient()

        try {
            // Upsert the user record
            const { error } = await supabase
                .from('users')
                .upsert({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    avatar_url: session.user.image,
                    updated_at: new Date().toISOString(),
                    is_onboarded: false,  // Only set this if it's a new record
                    is_deleted: false
                }, {
                    onConflict: 'id',  // Changed from 'email' to 'id'
                    ignoreDuplicates: false
                })

            if (error) throw error
        } catch (error) {
            console.error('Error in middleware:', error)
        }
    }

    return NextResponse.next()
})

// Optionally configure middleware to only run on specific paths
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}