# AGENTS.md — Aturan Kerja untuk Agent di Repo Ini

File ini berisi konvensi kode, arsitektur, dan SOP untuk AI agent yang bekerja di
repo `fe-portofolio-ahmadkurniaprisma`. Baca sebelum mengubah apa pun.

## Stack & Status

- **Framework:** Next.js 16 (App Router, route groups), React 19, TypeScript (~6.0)
- **Styling:** Tailwind CSS v4, `tw-animate-css`, design "Ashen Aurora" (terang/gelap, `next-themes` + zustand di `store/theme.ts`)
- **CMS:** Supabase (Auth + Postgres + Storage) — `@supabase/ssr`, `@supabase/supabase-js`
- **Animasi:** framer-motion 13
- **Ikon:** lucide-react + react-icons
- **Komponen UI:** Base UI React (shadcn-style wrappers) di `components/ui/` + komponen custom

## Command Wajib

```bash
npm run dev       # dev server
npm run build     # build produksi (TypeScript check ikut jalan)
npm run lint      # eslint (flat config, target: seluruh repo)
```

Selesai mengerjakan tugas: **wajib** `npm run lint` dan `npm run build` hijau sebelum menyerahkan hasil.

## Arsitektur (singkat)

```
app/(public)/        # halaman publik (hero, about, projects, contact)
app/admin/           # admin dashboard + login (route group (dashboard))
app/api/contact/     # route handler form kontak -> contact_messages
components/          # section publik + components/admin (form CMS) + components/ui
data/content.ts      # fallback konten saat Supabase tidak terkonfigurasi
lib/actions/         # "use server" — semua mutasi DB via Server Actions
lib/content.ts       # getPublicSiteData() (cache) + getContactMessages()
lib/supabase/        # env.ts, server.ts, client.ts, middleware.ts
lib/icons.ts         # katalog ikon getIcon(name)
supabase/schema.sql  # skema DB lengkap + RLS + storage + seed (idempoten)
types/content.ts     # tipe DB (snake_case) + Public* (camelCase)
proxy.ts             # Next 16 "middleware" (guard route /admin)
```

## Konvensi & Rulebase Kode

1. **Ikuti pola yang sudah ada.** Sebelum membuat/ubah file, baca file sejenis di sekitarnya dulu
   (mis. komponen form admin mengikuti `HeroForm.tsx` / `SocialForm.tsx`).
2. **Server Actions** harus punya signature
   `(prevState: ActionState, formData: FormData) => Promise<ActionState>`
   dan memanggil `revalidatePath("/", "layout")` (+ path admin terkait) setelah mutasi berhasil.
   `ActionState` di-import dari `@/lib/actions/content`.
3. **Tipe:** definisikan di `types/content.ts`. Kolom tabel Supabase `snake_case`;
   tipe `Public*` yang dikonsumsi situs publik memakai `camelCase`. Mapping ada di `lib/content.ts` dengan fallback ke `data/content.ts`.
4. **Komponen interaktif** pakai `"use client"`; halaman Server Component tetap server.
5. **UI:** pakai komponen yang sudah ada di `components/ui`. Catatan Windows:
   `Button.tsx` custom MENIMPA shadcn `button.tsx` → selalu import `@/components/ui/Button` (huruf besar).
   Dialog pakai `@/components/ui/dialog` (berbasis `@base-ui/react`).
6. **Upload gambar:** pakai `components/admin/ImageUpload.tsx` (bucket storage `portfolio-images`).
7. **Akses Supabase:** server = `createClient()` dari `@/lib/supabase/server`;
   browser = `@/lib/supabase/client`.
8. **Next 16:** route protection via `proxy.ts` (fungsi bernama `proxy`), bukan `middleware.ts`.
9. **framer-motion:** array ease harus `as const` (mis. `[0.16,1,0.3,1] as const`) agar TS tidak error.
10. **Font:** Inter (body/heading) + JetBrains Mono (`font-label`, uppercase tracking).
11. **Jangan menambah dependency** tanpa kebutuhan jelas; lebih baik pakai yang sudah ada.
12. **Jangan menambah komentar** di kode kecuali diminta user.

## Rulebase CMS (supabase/schema.sql)

- Skema dibuat **idempoten** (aman dijalankan ulang): enum pakai `DO $$` cek `pg_type`,
  policy/trigger di-`drop` sebelum dibuat ulang, seed hanya jalan saat tabel kosong.
- RLS: tabel konten → publik `select`, role `authenticated` boleh tulis.
  `contact_messages` → publik hanya `insert`, `authenticated` select/update/delete.
- Jika menambah kolom: sertakan `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` di bagian migration.

## ATURAN GIT (WAJIB — larangan commit langsung oleh agent)

**Agent DILARANG keras menjalankan `git add`, `git commit`, `git push`, `git rebase`, atau
operasi git apa pun yang mengubah riwayat/remote tanpa izin eksplisit tertulis dari user.**

Jika ada perubahan yang membutuhkan commit:

1. Rangkum staging + commit **sebagai perintah teks** di balasan, bukan menjalankannya.
2. Pisahkan per fitur (commit kecil terarah, mengikuti gaya pesan repo: `feat: ...`, `fix: ...`).
3. Lampirkan perintahnya satu blok, siap salin-tempel:
   ```bash
   git add <file...>
   git commit -m "feat: deskripsi"
   ```
4. Tambahkan command push hanya jika user memintanya.
5. **Agent BOLEH (wajib) membaca** `git status`, `git diff`, `git log` untuk inspeksi —
   itu bukan operasi yang mengubah repo.

Contoh SOP penyerahan commit:
> Perintah berikut silakan dijalankan manual:
> ```bash
> git add "app/admin/(dashboard)/..." components/admin/...
> git commit -m "feat(cms): ..."
> git push -u origin dev
> ```