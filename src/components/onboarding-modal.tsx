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
    const [isCompleting, setIsCompleting] = useState(false)
    const { supabase } = useSupabase()
    const router = useRouter()

    const handleComplete = async () => {
        setIsCompleting(true)
        try {
            const response = await fetch('/api/user/onboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            if (!response.ok) {
                console.error('Failed to complete onboarding:', data)
                throw new Error(data.error || 'Failed to complete onboarding')
            }

            setIsOpen(false)  // Close the modal after successful update
            router.refresh()
        } catch (error) {
            console.error('Error completing onboarding:', error)
            alert('Failed to complete onboarding. Please try again.')
        } finally {
            setIsCompleting(false)
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

                        <div className="mt-6 flex w-full">
                            {currentStep > 0 ? (
                                <div className="flex justify-between w-full gap-4">
                                    <Button
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        variant="secondary"
                                        className="focus:outline-none focus:ring-0"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (currentStep === steps.length - 1) {
                                                handleComplete()
                                            } else {
                                                setCurrentStep(prev => prev + 1)
                                            }
                                        }}
                                        disabled={isCompleting}
                                        className="focus:outline-none focus:ring-0"
                                    >
                                        {isCompleting
                                            ? 'Completing...'
                                            : currentStep === steps.length - 1
                                                ? 'Get Started'
                                                : 'Next'
                                        }
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex justify-end w-full">
                                    <Button
                                        onClick={() => setCurrentStep(prev => prev + 1)}
                                        className="focus:outline-none focus:ring-0"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
} 