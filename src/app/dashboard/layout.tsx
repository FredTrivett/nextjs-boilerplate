import { ReactNode } from "react"

interface DashboardLayoutProps {
    children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <main className="relative min-h-screen">
            <div className="fixed inset-0 bg-gradient-radial from-zinc-800/30 to-zinc-900/90" />
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
                {children}
            </div>
        </main>
    )
} 