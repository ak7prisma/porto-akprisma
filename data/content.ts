import type { PublicSiteData } from "@/types/content";

export const siteContentFallback: PublicSiteData = {
  nav: [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ],

  siteConfig: {
    siteName: "Ahmad Kurnia Prisma",
    tagline: "Front-End Developer",
    email: "ahmadkurniaprisma@gmail.com",
    location: "Palembang, Indonesia",
    cvLink:
      "https://drive.google.com/file/d/1lxbcCcK6ekVMB_NpDLkihNDLCSNAkPGg/view?usp=sharing",
    footerText:
      "Menyelami kedalaman kode untuk menciptakan solusi digital yang fungsional dan estetik.",
    contactHeading: "Let's work together",
    contactIntro:
      "Have a project in mind or just want to say hi? I'm currently open to new opportunities and collaborations.",
  },

  hero: {
    name: "Ahmad Kurnia Prisma",
    role: "Front-End Developer",
    status: "Available for Freelance",
    description:
      "Informatics student at Universitas Sriwijaya specializing in building best-performance web applications with Next.js, Supabase, and purposeful animations.",
    initial: "P",
    initialBadge: "AK",
  },

  about: {
    headline: "Architecting digital experiences that matter",
    bios: [
      {
        id: "bio-intro",
        content:
          "Hello! I'm Ahmad Kurnia Prisma, an Informatics student at Universitas Sriwijaya with a deep passion for modern web development.",
      },
      {
        id: "bio-specialization",
        content:
          "Specializing in Next.js and Supabase, I focus on crafting bold, user-friendly designs enhanced by purposeful animations to drive engagement.",
      },
      {
        id: "bio-leadership",
        content:
          "Beyond writing code, I've demonstrated strong leadership and technical adaptability actively collaborating on the maintenance and technical stability of the SRIFOTON 2025 platform, while fully leading the curriculum design and logic development for the Java Programming Training 2025.",
      },
    ],
  },

  education: {
    year: "2024 - Present",
    degree: "Informatics - Fasilkom",
    university: "Universitas Sriwijaya",
    description:
      "Focusing on Software Engineering and Web Technologies. Actively contributing as PJ Software Engineering for SRIFOTON 2025.",
  },

  stacks: [
    {
      id: "stack-frontend",
      title: "Frontend",
      description: "Next.js, Tailwind CSS, Framer Motion",
      icon: "LayoutDashboard",
      color: "cyan",
    },
    {
      id: "stack-backend",
      title: "Backend",
      description: "Supabase, PostgreSQL, MySQL",
      icon: "Cpu",
      color: "teal",
    },
  ],

  stats: [
    {
      id: "stat-clean-code",
      label: "Clean Code",
      subLabel: "Next.js & React Expert",
      icon: "Code2",
      color: "text-blue-400",
      background: "bg-blue-500/10",
    },
    {
      id: "stat-interactive",
      label: "Interactive UI",
      subLabel: "Framer Motion & Tailwind",
      icon: "Zap",
      color: "text-cyan-400",
      background: "bg-cyan-500/10",
    },
  ],

  projects: [
    {
      id: 1,
      title: "StarShop",
      category: "E-Commerce & Digital Products",
      description:
        "A seamless digital top-up platform designed for gamers. Features digital product store and a highly responsive user interface optimized for mobile transactions.",
      problem:
        "Top-up digital yang biasa bikin pembeli ragu: proses bertele-tele, UI kurang responsif di HP, dan pencarian produk lambat.",
      solution:
        "Membangun store digital yang fokus pada kecepatan transaksi mobile: UI dioptimalkan untuk layar kecil, alur top-up dipangkas seminimal mungkin, dan daftar produk dirender cepat.",
      desktopImage: "/Starshop.png",
      mobileImage: "/StarshopMobile.png",
      tech: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
      demoUrl: "https://starshop-jf2g.vercel.app",
      githubUrl: "https://github.com/ak7prisma/starshop.git",
    },
    {
      id: 2,
      title: "Srifoton Website",
      category: "Event & Organization",
      description:
        "The official event portal for HMIF Unsri's annual IT competition (Team Project). Built collaboratively to facilitate participant registration, event scheduling, and information dissemination with dynamic animations.",
      problem:
        "Portal kompetisi tahunan perlu menampung registrasi peserta, jadwal acara, dan pengumuman dalam satu tempat dengan trafik tinggi saat pendaftaran dibuka.",
      solution:
        "Membangun portal event kolaboratif: arsitektur data terpisah untuk registrasi/jadwal/informasi, animasi dinamis untuk menjaga engagement, dan flow pendaftaran yang jelas untuk peserta.",
      desktopImage: "/Srifoton.png",
      mobileImage: "/SrifotonMobile.png",
      tech: ["Next.js", "Tailwind CSS", "Supabase"],
      demoUrl: "https://srifoton.hmifunsri.com",
      githubUrl: null,
    },
    {
      id: 3,
      title: "My Drakor Checklist",
      category: "Personal Utility App",
      description:
        "A personalized tracking application for K-Drama enthusiasts. Allows users to manage K-Drama watchlists. Focused on simple and responsive UI.",
      problem:
        "Drama list yang ada terlalu ribet untuk sekadar menandai drakor yang ingin atau sudah ditonton.",
      solution:
        "Membuat aplikasi checklist ringan dengan LocalStorage: tanpa backend, tanpa setup, cukup buka dan tandai, dengan UI simpel yang tetap responsif.",
      desktopImage: "/DrakorCheckList.png",
      mobileImage: "/DrakorChecklistMobile.png",
      tech: ["HTML", "CSS", "JavaScript", "LocalStorage", "Fun Project"],
      demoUrl: null,
      githubUrl: "https://github.com/username/repo",
    },
  ],

  socials: [
    {
      id: "social-github",
      name: "GitHub",
      href: "https://github.com/ak7prisma",
      icon: "Github",
    },
    {
      id: "social-linkedin",
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/ahmad-kurnia-prisma-1b639a313",
      icon: "Linkedin",
    },
    {
      id: "social-instagram",
      name: "Instagram",
      href: "https://www.instagram.com/akprisma",
      icon: "Instagram",
    },
    {
      id: "social-whatsapp",
      name: "WhatsApp",
      href: "https://wa.me/628989209565",
      icon: "MessageCircle",
    },
  ],
};
