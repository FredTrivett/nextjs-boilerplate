import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST() {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Create a Supabase admin client
        const supabaseAdmin = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // First update the user record
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                is_deleted: true,
                deleted_at: new Date().toISOString(),
                email: `deleted_${Date.now()}_${session.user.email}`,
                name: 'Deleted User'
            })
            .eq('id', session.user.id)

        if (updateError) {
            console.error('Error updating user record:', updateError)
            return NextResponse.json(
                { error: 'Failed to update user record' },
                { status: 500 }
            )
        }

        // Delete the auth user using the REST API
        const deleteResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${session.user.id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
                }
            }
        )

        if (!deleteResponse.ok) {
            const errorData = await deleteResponse.json().catch(() => ({}))
            console.error('Delete user response:', deleteResponse.status, errorData)
            throw new Error('Failed to delete auth user')
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