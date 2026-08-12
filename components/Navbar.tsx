"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import MobileMenu from "./ui/MobileMenu";
import { Button } from "./ui/Button";
import { navLinks, contactLink } from "@/data/navlink";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4">
      <nav className="mt-4 flex w-full max-w-6xl items-center justify-between rounded-full border border-border bg-zinc-950/70 px-5 py-2.5 backdrop-blur-md">
        <Link href="/" className="flex items-center">
          <Image src="/LogoAKP.png" alt="Logo" width={130} height={40} priority className="h-9 w-auto object-contain" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Button
            href={contactLink.href}
            variant="primary"
            size="sm"
            className="font-semibold"
            icon={<ArrowUpRight size={16} />}
          >
            {contactLink.name}
          </Button>
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} links={navLinks} />
    </header>
  );
}
