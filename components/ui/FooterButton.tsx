import Link from "next/link";
import { navLinks, contactLink } from "@/data/navlink";

export default function FooterButton() {
  const fullLink = [...navLinks, contactLink];

  return (
    <div className="flex flex-col items-center md:items-start">
      <p className="mb-4 hidden font-label text-xs uppercase tracking-[0.18em] text-muted-foreground md:block">
        Explore
      </p>
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm md:flex-col md:justify-start">
        {fullLink.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
