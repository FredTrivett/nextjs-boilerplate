'use client'

import { motion } from "framer-motion"
import { useSupabase } from "@/hooks/use-supabase"
import { useEffect, useState } from "react"
import type { User } from "@/types/supabase"
import Link from 'next/link'
import { OnboardingModal } from "./onboarding-modal"
import { Button } from '@/components/ui/button'

interface DashboardClientProps {
    userName?: string | null
    userEmail?: string | null
    userId?: string
}

export function DashboardClient({ userName, userEmail, userId }: DashboardClientProps) {
    const { supabase } = useSupabase()
    const [userData, setUserData] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showOnboarding, setShowOnboarding] = useState(true)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return

            try {
                console.log('Fetching user data for:', userId)
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userId)
                    .eq('is_deleted', false)
                    .limit(1)
                    .maybeSingle()

                if (error) {
                    console.error('Supabase error:', error.message)
                    return
                }

                if (data) {
                    console.log('Fetched user data:', data)
                    console.log('Is onboarded:', data.is_onboarded)
                    setUserData(data)
                } else {
                    console.log('No user data found')
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [supabase, userId])

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            if (!userId) return

            const { data, error } = await supabase
                .from('users')
                .select('is_onboarded')
                .eq('id', userId)
                .single()

            if (!error && data) {
                setShowOnboarding(!data.is_onboarded)
            }
        }

        checkOnboardingStatus()
    }, [supabase, userId])

    if (isLoading) return null

    return (
        <>
            {showOnboarding && <OnboardingModal userId={userId!} />}

            <div className="flex justify-between items-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="vision-text text-4xl font-medium"
                >
                    Welcome, {userData?.name || userName}
                </motion.h1>
                <Link href="/dashboard/settings" passHref>
                    <Button variant="primary">
                        Settings
                    </Button>
                </Link>
            </div>
        </>
    )
} 