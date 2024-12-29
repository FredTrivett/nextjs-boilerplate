'use client'

import { motion } from 'framer-motion'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { AuthModal } from '@/components/auth-modal'
import { Button } from '@/components/ui/button'

export default function HomeClient({ session }: { session: Session | null }) {
    const router = useRouter()

    const renderAuthButton = (authMode: 'signin' | 'signup') => (
        authMode === 'signin' ? (
            <Button
                variant="secondary"
                size="default"
            >
                Sign In →
            </Button>
        ) : (
            <Button variant="primary">
                Get Started
            </Button>
        )
    )

    return (
        <main className="relative min-h-screen">
            <div className="fixed inset-0 bg-gradient-radial from-zinc-800/30 to-zinc-900/90" />

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="vision-text text-6xl font-medium tracking-tight sm:text-7xl"
                >
                    Revolutionary
                    <span className="block">Experience</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-6 text-lg text-zinc-300"
                >
                    Enter a new dimension of possibilities
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="mt-10 flex items-center justify-center gap-6"
                >
                    {session ? (
                        <Button
                            onClick={() => router.push('/dashboard')}
                            variant="primary"
                        >
                            Enter Dashboard
                        </Button>
                    ) : (
                        <>
                            <AuthModal variant="signup" trigger={renderAuthButton('signup')} />
                            <AuthModal variant="signin" trigger={renderAuthButton('signin')} />
                        </>
                    )}
                </motion.div>
            </div>
        </main>
    )
} 