import type { ComponentType, SVGProps } from "react";
import {
  Code2,
  Cpu,
  LayoutDashboard,
  MessageCircle,
  MousePointer2,
  Zap,
} from "lucide-react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const iconMap: Record<string, IconComponent> = {
  Code2,
  Cpu,
  LayoutDashboard,
  MessageCircle,
  MousePointer2,
  Zap,
  Github: FaGithub,
  Instagram: FaInstagram,
  Linkedin: FaLinkedin,
  Whatsapp: FaWhatsapp,
};

export function getIcon(name?: string | null): IconComponent {
  return iconMap[name ?? ""] ?? Code2;
}
