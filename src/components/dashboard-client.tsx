'use client'

import { motion } from "framer-motion"
import SignOutButton from "./sign-out-button"
import { useSupabase } from "@/hooks/use-supabase"
import { useEffect, useState } from "react"
import type { User } from "@/types/supabase"

interface DashboardClientProps {
    userName?: string | null
    userEmail?: string | null
}

export function DashboardClient({ userName, userEmail }: DashboardClientProps) {
    const { supabase } = useSupabase()
    const [userData, setUserData] = useState<User | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', userEmail)
                .single()

            if (!error && data) {
                setUserData(data)
            }
        }

        if (userEmail) {
            fetchUserData()
        }
    }, [supabase, userEmail])

    return (
        <main className="relative min-h-screen">
            <div className="fixed inset-0 bg-gradient-radial from-zinc-800/30 to-zinc-900/90" />

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-32">
                <div className="flex justify-between items-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="vision-text text-4xl font-medium"
                    >
                        Dashboard
                    </motion.h1>
                    <SignOutButton />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="vision-panel p-6">
                        <h2 className="vision-text text-xl font-medium mb-2">
                            Welcome, {userData?.name || userName}!
                        </h2>
                        <p className="text-zinc-400">{userData?.email || userEmail}</p>
                        <p className="text-zinc-500 text-sm mt-2">
                            Member since {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    )
} 