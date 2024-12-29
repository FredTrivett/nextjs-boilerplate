'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { useRouter } from "next/navigation"

const steps = [
    {
        title: "Welcome to Vision Pro",
        description: "Let's get you started with a quick tour of the app.",
        image: "/onboarding-1.png"
    },
    {
        title: "Your Dashboard",
        description: "This is your personal space where you can manage everything.",
        image: "/onboarding-2.png"
    },
    {
        title: "Settings & Profile",
        description: "Customize your experience and manage your account preferences.",
        image: "/onboarding-3.png"
    }
]

interface OnboardingModalProps {
    userId: string
}

export function OnboardingModal({ userId }: OnboardingModalProps) {
    const [isOpen, setIsOpen] = useState(true)
    const [currentStep, setCurrentStep] = useState(0)
    const { supabase } = useSupabase()
    const router = useRouter()

    const handleComplete = async () => {
        try {
            if (!userId) return

            const { error } = await supabase
                .from('users')
                .update({
                    is_onboarded: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)

            if (error) {
                console.error('Error updating onboarding status:', error)
                return
            }

            setIsOpen(false)
            router.refresh()
        } catch (error) {
            console.error('Error in handleComplete:', error)
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => { }} // Prevent closing
        >
            <DialogContent
                className="fixed-size-dialog border border-white/10 bg-black/80 p-8 backdrop-blur-2xl"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="sr-only">
                        {steps[currentStep].title}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {steps[currentStep].description}
                    </DialogDescription>
                </DialogHeader>

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col h-full"
                >
                    <div className="text-center space-y-4 mb-8">
                        <h2 className="vision-text text-2xl font-medium">
                            {steps[currentStep].title}
                        </h2>
                        <p className="text-zinc-400">
                            {steps[currentStep].description}
                        </p>
                    </div>

                    <div className="flex-1 rounded-lg overflow-hidden bg-black/50 mb-8">
                        <img
                            src={steps[currentStep].image}
                            alt={steps[currentStep].title}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 w-1.5 rounded-full transition-colors ${index === currentStep ? 'bg-white' : 'bg-zinc-700'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex justify-between items-center">
                            {currentStep > 0 ? (
                                <Button
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                    variant="ghost"
                                >
                                    Previous
                                </Button>
                            ) : <div />}
                            <Button
                                onClick={() => {
                                    if (currentStep === steps.length - 1) {
                                        handleComplete()
                                    } else {
                                        setCurrentStep(prev => prev + 1)
                                    }
                                }}
                            >
                                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
} 