import { auth } from "@/auth"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
    const session = await auth()

    return (
        <DashboardClient
            userName={session?.user?.name}
            userEmail={session?.user?.email}
        />
    )
} 