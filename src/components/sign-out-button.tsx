'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SignOutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push('/')
        router.refresh()
    }

    return (
        <Button
            onClick={handleSignOut}
            variant="primary"
            className="group"
        >
            <span className="relative">Sign Out</span>
        </Button>
    )
} 