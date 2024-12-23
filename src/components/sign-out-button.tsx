'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

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
            variant="outline"
            className="vision-button group"
        >
            <span className="vision-glow" />
            <span className="relative">Sign Out</span>
        </Button>
    )
} 