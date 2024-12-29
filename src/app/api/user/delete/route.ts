import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST() {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const supabaseAdmin = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Generate a unique identifier for the deleted email
        const timestamp = Date.now()
        const uniqueId = Math.random().toString(36).substring(2, 15)
        const deletedEmail = `deleted_${timestamp}_${uniqueId}_${session.user.email}`

        // Update the user record to mark as deleted
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                is_deleted: true,
                deleted_at: new Date().toISOString(),
                email: deletedEmail,
                name: 'Deleted User',
                avatar_url: null
            })
            .eq('id', session.user.id)

        if (updateError) {
            console.error('Error updating user record:', updateError)
            return NextResponse.json(
                { error: 'Failed to update user record' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error in delete route:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to delete account' },
            { status: 500 }
        )
    }
} 