"use client";

import Image from "next/image";
import type { PublicHero } from "@/types/content";

export default function ProfilCard({ hero }: { hero: PublicHero }) {
  return (
    <figure className="group relative w-full max-w-md">
      <div className="absolute -inset-3 rounded-2xl bg-[radial-gradient(closest-side,rgba(161,161,170,0.08),transparent)]" />

      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-secondary">
        <Image
          src="/FotoPrisma.png"
          alt={hero.name}
          fill
          priority
          className="object-cover object-top grayscale transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 0px, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent" />
      </div>

      <figcaption className="mt-4 flex items-center justify-between gap-4 font-label text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span>{hero.initialBadge}</span>
        <span>{hero.role}</span>
      </figcaption>
    </figure>
  );
}
