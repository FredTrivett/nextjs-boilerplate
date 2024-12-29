import { auth } from "@/auth"
import { SettingsClient } from "@/components/settings-client"

export default async function SettingsPage() {
    const session = await auth()

    return (
        <SettingsClient
            userName={session?.user?.name}
            userEmail={session?.user?.email}
            userId={session?.user?.id}
        />
    )
} 