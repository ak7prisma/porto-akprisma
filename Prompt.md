Plan tersusun. Berikut roadmap-nya berdasarkan jawaban kamu (root-level structure, Full CMS, semua section editable, design menunggu design.md kamu).
Konteks: Masalah yang Harus Dibersihkan Dulu
1. next.config.ts rusak — isinya config Tailwind (import Config dari tailwindcss, path ./src/** yang tidak ada). Build Next.js kemungkinan besar gagal saat ini. Ini prioritas #1.
2. tailwind.config.ts dead-weight (Tailwind v4 CSS-first) → hapus.
3. Theme.tsx (next-themes) ada tapi tidak dipasang di layout.tsx.
4. Data files berisi JSX (data/about.tsx, data/contact.tsx) → tidak portable ke CMS.
5. Kelas Tailwind dinamis bg-${color}-600/20 di AboutRight.tsx:31-32 rusak di JIT.
6. Import campur (../../ vs @/), ada any di ActionProject.tsx, types/global.d.ts kosong.
Roadmap (Urutan Eksekusi)
Fase 0 — Stabilisasi Build (dulu, karena sekarang kemungkinan broken)
- Rewrite next.config.ts jadi config Next yang benar; hapus tailwind.config.ts
- Standarisasi import ke @/, hapus global.d.ts kosong, perbaiki AboutRight.tsx, rapikan ActionProject.tsx
- Baseline hijau: npm run lint + npm run build
Fase 1 — Foundation Arsitektur (reusable, modular, clean)
- Init shadcn/ui (Tailwind v4), install: zustand, react-hook-form, @hookform/resolvers, zod, sonner, @supabase/supabase-js, @supabase/ssr
- Setup design tokens di globals.css (@theme) — placeholder dulu, nanti tinggal swap saat design.md masuk
- Buat types/ content models (SiteConfig, Hero, About, Education, Stack, Project, Social, ContactMessage)
- Buat lib/validations (schema zod), lib/supabase/*, store zustand untuk UI state
- Wire ThemeProvider di layout (persiapan dark/light toggle)
Fase 2 — Supabase Setup (Full CMS)
- .env.local + .env.example (Supabase URL, anon, service-role)
- SQL migration: tabel hero, about, education, stacks, stats, projects, socials, site_config, contact_messages + RLS (public-read, admin-write) + storage bucket untuk image
- Seed data dari konten statis yang ada sekarang
- Middleware auth session refresh
Fase 3 — Public Site Data Layer
- Buang JSX dari data/ → ganti typed models + fetcher server component (cache + revalidate)
- Refactor semua section consume CMS data
- Contact form: RHF + zod → insert contact_messages (ganti Formspree & useEmailForm)
Fase 4 — UI/UX Redesign (BLOCKED: menunggu design.md kamu)
- Terapkan design tokens + redesign: Navbar, Hero, About, Projects, Contact, Footer
- Sementara design.md belum ada, fase 0–3 & 5 bisa jalan duluan tanpa terganggu
Fase 5 — Admin Dashboard
- /admin/login (Supabase Auth email + OAuth), protect /admin via middleware
- Layout admin + sidebar; CRUD: Projects, Hero, About, Socials, Site Config; read-only: Contact Messages
- Komponen form reusable (RHF + zod + shadcn), upload image ke Storage
- revalidatePath agar konten publik langsung update
Fase 6 — Dokumentasi
- Rewrite README (stack akurat, setup + env, skema DB, cara pakai admin)
- Buat AGENTS.md (command, konvensi, arsitektur) — untuk konteks AI agent berikutnya
Alasan urutan ini: build harus hijau dulu (Fase 0), lalu infrastruktur (1–2), baru migrasi data publik (3) — karena 0–3 bisa dikerjakan tanpa design.md. Admin (5) independen dari desain, jadi bisa ngejar duluan. Redesign (4) sengaja ditaruh belakang menunggu referensi desain kamu.
Yang perlu kamu siapkan: akun Supabase project baru, dan design.md-nya. Mau saya mulai eksekusi Fase 0 dulu sekarang?