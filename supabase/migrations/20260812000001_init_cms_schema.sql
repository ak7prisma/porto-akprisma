-- =============================================
-- Portfolio CMS Schema
-- Public read, admin write (authenticated)
-- =============================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Helper: updated_at trigger ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------- site_config ----------
create table if not exists public.site_config (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Ahmad Kurnia Prisma',
  site_tagline text not null default '',
  email text not null default '',
  location text not null default '',
  cv_link text,
  footer_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger site_config_updated_at
  before update on public.site_config
  for each row execute function set_updated_at();

-- ---------- hero ----------
create table if not exists public.hero (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  status text not null,
  description text not null,
  initial text not null,
  initial_badge text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger hero_updated_at
  before update on public.hero
  for each row execute function set_updated_at();

-- ---------- about ----------
create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger about_updated_at
  before update on public.about
  for each row execute function set_updated_at();

-- ---------- about_bios ----------
create table if not exists public.about_bios (
  id uuid primary key default gen_random_uuid(),
  about_id uuid not null references public.about(id) on delete cascade,
  content text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- education ----------
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  degree text not null,
  university text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger education_updated_at
  before update on public.education
  for each row execute function set_updated_at();

-- ---------- stacks ----------
create table if not exists public.stacks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null default 'Code2',
  color text not null default 'cyan',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger stacks_updated_at
  before update on public.stacks
  for each row execute function set_updated_at();

-- ---------- stats ----------
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sub_label text not null,
  icon text not null default 'Code2',
  color text not null default 'text-blue-400',
  background text not null default 'bg-blue-500/10',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger stats_updated_at
  before update on public.stats
  for each row execute function set_updated_at();

-- ---------- projects ----------
create table if not exists public.projects (
  id serial primary key,
  title text not null,
  category text not null,
  description text not null,
  desktop_image text,
  mobile_image text,
  tech text[] not null default '{}',
  demo_url text,
  github_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function set_updated_at();

-- ---------- socials ----------
create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  href text not null,
  icon text not null default 'Github',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger socials_updated_at
  before update on public.socials
  for each row execute function set_updated_at();

-- ---------- contact_messages ----------
create type public.contact_message_status as enum ('new', 'read', 'replied', 'archived');

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status public.contact_message_status not null default 'new',
  created_at timestamptz not null default now()
);

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- =============================================
-- RLS Policies
-- Public: SELECT (read)
-- Authenticated (admin): full write
-- =============================================

alter table public.site_config enable row level security;
alter table public.hero enable row level security;
alter table public.about enable row level security;
alter table public.about_bios enable row level security;
alter table public.education enable row level security;
alter table public.stacks enable row level security;
alter table public.stats enable row level security;
alter table public.projects enable row level security;
alter table public.socials enable row level security;
alter table public.contact_messages enable row level security;

-- Public read
create policy "Public can read site_config" on public.site_config for select using (true);
create policy "Public can read hero" on public.hero for select using (true);
create policy "Public can read about" on public.about for select using (true);
create policy "Public can read about_bios" on public.about_bios for select using (true);
create policy "Public can read education" on public.education for select using (true);
create policy "Public can read stacks" on public.stacks for select using (true);
create policy "Public can read stats" on public.stats for select using (true);
create policy "Public can read projects" on public.projects for select using (true);
create policy "Public can read socials" on public.socials for select using (true);

-- Public can insert contact messages, but cannot read/modify them
create policy "Public can send contact messages" on public.contact_messages for insert with check (true);

-- Admin write (authenticated)
create policy "Admin can write site_config" on public.site_config for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can write hero" on public.hero for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can write about" on public.about for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can write about_bios" on public.about_bios for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can write education" on public.education for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can write stacks" on public.stacks for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can write stats" on public.stats for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can write projects" on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can write socials" on public.socials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can write contact_messages" on public.contact_messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =============================================
-- Storage bucket for images
-- =============================================
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

create policy "Public can read portfolio-images" on storage.objects
  for select using (bucket_id = 'portfolio-images');

create policy "Admin can upload portfolio-images" on storage.objects
  for insert with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "Admin can update portfolio-images" on storage.objects
  for update using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "Admin can delete portfolio-images" on storage.objects
  for delete using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');
