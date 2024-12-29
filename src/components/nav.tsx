'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { AuthModal } from '@/components/auth-modal'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function Nav() {
    const { data: session } = useSession()
    const router = useRouter()

    const renderAuthButton = (authMode: 'signin' | 'signup') => (
        authMode === 'signin' ? (
            <Button
                variant="secondary"
                size="default"
            >
                Sign In
            </Button>
        ) : (
            <Button variant="primary">
                Get Started
            </Button>
        )
    )

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        >
            <Link href="/" className="vision-text text-xl font-medium">
                Vision
            </Link>

            <nav className="flex items-center gap-6">

                {session ? (
                    <Button
                        onClick={() => router.push('/dashboard')}
                        variant="primary"
                    >
                        Dashboard
                    </Button>
                ) : (
                    <div className="flex items-center gap-4">
                        <AuthModal
                            variant="signin"
                            trigger={renderAuthButton('signin')}
                        />
                        <AuthModal
                            variant="signup"
                            trigger={renderAuthButton('signup')}
                        />
                    </div>
                )}
            </nav>
        </motion.header>
    )
} 