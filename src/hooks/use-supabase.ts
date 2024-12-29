'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

export function useSupabase() {
    const [supabase] = useState(() => createClient())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (error) throw error
                setLoading(false)
            } catch (error) {
                console.error('Error checking session:', error)
                setLoading(false)
            }
        }

        checkSession()
    }, [supabase])

    return { supabase, loading }
} 