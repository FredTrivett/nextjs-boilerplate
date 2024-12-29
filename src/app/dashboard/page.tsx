import { auth } from "@/auth"
import { DashboardClient } from "@/components/dashboard-client"
import { redirect } from "next/navigation"

export default async function Dashboard() {
    const session = await auth()
    if (!session) {
        redirect('/')
    }

    return (
        <DashboardClient
            userName={session.user?.name}
            userEmail={session.user?.email}
            userId={session.user?.id}
        />
    )
} 