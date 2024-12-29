'use client'

import { motion } from "framer-motion"
import { useSupabase } from "@/hooks/use-supabase"
import { useEffect, useState } from "react"
import type { User } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import SignOutButton from "@/components/sign-out-button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

interface SettingsClientProps {
    userName?: string | null
    userEmail?: string | null
    userId?: string
}

export function SettingsClient({ userName, userEmail, userId }: SettingsClientProps) {
    const { supabase } = useSupabase()
    const [userData, setUserData] = useState<User | null>(null)
    const [name, setName] = useState(userName || '')
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const expectedText = "delete my account"
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userEmail) return

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', userEmail)
                .single()

            if (!error && data) {
                setUserData(data)
                setName(data.name || '')
            }
        }

        fetchUserData()
    }, [supabase, userEmail])

    const handleUpdateName = async () => {
        if (!userId || !name.trim()) return

        setIsSaving(true)
        const { error } = await supabase
            .from('users')
            .update({ name: name.trim(), updated_at: new Date().toISOString() })
            .eq('id', userId)

        if (!error) {
            router.refresh()
            setIsEditing(false)
        }
        setIsSaving(false)
    }

    const handleDeleteAccount = async () => {
        if (confirmText !== expectedText || !userId) return

        setIsDeleting(true)
        try {
            const response = await fetch('/api/user/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()
            console.log('Delete response:', data)

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete account')
            }

            await signOut({ redirect: false })
            setShowDeleteDialog(false)
            router.push('/')
        } catch (error: any) {
            console.error('Error deleting account:', error)
            setIsDeleting(false)
            alert(error.message || 'Failed to delete account')
        }
    }

    return (
        <>
            <div className="flex items-center gap-10 mb-6">
                <Link href="/dashboard" passHref>
                    <Button
                        variant="secondary"
                        icon={<ArrowLeft className="h-4 w-4" />}
                    >
                        Back
                    </Button>
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="vision-text text-4xl font-medium"
                >
                    Settings
                </motion.h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-6">
                {/* Left Column - Profile Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="vision-panel p-8 sticky top-0">
                        <div className="space-y-6">
                            <div>
                                <h2 className="vision-text text-xl font-medium mb-2">Profile Overview</h2>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-blue-400">Standard</span>
                                        <span className="h-1 w-1 rounded-full bg-zinc-800" />
                                        <span className="text-xs text-zinc-500">Free Plan</span>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                    >
                                        Upgrade
                                    </Button>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                            {/* Personal Information */}
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-zinc-500">Email</p>
                                    <p
                                        className="text-zinc-300 break-all"
                                        style={{ wordBreak: 'break-word' }}
                                    >
                                        {userEmail}
                                    </p>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-zinc-500">Member Since</p>
                                    <p className="text-zinc-300">
                                        {userData?.created_at
                                            ? new Date(userData.created_at).toLocaleDateString()
                                            : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-zinc-500">Auth Method</p>
                                    <p className="text-zinc-300">Google OAuth</p>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                            <div className="text-center">
                                <a
                                    href="mailto:support@example.com"
                                    className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
                                >
                                    Need help? Contact support
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-12"
                >
                    <section>
                        <h2 className="vision-text text-xl font-medium mb-8">Profile Settings</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2 font-medium">
                                    Display Name
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing}
                                        className={cn(
                                            "flex-1 bg-black/20 border rounded-lg px-4 py-3 text-white transition-all",
                                            "focus:outline-none focus:ring-1 focus:ring-white/20",
                                            "placeholder-zinc-500",
                                            isEditing
                                                ? "border-zinc-700"
                                                : "border-transparent cursor-not-allowed"
                                        )}
                                        placeholder="Enter your display name"
                                    />
                                    <Button
                                        onClick={() => setIsEditing(!isEditing)}
                                        variant="primary"
                                    >
                                        {isEditing ? 'Cancel' : 'Change'}
                                    </Button>
                                </div>
                            </div>

                            {isEditing && (
                                <Button
                                    onClick={handleUpdateName}
                                    disabled={isSaving || name.trim() === userData?.name}
                                    variant="primary"
                                    className="w-full sm:w-auto"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            )}
                        </div>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                    <section>
                        <h2 className="vision-text text-xl font-medium mb-6">Account</h2>
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <SignOutButton />
                                <span className="hidden sm:block h-4 w-px bg-zinc-800" />
                                <p className="text-sm text-zinc-500">
                                    Signing out will redirect you to the home page
                                </p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                            <div>
                                <h3 className="text-red-500 text-sm font-medium mb-2">Danger Zone</h3>
                                <Button
                                    onClick={() => setShowDeleteDialog(true)}
                                    variant="danger"
                                >
                                    Delete Account
                                </Button>
                                <p className="mt-2 text-xs text-zinc-500">
                                    This action cannot be undone. Your account will be permanently deleted.
                                </p>

                                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                    <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="vision-text">
                                                Delete Account
                                            </AlertDialogTitle>
                                            <AlertDialogDescription asChild>
                                                <div className="text-zinc-400">
                                                    This action cannot be undone. Your account will be permanently deleted
                                                    and you will lose access to all your data.

                                                    <div className="mt-4 space-y-2">
                                                        <div className="text-sm">
                                                            Please type <span className="font-mono text-zinc-300 select-none">{expectedText}</span> to confirm:
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={confirmText}
                                                            onChange={(e) => setConfirmText(e.target.value)}
                                                            className="w-full bg-black/20 border-0 rounded-lg px-4 py-3 text-white 
                                                            focus:outline-none focus:ring-1 focus:ring-white/20 transition-all
                                                            placeholder-zinc-500"
                                                            placeholder="Type confirmation text"
                                                            spellCheck={false}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                </div>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <Button
                                                onClick={() => {
                                                    setConfirmText("")
                                                    setShowDeleteDialog(false)
                                                }}
                                                variant="secondary"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleDeleteAccount}
                                                disabled={confirmText.toLowerCase() !== expectedText || isDeleting}
                                                variant="danger"
                                            >
                                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </div>
        </>
    )
} 