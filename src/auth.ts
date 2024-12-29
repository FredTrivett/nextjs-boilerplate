import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createClient } from "@/lib/supabase/server"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const supabase = await createClient()

                try {
                    // Upsert the user
                    const { error } = await supabase
                        .from('users')
                        .upsert({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            avatar_url: user.image,
                            updated_at: new Date().toISOString(),
                        }, {
                            onConflict: 'id',
                            ignoreDuplicates: false
                        })

                    if (error) {
                        console.error('Error upserting user:', error)
                        return false
                    }

                    return true
                } catch (error) {
                    console.error('Error in signIn callback:', error)
                    return false
                }
            }
            return true
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub as string
            }
            return session
        },
    }
})