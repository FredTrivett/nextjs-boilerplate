'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"
import { motion } from "framer-motion"
import { useState } from 'react'

interface AuthModalProps {
    trigger: React.ReactNode
    variant?: 'signin' | 'signup'
}

export function AuthModal({ trigger, variant = 'signup' }: AuthModalProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="bg-black border border-zinc-800 shadow-2xl">
                <div className="flex flex-col items-center space-y-8">
                    <DialogHeader>
                        <DialogTitle className="vision-text text-3xl font-medium text-center">
                            {variant === 'signin' ? 'Welcome Back' : 'Welcome to Vision'}
                        </DialogTitle>
                        <p className="text-center text-zinc-400 mt-2">
                            {variant === 'signin'
                                ? 'Sign in to continue to your account'
                                : 'Create your account to get started'
                            }
                        </p>
                    </DialogHeader>

                    <div className="w-full max-w-sm mt-8">
                        <LoginForm />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 