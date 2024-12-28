'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { type SupabaseClient } from '@supabase/supabase-js'

export const useSupabase = () => {
    const [supabase] = useState(() => createClient())

    return { supabase }
} 