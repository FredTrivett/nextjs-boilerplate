import { createClient } from '@supabase/supabase-js'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function POST() {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Create a Supabase client with the service role key
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        console.log('Updating onboarding status for user:', session.user.id)

        const { data, error } = await supabase
            .from('users')
            .update({
                is_onboarded: true,
                updated_at: new Date().toISOString()
            })
            .eq('id', session.user.id)
            .select()
            .single()

        if (error) {
            console.error('Update error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log('Successfully updated onboarding status:', data)
        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update onboarding status' },
            { status: 500 }
        )
    }
} 