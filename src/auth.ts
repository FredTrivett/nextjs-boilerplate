import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { CustomAdapter } from "./lib/supabase-adapter"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: CustomAdapter(),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Resend({
            apiKey: process.env.AUTH_RESEND_KEY,
            from: "Vision App <onboarding@growvy.app>",
            server: process.env.NEXTAUTH_URL,
        })
    ],
    debug: true,
    pages: {
        signIn: '/',
        error: '/auth/error',
        verifyRequest: '/',
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async signIn({ user, account, profile, email }) {
            try {
                // If this is an email verification
                if (email?.verificationRequest) {
                    return true
                }

                // For both Google and email sign-ins, check if the user is deleted
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', user.email)
                    .single()

                if (existingUser?.is_deleted) {
                    return false // Prevent sign in for deleted accounts
                }

                // If signing in with Google
                if (account?.provider === "google" && existingUser) {
                    // Check if user already has a Google account linked
                    const { data: googleAccount } = await supabase
                        .from('accounts')
                        .select('*')
                        .eq('user_id', existingUser.id)
                        .eq('provider', 'google')
                        .single()

                    if (!googleAccount) {
                        // Link the Google account to the existing user
                        await supabase.from('accounts').insert({
                            user_id: existingUser.id,
                            type: account.type,
                            provider: account.provider,
                            provider_account_id: account.providerAccountId,
                            refresh_token: account.refresh_token,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                            session_state: account.session_state
                        })
                    }
                    return true
                }

                // If signing in with email
                if (account?.provider === "resend" && existingUser) {
                    // Allow sign in with email even if they have a Google account
                    // This enables users to use both authentication methods
                    return true
                }

                return true
            } catch (error) {
                console.error('Error in signIn callback:', error)
                return false
            }
        },
        async session({ session, token }) {
            if (session?.user) {
                try {
                    // Get user data from Supabase
                    const { data: user } = await supabase
                        .from('users')
                        .select('*')
                        .eq('email', session.user.email)
                        .single()

                    if (user) {
                        session.user.id = user.id
                        session.user.is_onboarded = user.is_onboarded

                        // Use the provider from the token, which reflects the current sign-in method
                        session.user.provider = token.provider === 'resend' ? 'email' : token.provider
                    }
                } catch (error) {
                    console.error('Error in session callback:', error)
                }
            }
            return session
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                // Store the actual provider used for this session
                token.provider = account?.provider || 'email'
            }
            return token
        }
    }
})