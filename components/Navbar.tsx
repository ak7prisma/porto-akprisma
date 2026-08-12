"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import NavButton from "./ui/NavButton";
import MobileMenu from "./ui/MobileMenu";
import { Button } from "./ui/Button";
import { navLinks, contactLink } from "@/data/navlink"; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isScrolled ? 20 : 0,
        width: isScrolled ? "85%" : "100%",
        borderRadius: isScrolled ? "25px" : "0px",
        opacity: 1,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed left-0 right-0 mx-auto z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/20 backdrop-blur-md border border-white/10 shadow-lg max-w-6xl"
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="flex items-center justify-between px-10 py-3">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-0.5 hover:gap-1.5 duration-300 group">
            <Image src="/LogoPrisma.png" alt="Logo" width={150} height={150} className="group-hover:rotate-2 duration-300" />
        </Link>

        {/* 2. Desktop Nav */}
        <NavButton links={navLinks} />

        {/* Right Section  */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            href={contactLink.href} 
            variant="primary" 
            size="sm" 
            className="rounded-full font-semibold"
            icon={<ArrowRight size={16} />}
          >
            {contactLink.name} Me
          </Button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Menu */}
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} links={navLinks} />
      
    </motion.nav>
  );
}