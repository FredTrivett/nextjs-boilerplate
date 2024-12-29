import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createClient } from '@supabase/supabase-js'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                )

                try {
                    // First check if user exists by email
                    const { data: existingUser } = await supabase
                        .from('users')
                        .select('*')
                        .eq('email', user.email)
                        .single()

                    if (existingUser) {
                        // If user exists, just update their details
                        const { error: updateError } = await supabase
                            .from('users')
                            .update({
                                name: user.name,
                                avatar_url: user.image,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', existingUser.id)

                        if (updateError) {
                            console.error('Error updating user:', updateError)
                            return false
                        }

                        // Set the user ID to match the existing record
                        user.id = existingUser.id
                    } else {
                        // If user doesn't exist, create new user
                        const { error: insertError } = await supabase
                            .from('users')
                            .insert({
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                avatar_url: user.image,
                                updated_at: new Date().toISOString()
                            })

                        if (insertError) {
                            console.error('Error creating user:', insertError)
                            return false
                        }
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