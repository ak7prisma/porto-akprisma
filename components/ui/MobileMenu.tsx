import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type MobileMenuProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  links: { name: string; href: string }[];
  adminLink?: { name: string; href: string };
};

export default function MobileMenu({
  isOpen,
  setIsOpen,
  links,
  adminLink,
}: Readonly<MobileMenuProps>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="absolute left-4 right-4 top-full mt-2 overflow-hidden rounded-2xl border border-border bg-zinc-950/95 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col p-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-3 space-y-2">
              {adminLink && (
                <Link
                  href={adminLink.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-full border border-border px-4 py-3 text-center text-sm font-semibold text-muted-foreground"
                >
                  {adminLink.name}
                </Link>
              )}
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block rounded-full bg-foreground px-4 py-3 text-center text-sm font-semibold text-background"
              >
                Contact
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
