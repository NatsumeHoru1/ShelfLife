create table public.books (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
    title varchar(80) not null check (char_length(title) between 1 and 80),
    author varchar(60) not null check (char_length(author) between 1 and 60),
    pages integer not null check (pages between 1 and 5000),
    status text not null default 'reading' check (status in ('read', 'reading', 'finished')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.books enable row level security;

create policy "Users can view own books" on public.books for
select using (auth.uid() = user_id);

create policy "Users can insert own books" on public.books for
insert with check (auth.uid() = user_id);

create policy "Users can update own books" on public.books for
update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own books" on public.books for
delete using (auth.uid() = user_id);
