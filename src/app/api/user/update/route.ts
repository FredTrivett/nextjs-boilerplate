import { createClient } from '@/lib/supabase/server'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { name } = await request.json()
        const supabase = await createClient()

        // Update the name directly
        const { error: updateError } = await supabase
            .from('users')
            .update({
                name: name.trim(),
                updated_at: new Date().toISOString()
            })
            .match({ id: session.user.id })  // Use match instead of eq

        if (updateError) {
            console.error('Update error:', updateError)
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        // Fetch the updated user data
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .match({ id: session.user.id })
            .single()

        if (fetchError) {
            console.error('Fetch error:', fetchError)
            return NextResponse.json({ error: fetchError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, user })
    } catch (error: any) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update user' },
            { status: 500 }
        )
    }
} 