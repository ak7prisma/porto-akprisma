export interface SiteConfig {
  id: string;
  site_name: string;
  site_tagline: string;
  email: string;
  location: string;
  cv_link: string | null;
  footer_text: string;
  contact_heading: string;
  contact_intro: string;
  created_at: string;
  updated_at: string;
}

export interface HeroContent {
  id: string;
  name: string;
  role: string;
  status: string;
  description: string;
  initial: string;
  initial_badge: string;
  created_at: string;
  updated_at: string;
}

export interface AboutBio {
  id: string;
  content: string;
}

export interface AboutContent {
  id: string;
  headline: string;
  bios: AboutBio[];
  created_at: string;
  updated_at: string;
}

export interface EducationContent {
  id: string;
  year: string;
  degree: string;
  university: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface StackContent {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface StatContent {
  id: string;
  label: string;
  sub_label: string;
  icon: string;
  color: string;
  background: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialContent {
  id: string;
  name: string;
  href: string;
  icon: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectLink {
  demo: string | null;
  github: string | null;
}

export interface ProjectContent {
  id: number;
  title: string;
  category: string;
  description: string;
  desktop_image: string;
  mobile_image: string;
  tech: string[];
  demo_url: string | null;
  github_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type ContactMessageStatus = "new" | "read" | "replied" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  created_at: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface PublicSiteConfig {
  siteName: string;
  tagline: string;
  email: string;
  location: string;
  cvLink: string | null;
  footerText: string;
  contactHeading: string;
  contactIntro: string;
}

export interface PublicHero {
  name: string;
  role: string;
  status: string;
  description: string;
  initial: string;
  initialBadge: string;
}

export interface PublicAbout {
  headline: string;
  bios: { id: string; content: string }[];
}

export interface PublicEducation {
  year: string;
  degree: string;
  university: string;
  description: string;
}

export interface PublicStack {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface PublicStat {
  id: string;
  label: string;
  subLabel: string;
  icon: string;
  color: string;
  background: string;
}

export interface PublicProject {
  id: number;
  title: string;
  category: string;
  description: string;
  desktopImage: string | null;
  mobileImage: string | null;
  tech: string[];
  demoUrl: string | null;
  githubUrl: string | null;
}

export interface PublicSocial {
  id: string;
  name: string;
  href: string;
  icon: string;
}

export interface PublicSiteData {
  nav: NavItem[];
  siteConfig: PublicSiteConfig;
  hero: PublicHero;
  about: PublicAbout;
  education: PublicEducation;
  stacks: PublicStack[];
  stats: PublicStat[];
  projects: PublicProject[];
  socials: PublicSocial[];
}
