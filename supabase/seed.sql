-- =============================================
-- Seed data from existing static content
-- =============================================

-- ---------- site_config ----------
insert into public.site_config (site_name, site_tagline, email, location, cv_link, footer_text)
values (
  'Ahmad Kurnia Prisma',
  'Front-End Developer',
  'ahmadkurniaprisma@gmail.com',
  'Palembang, Indonesia',
  'https://drive.google.com/file/d/1lxbcCcK6ekVMB_NpDLkihNDLCSNAkPGg/view?usp=sharing',
  'Menyelami kedalaman kode untuk menciptakan solusi digital yang fungsional dan estetik.'
);

-- ---------- hero ----------
insert into public.hero (name, role, status, description, initial, initial_badge)
values (
  'Ahmad Kurnia Prisma',
  'Front-End Developer',
  'Available for Freelance',
  'Informatics student at Universitas Sriwijaya specializing in building best-performance web applications with Next.js, Supabase, and purposeful animations.',
  'P',
  'AK'
);

-- ---------- about ----------
with about_row as (
  insert into public.about (headline)
  values ('Architecting digital experiences that matter')
  returning id
)
insert into public.about_bios (about_id, content, sort_order)
select id, content, sort_order
from about_row
cross join (values
  (0, 'Hello! I''m Ahmad Kurnia Prisma, an Informatics student at Universitas Sriwijaya with a deep passion for modern web development.'),
  (1, 'Specializing in Next.js and Supabase, I focus on crafting bold, user-friendly designs enhanced by purposeful animations to drive engagement.'),
  (2, 'Beyond writing code, I''ve demonstrated strong leadership and technical adaptability actively collaborating on the maintenance and technical stability of the SRIFOTON 2025 platform, while fully leading the curriculum design and logic development for the Java Programming Training 2025.')
) as bios(sort_order, content);

-- ---------- education ----------
insert into public.education (year, degree, university, description)
values (
  '2024 - Present',
  'Informatics - Fasilkom',
  'Universitas Sriwijaya',
  'Focusing on Software Engineering and Web Technologies. Actively contributing as PJ Software Engineering for SRIFOTON 2025.'
);

-- ---------- stacks ----------
insert into public.stacks (title, description, icon, color, sort_order) values
  ('Frontend', 'Next.js, Tailwind CSS, Framer Motion', 'LayoutDashboard', 'cyan', 0),
  ('Backend', 'Supabase, PostgreSQL, MySQL', 'Cpu', 'teal', 1);

-- ---------- stats ----------
insert into public.stats (label, sub_label, icon, color, background, sort_order) values
  ('Clean Code', 'Next.js & React Expert', 'Code2', 'text-blue-400', 'bg-blue-500/10', 0),
  ('Interactive UI', 'Framer Motion & Tailwind', 'Zap', 'text-cyan-400', 'bg-cyan-500/10', 1);

-- ---------- projects ----------
insert into public.projects (title, category, description, desktop_image, mobile_image, tech, demo_url, github_url, sort_order, is_published) values
  (
    'StarShop',
    'E-Commerce & Digital Products',
    'A seamless digital top-up platform designed for gamers. Features digital product store and a highly responsive user interface optimized for mobile transactions.',
    '/Starshop.png',
    '/StarshopMobile.png',
    array['Next.js', 'Tailwind CSS', 'Supabase', 'Vercel'],
    'https://starshop-jf2g.vercel.app',
    'https://github.com/ak7prisma/starshop.git',
    0,
    true
  ),
  (
    'Srifoton Website',
    'Event & Organization',
    'The official event portal for HMIF Unsri''s annual IT competition (Team Project). Built collaboratively to facilitate participant registration, event scheduling, and information dissemination with dynamic animations.',
    '/Srifoton.png',
    '/SrifotonMobile.png',
    array['Next.js', 'Tailwind CSS', 'Supabase'],
    'https://srifoton.hmifunsri.com',
    null,
    1,
    true
  ),
  (
    'My Drakor Checklist',
    'Personal Utility App',
    'A personalized tracking application for K-Drama enthusiasts. Allows users to manage K-Drama watchlists. Focused on simple and responsive UI.',
    '/DrakorCheckList.png',
    '/DrakorChecklistMobile.png',
    array['HTML', 'CSS', 'JavaScript', 'LocalStorage', 'Fun Project'],
    null,
    'https://github.com/username/repo',
    2,
    true
  );

-- ---------- socials ----------
insert into public.socials (name, href, icon, sort_order) values
  ('GitHub', 'https://github.com/ak7prisma', 'Github', 0),
  ('LinkedIn', 'https://www.linkedin.com/in/ahmad-kurnia-prisma-1b639a313', 'Linkedin', 1),
  ('Instagram', 'https://www.instagram.com/akprisma', 'Instagram', 2),
  ('WhatsApp', 'https://wa.me/628989209565', 'MessageCircle', 3);
