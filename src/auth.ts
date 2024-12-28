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

                // Check if user exists in Supabase
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', user.email)
                    .single()

                if (!existingUser) {
                    // Create new user in Supabase
                    const { error } = await supabase.from('users').insert({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatar_url: user.image,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })

                    if (error) {
                        console.error('Error creating user:', error)
                        return false
                    }
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