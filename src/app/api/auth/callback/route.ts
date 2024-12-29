import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const cookieStore = cookies()
        const supabase = await createClient()

        // Exchange the code for a session
        await supabase.auth.exchangeCodeForSession(code)

        // Get the user from the newly created session
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Check if user exists in our users table
            const { data: existingUser } = await supabase
                .from('users')
                .select('id, is_onboarded')
                .eq('id', user.id)
                .single()

            if (!existingUser) {
                // Create new user record with is_onboarded set to false
                await supabase
                    .from('users')
                    .insert({
                        id: user.id,
                        email: user.email,
                        name: user.user_metadata?.name || null,
                        avatar_url: user.user_metadata?.avatar_url || null,
                        is_deleted: false,
                        deleted_at: null,
                        is_onboarded: false,
                        updated_at: new Date().toISOString(),
                    })
            }
        }
    }

    return NextResponse.redirect(requestUrl.origin)
} 