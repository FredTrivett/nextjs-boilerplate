'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function AuthError() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const getErrorMessage = () => {
        switch (error) {
            case 'UseGoogleSignIn':
                return {
                    title: 'Use Google Sign In',
                    message: 'This email is associated with a Google account. Please sign in with Google instead.',
                    action: () => signIn('google', { callbackUrl: '/dashboard' })
                }
            case 'Verification':
                return {
                    title: 'Verification Failed',
                    message: 'The verification link has expired or is invalid. Please try signing in again to receive a new link.',
                    action: () => window.location.href = '/'
                }
            default:
                return {
                    title: 'Authentication Error',
                    message: 'An error occurred during authentication. Please try again.',
                    action: () => window.location.href = '/'
                }
        }
    }

    const { title, message, action } = getErrorMessage()

    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="mx-auto max-w-md space-y-6 p-6 bg-zinc-900/50 rounded-lg border border-white/10">
                <h1 className="text-2xl font-semibold text-white text-center">{title}</h1>
                <p className="text-zinc-400 text-center">{message}</p>
                <Button
                    onClick={action}
                    className="w-full"
                >
                    {error === 'UseGoogleSignIn' ? 'Continue with Google' : 'Try Again'}
                </Button>
            </div>
        </div>
    )
} 