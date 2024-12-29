'use client'

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"

export function LoginForm() {
    const [showDialog, setShowDialog] = useState(false)

    return (
        <>
            <Button
                onClick={() => setShowDialog(true)}
                variant="primary"
                className="vision-button group"
            >
                <span className="vision-glow" />
                <span className="relative">Sign In</span>
            </Button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <div className="flex flex-col items-center space-y-8">
                        <h2 className="vision-text text-2xl font-medium">Welcome Back</h2>
                        <p className="text-zinc-400 text-center">
                            Sign in with your Google account to continue
                        </p>

                        <Button
                            onClick={() => signIn('google')}
                            className="relative w-full"
                            variant="ghost"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-zinc-900/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                            <span className="relative flex items-center justify-center gap-3">
                                <svg
                                    className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 