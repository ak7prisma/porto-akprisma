import Link from "next/link";
import Image from "next/image";
import type { PublicSiteConfig } from "@/types/content";

export default function FooterLogo({ siteConfig }: { siteConfig: PublicSiteConfig }) {
  return (
    <div className="md:col-span-2 flex flex-col items-center space-y-4 md:items-start">
      <Link href="/" className="inline-flex items-center gap-2">
        <span className="relative h-8 w-8 overflow-hidden rounded-md">
          <Image
            src="/LogoAKP.png"
            alt="Ahmad Kurnia Prisma"
            fill
            className="object-cover grayscale"
            sizes="32px"
          />
        </span>
        <span className="font-label text-base uppercase tracking-widest text-foreground">
           Prisma
        </span>
      </Link>

      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:mx-0">
        {siteConfig.footerText}
      </p>
    </div>
  );
}
