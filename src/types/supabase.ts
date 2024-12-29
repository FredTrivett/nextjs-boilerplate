export interface User {
    id: string
    email: string
    name: string | null
    avatar_url: string | null
    is_deleted: boolean
    deleted_at: string | null
    is_onboarded: boolean
    created_at: string
    updated_at: string
}

export type Database = {
    public: {
        Tables: {
            users: {
                Row: User
                Insert: Omit<User, 'created_at'>
                Update: Partial<Omit<User, 'id' | 'created_at'>>
            }
        }
    }
} 