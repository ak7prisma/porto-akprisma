-- =============================================================
-- Portfolio CMS — Supabase schema
-- Jalankan di Supabase SQL Editor: Dashboard -> SQL Editor
-- Catatan: untuk produksi, NONAKTIFKAN "RLS" penulisan publik jika
-- hanya ingin admin yang bisa mengedit (policy di bawah sudah membatasi
-- tulis hanya untuk role `authenticated`).
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- Helper: updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================
-- TABLES
-- =============================================================

create table if not exists public.site_config (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,
  site_tagline text not null default '',
  email text not null,
  location text not null default '',
  cv_link text,
  footer_text text not null default '',
  contact_heading text not null default 'Let''s work together',
  contact_intro text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  status text not null default '',
  description text not null default '',
  initial text not null default '',
  initial_badge text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  headline text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_bios (
  id uuid primary key default gen_random_uuid(),
  about_id uuid not null references public.about(id) on delete cascade,
  content text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  year text not null default '',
  degree text not null,
  university text not null default '',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stacks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default '',
  color text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sub_label text not null default '',
  icon text not null default '',
  color text not null default '',
  background text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id serial primary key,
  title text not null,
  category text not null default '',
  description text not null default '',
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

create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  href text not null,
  icon text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enum status pesan (dibungkus DO block karena Postgres tidak mendukung CREATE TYPE IF NOT EXISTS)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'contact_message_status') then
    create type public.contact_message_status as enum ('new', 'read', 'replied', 'archived');
  end if;
end $$;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status public.contact_message_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- Migration utk database yang sudah terlanjur dibuat (dijalankan aman berkali-kali) ----------
alter table public.site_config add column if not exists contact_heading text not null default 'Let''s work together';
alter table public.site_config add column if not exists contact_intro text not null default '';

-- ---------- updated_at triggers (drop dulu agar aman dijalankan ulang) ----------
drop trigger if exists trg_site_config_updated_at on public.site_config;
create trigger trg_site_config_updated_at before update on public.site_config
  for each row execute function public.set_updated_at();
drop trigger if exists trg_hero_updated_at on public.hero;
create trigger trg_hero_updated_at before update on public.hero
  for each row execute function public.set_updated_at();
drop trigger if exists trg_about_updated_at on public.about;
create trigger trg_about_updated_at before update on public.about
  for each row execute function public.set_updated_at();
drop trigger if exists trg_education_updated_at on public.education;
create trigger trg_education_updated_at before update on public.education
  for each row execute function public.set_updated_at();
drop trigger if exists trg_stacks_updated_at on public.stacks;
create trigger trg_stacks_updated_at before update on public.stacks
  for each row execute function public.set_updated_at();
drop trigger if exists trg_stats_updated_at on public.stats;
create trigger trg_stats_updated_at before update on public.stats
  for each row execute function public.set_updated_at();
drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
drop trigger if exists trg_socials_updated_at on public.socials;
create trigger trg_socials_updated_at before update on public.socials
  for each row execute function public.set_updated_at();

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

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

-- --- Konten publik: siapa pun bisa baca, hanya user login (authenticated) yang tulis ---
do $$
declare
  t text;
  tables text[] := array['site_config','hero','about','about_bios','education','stacks','stats','projects','socials'];
begin
  foreach t in array tables loop
    execute format('drop policy if exists "public_read_%1$s" on public.%1$s;', t);
    execute format('drop policy if exists "auth_insert_%1$s" on public.%1$s;', t);
    execute format('drop policy if exists "auth_update_%1$s" on public.%1$s;', t);
    execute format('drop policy if exists "auth_delete_%1$s" on public.%1$s;', t);
    execute format('create policy "public_read_%1$s" on public.%1$s for select using (true);', t);
    execute format('create policy "auth_insert_%1$s" on public.%1$s for insert with check (auth.role() = ''authenticated'');', t);
    execute format('create policy "auth_update_%1$s" on public.%1$s for update using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'');', t);
    execute format('create policy "auth_delete_%1$s" on public.%1$s for delete using (auth.role() = ''authenticated'');', t);
  end loop;
end $$;

-- --- Contact messages: publik hanya boleh INSERT (form kontak), admin yang lihat/ubah ---
drop policy if exists "public_insert_contact_messages" on public.contact_messages;
drop policy if exists "auth_select_contact_messages" on public.contact_messages;
drop policy if exists "auth_update_contact_messages" on public.contact_messages;
drop policy if exists "auth_delete_contact_messages" on public.contact_messages;
create policy "public_insert_contact_messages" on public.contact_messages
  for insert with check (true);
create policy "auth_select_contact_messages" on public.contact_messages
  for select using (auth.role() = 'authenticated');
create policy "auth_update_contact_messages" on public.contact_messages
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_delete_contact_messages" on public.contact_messages
  for delete using (auth.role() = 'authenticated');

-- =============================================================
-- STORAGE — folder upload gambar project
-- =============================================================
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "public_read_portfolio_images" on storage.objects;
drop policy if exists "auth_upload_portfolio_images" on storage.objects;
drop policy if exists "auth_update_portfolio_images" on storage.objects;
drop policy if exists "auth_delete_portfolio_images" on storage.objects;
create policy "public_read_portfolio_images" on storage.objects
  for select using (bucket_id = 'portfolio-images');
create policy "auth_upload_portfolio_images" on storage.objects
  for insert with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');
create policy "auth_update_portfolio_images" on storage.objects
  for update using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');
create policy "auth_delete_portfolio_images" on storage.objects
  for delete using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

-- =============================================================
-- SEED (data awal — sesuaikan dengan kontenmu)
-- =============================================================

insert into public.site_config (site_name, site_tagline, email, location, cv_link, footer_text, contact_heading, contact_intro)
select
  'Ahmad Kurnia Prisma',
  'Front-End Developer',
  'ahmadkurniaprisma@gmail.com',
  'Palembang, Indonesia',
  'https://drive.google.com/file/d/1lxbcCcK6ekVMB_NpDLkihNDLCSNAkPGg/view?usp=sharing',
  'Menyelami kedalaman kode untuk menciptakan solusi digital yang fungsional dan estetik.',
  'Let''s work together',
  'Have a project in mind or just want to say hi? I''m currently open to new opportunities and collaborations.'
where not exists (select 1 from public.site_config);

insert into public.hero (name, role, status, description, initial, initial_badge)
select
  'Ahmad Kurnia Prisma',
  'Front-End Developer',
  'Available for Freelance',
  'Informatics student at Universitas Sriwijaya specializing in building best-performance web applications with Next.js, Supabase, and purposeful animations.',
  'P',
  'AK'
where not exists (select 1 from public.hero);

with inserted as (
  insert into public.about (headline)
  select 'Architecting digital experiences that matter'
  where not exists (select 1 from public.about)
  returning id
)
insert into public.about_bios (about_id, content, sort_order)
select
  id,
  content,
  sort_order
from inserted, (
  values
    ('Hello! I''m Ahmad Kurnia Prisma, an Informatics student at Universitas Sriwijaya with a deep passion for modern web development.', 0),
    ('Specializing in Next.js and Supabase, I focus on crafting bold, user-friendly designs enhanced by purposeful animations to drive engagement.', 1),
    ('Beyond writing code, I''ve demonstrated strong leadership and technical adaptability actively collaborating on the maintenance and technical stability of the SRIFOTON 2025 platform, while fully leading the curriculum design and logic development for the Java Programming Training 2025.', 2)
) as bios(content, sort_order);

insert into public.education (year, degree, university, description)
select
  '2024 - Present',
  'Informatics - Fasilkom',
  'Universitas Sriwijaya',
  'Focusing on Software Engineering and Web Technologies. Actively contributing as PJ Software Engineering for SRIFOTON 2025.'
where not exists (select 1 from public.education);

insert into public.stacks (title, description, icon, color, sort_order)
select v.title, v.description, v.icon, v.color, v.sort_order
from (values
  ('Frontend', 'Next.js, Tailwind CSS, Framer Motion', 'LayoutDashboard', 'cyan', 0),
  ('Backend', 'Supabase, PostgreSQL, MySQL', 'Cpu', 'teal', 1)
) as v(title, description, icon, color, sort_order)
where not exists (select 1 from public.stacks);

insert into public.stats (label, sub_label, icon, color, background, sort_order)
select v.label, v.sub_label, v.icon, v.color, v.background, v.sort_order
from (values
  ('Clean Code', 'Next.js & React Expert', 'Code2', 'text-blue-400', 'bg-blue-500/10', 0),
  ('Interactive UI', 'Framer Motion & Tailwind', 'Zap', 'text-cyan-400', 'bg-cyan-500/10', 1)
) as v(label, sub_label, icon, color, background, sort_order)
where not exists (select 1 from public.stats);

insert into public.projects (title, category, description, desktop_image, mobile_image, tech, demo_url, github_url, sort_order, is_published)
select v.title, v.category, v.description, v.desktop_image, v.mobile_image, v.tech, v.demo_url, v.github_url, v.sort_order, v.is_published
from (values
  ('StarShop', 'E-Commerce & Digital Products', 'A seamless digital top-up platform designed for gamers. Features digital product store and a highly responsive user interface optimized for mobile transactions.', '/Starshop.png', '/StarshopMobile.png', array['Next.js','Tailwind CSS','Supabase','Vercel'], 'https://starshop-jf2g.vercel.app', 'https://github.com/ak7prisma/starshop.git', 0, true),
  ('Srifoton Website', 'Event & Organization', 'The official event portal for HMIF Unsri''s annual IT competition (Team Project). Built collaboratively to facilitate participant registration, event scheduling, and information dissemination with dynamic animations.', '/Srifoton.png', '/SrifotonMobile.png', array['Next.js','Tailwind CSS','Supabase'], 'https://srifoton.hmifunsri.com', null, 1, true),
  ('My Drakor Checklist', 'Personal Utility App', 'A personalized tracking application for K-Drama enthusiasts. Allows users to manage K-Drama watchlists. Focused on simple and responsive UI.', '/DrakorCheckList.png', '/DrakorChecklistMobile.png', array['HTML','CSS','JavaScript','LocalStorage','Fun Project'], null, 'https://github.com/username/repo', 2, true)
) as v(title, category, description, desktop_image, mobile_image, tech, demo_url, github_url, sort_order, is_published)
where not exists (select 1 from public.projects);

insert into public.socials (name, href, icon, sort_order)
select v.name, v.href, v.icon, v.sort_order
from (values
  ('GitHub', 'https://github.com/ak7prisma', 'Github', 0),
  ('LinkedIn', 'https://www.linkedin.com/in/ahmad-kurnia-prisma-1b639a313', 'Linkedin', 1),
  ('Instagram', 'https://www.instagram.com/akprisma', 'Instagram', 2),
  ('WhatsApp', 'https://wa.me/628989209565', 'MessageCircle', 3)
) as v(name, href, icon, sort_order)
where not exists (select 1 from public.socials);