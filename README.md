# Vision - Next.js Authentication Template

A modern authentication template built with Next.js 15, featuring a sleek Apple Vision Pro-inspired design and Supabase authentication.

## Features

- 🎨 Apple Vision Pro-inspired UI/UX
- 🔐 Google OAuth + Supabase Authentication
- 🚀 Next.js 15 App Router
- 💻 TypeScript
- 🎭 Framer Motion Animations
- 🎯 Shadcn/ui Components
- 🌙 Dark Mode Optimized
- 📱 Responsive Design

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd vision
pnpm install  # Make sure you have pnpm installed
```

### 2. Supabase Setup

1. Create a new Supabase project
1. Run this SQL in your Supabase SQL editor:

```sql
-- Create users table
create table users (
    id uuid references auth.users on delete cascade not null primary key,
    email text unique not null,
    name text,
    avatar_url text,
    is_deleted boolean default false,
    deleted_at timestamp with time zone,
    is_onboarded boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table users enable row level security;

-- Create policies
create policy "Users can view their own data" on users
    for select using (auth.uid() = id);

create policy "Users can update their own data" on users
    for update using (auth.uid() = id);
```

1. Set up Google OAuth in your Supabase project:
   - Go to Authentication > Providers > Google
   - Enable Google auth
   - Add your Google OAuth credentials

### 3. Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```typescript
src/
├── app/                  # Next.js 15 App Router
├── components/           # React Components
│   ├── ui/              # Shadcn UI Components
│   ├── auth-modal.tsx   # Authentication Modal
│   └── ...
├── lib/                 # Utility Functions
│   └── supabase/       # Supabase Client Configuration
└── types/              # TypeScript Types
```

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.motion.dev)
- [Shadcn/ui](https://ui.shadcn.com/)

## License

Ask me at [fred@growvy.app](mailto:fred@growvy.app)

## Author

Frederic Trivett
