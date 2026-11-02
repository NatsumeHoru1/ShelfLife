# ShelfLife - Personal Book Shelf Tracker

ShelfLife is a modern personal book tracking application built with Next.js 15 (App Router), Tailwind CSS, and Supabase (PostgreSQL with Row Level Security).

## Features
- **Book Lifecycle Management:** Track books across `read` (Want to read), `reading`, and `finished` statuses.
- **Dynamic Stats & Summary:** Real-time metrics for total books, total pages, and status breakdown dynamically updating based on search and filters.
- **Search & Filtering:** Search by title or author, filter by reading status, and 1-click reset.
- **Authentication & Security:** Secure email signup and login powered by Supabase Auth with Row Level Security (RLS) ensuring strict user data isolation.
- **Responsive Design:** Optimized for mobile (375px) up to desktop (1280px+).

## Tech Stack
- Framework: Next.js 15
- Styling: Tailwind CSS & Lucide Icons
- Database & Auth: Supabase (PostgreSQL)

## Getting Started

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
