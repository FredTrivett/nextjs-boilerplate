import { auth } from "./auth"
import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

export default auth(async (req) => {
    const session = req.auth
    const isLoggedIn = !!session
    const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    if (isOnDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (isLoggedIn && session.user) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        try {
            const { error } = await supabase
                .from('users')
                .upsert({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    avatar_url: session.user.image,
                    updated_at: new Date().toISOString(),
                    is_deleted: false
                }, {
                    onConflict: 'id',
                    ignoreDuplicates: true
                })

            if (error) {
                console.error('Supabase error in middleware:', error)
            }
        } catch (error) {
            console.error('Error in middleware:', error)
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}