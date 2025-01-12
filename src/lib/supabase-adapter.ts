import { createClient } from '@supabase/supabase-js'
import type { Adapter } from '@auth/core/adapters'

export function CustomAdapter(): Adapter {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    return {
        async createUser(data) {
            try {
                const { data: user, error } = await supabase
                    .from('users')
                    .insert({
                        id: data.id || crypto.randomUUID(),
                        email: data.email,
                        name: data.name || data.email?.split('@')[0],
                        avatar_url: data.image,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        is_deleted: false,
                        is_onboarded: false
                    })
                    .select()
                    .single()

                if (error) {
                    console.error('Error creating user:', error)
                    throw error
                }

                return {
                    id: user.id,
                    email: user.email,
                    emailVerified: null,
                    name: user.name,
                    image: user.avatar_url
                }
            } catch (error) {
                console.error('Error in createUser:', error)
                throw error
            }
        },

        async getUser(id) {
            try {
                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', id)
                    .eq('is_deleted', false)
                    .single()

                if (error || !user) return null

                return {
                    id: user.id,
                    email: user.email,
                    emailVerified: null,
                    name: user.name,
                    image: user.avatar_url
                }
            } catch (error) {
                console.error('Error in getUser:', error)
                return null
            }
        },

        async getUserByEmail(email) {
            try {
                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .eq('is_deleted', false)
                    .single()

                if (error || !user) return null

                return {
                    id: user.id,
                    email: user.email,
                    emailVerified: null,
                    name: user.name,
                    image: user.avatar_url
                }
            } catch (error) {
                console.error('Error in getUserByEmail:', error)
                return null
            }
        },

        async getUserByAccount({ providerAccountId, provider }) {
            const { data: account, error: accountError } = await supabase
                .from('accounts')
                .select('user_id')
                .eq('provider_account_id', providerAccountId)
                .eq('provider', provider)
                .single()

            if (accountError || !account) return null

            const { data: user, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', account.user_id)
                .eq('is_deleted', false)
                .single()

            if (userError || !user) return null
            return {
                id: user.id,
                email: user.email,
                emailVerified: null,
                name: user.name,
                image: user.avatar_url
            }
        },

        async updateUser(data) {
            const { data: user, error } = await supabase
                .from('users')
                .update({
                    name: data.name,
                    email: data.email,
                    avatar_url: data.image,
                    updated_at: new Date().toISOString()
                })
                .eq('id', data.id)
                .select()
                .single()

            if (error) throw error
            return {
                id: user.id,
                email: user.email,
                emailVerified: null,
                name: user.name,
                image: user.avatar_url
            }
        },

        async linkAccount(data) {
            if (data.provider !== 'resend') {
                const { error } = await supabase.from('accounts').insert({
                    user_id: data.userId,
                    type: data.type,
                    provider: data.provider,
                    provider_account_id: data.providerAccountId,
                    refresh_token: data.refresh_token,
                    access_token: data.access_token,
                    expires_at: data.expires_at,
                    token_type: data.token_type,
                    scope: data.scope,
                    id_token: data.id_token,
                    session_state: data.session_state
                })

                if (error) throw error
            }
            return data
        },

        async createSession(data) {
            const { data: session, error } = await supabase
                .from('sessions')
                .insert({
                    user_id: data.userId,
                    expires: data.expires,
                    session_token: data.sessionToken
                })
                .select()
                .single()

            if (error) throw error
            return session
        },

        async getSessionAndUser(sessionToken) {
            const { data: session, error: sessionError } = await supabase
                .from('sessions')
                .select('*, users!inner(*)')
                .eq('session_token', sessionToken)
                .single()

            if (sessionError || !session) return null

            const { users: user, ...sessionData } = session

            return {
                session: sessionData,
                user: {
                    id: user.id,
                    email: user.email,
                    emailVerified: null,
                    name: user.name,
                    image: user.avatar_url
                }
            }
        },

        async updateSession(data) {
            const { data: session, error } = await supabase
                .from('sessions')
                .update({ expires: data.expires })
                .eq('session_token', data.sessionToken)
                .select()
                .single()

            if (error) throw error
            return session
        },

        async deleteSession(sessionToken) {
            const { error } = await supabase
                .from('sessions')
                .delete()
                .eq('session_token', sessionToken)

            if (error) throw error
        },

        async createVerificationToken(data) {
            try {
                // Delete any existing tokens for this identifier
                await supabase
                    .from('verification_tokens')
                    .delete()
                    .eq('identifier', data.identifier)

                // Create new token
                const { error } = await supabase
                    .from('verification_tokens')
                    .insert({
                        identifier: data.identifier,
                        token: data.token,
                        expires: data.expires
                    })

                if (error) {
                    console.error('Error creating verification token:', error)
                    throw error
                }

                return data
            } catch (error) {
                console.error('Error in createVerificationToken:', error)
                throw error
            }
        },

        async useVerificationToken({ identifier, token }) {
            try {
                // First, check if the token exists and hasn't expired
                const { data: tokens, error: fetchError } = await supabase
                    .from('verification_tokens')
                    .select()
                    .eq('identifier', identifier)
                    .eq('token', token)
                    .gte('expires', new Date().toISOString())
                    .limit(1)

                if (fetchError) {
                    console.error('Error fetching verification token:', fetchError)
                    return null
                }

                if (!tokens || tokens.length === 0) {
                    console.error('Token not found or expired')
                    return null
                }

                const verificationToken = tokens[0]

                // Delete the token
                await supabase
                    .from('verification_tokens')
                    .delete()
                    .eq('identifier', identifier)
                    .eq('token', token)

                return {
                    identifier: verificationToken.identifier,
                    token: verificationToken.token,
                    expires: verificationToken.expires
                }
            } catch (error) {
                console.error('Error in useVerificationToken:', error)
                return null
            }
        }
    }
} 