'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useState } from "react"

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isMagicLinkSent, setIsMagicLinkSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGoogleSignIn = () => {
        setIsLoading(true)
        signIn('google', { callbackUrl: '/dashboard' })
    }

    const handleMagicLinkSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        try {
            const result = await signIn('resend', {
                email,
                callbackUrl: '/dashboard',
                redirect: false,
            })
            
            console.log('Sign in result:', result)
            
            if (result?.error) {
                setError(result.error)
                setIsMagicLinkSent(false)
            } else {
                setIsMagicLinkSent(true)
            }
        } catch (error) {
            console.error('Error sending magic link:', error)
            setError('Failed to send magic link. Please try again.')
            setIsMagicLinkSent(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
            >
                Continue with Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-zinc-500">Or continue with</span>
                </div>
            </div>

            <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                    required
                />
                <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full"
                    variant="outline"
                >
                    {isLoading ? 'Sending...' : 'Send Magic Link'}
                </Button>
            </form>

            {error && (
                <p className="text-sm text-red-500 text-center">
                    {error}
                </p>
            )}

            {isMagicLinkSent && (
                <p className="text-sm text-zinc-400 text-center">
                    Check your email for the magic link!
                </p>
            )}
        </div>
    )
} 