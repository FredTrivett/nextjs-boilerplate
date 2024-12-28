'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="relative flex flex-col items-center justify-center h-screen">
            <div className="fixed inset-0 bg-gradient-radial from-zinc-800/30 to-zinc-900/90" />

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="vision-text text-8xl font-medium mb-4">404</h1>
                    <p className="text-zinc-400 text-xl mb-8">
                        This reality doesn't exist... yet
                    </p>

                    <Link href="/" className="vision-button group inline-flex">
                        <span className="vision-glow" />
                        <span className="relative">Return Home</span>
                    </Link>
                </motion.div>
            </div>
        </main>
    )
} 