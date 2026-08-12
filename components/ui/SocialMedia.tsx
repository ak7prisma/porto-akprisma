import { getIcon } from "@/lib/icons";
import type { PublicSocial } from "@/types/content";

export default function SocialMedia({ socials }: { socials: PublicSocial[] }) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <p className="mb-4 hidden font-label text-xs uppercase tracking-[0.18em] text-muted-foreground md:block">
        Connect
      </p>

      <div className="flex gap-3">
        {socials.map((social) => {
          const Icon = getIcon(social.icon);
          return (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
            >
              <Icon size={17} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
