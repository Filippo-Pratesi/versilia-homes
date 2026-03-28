"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Waves, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/appartamenti", label: "Appartamenti" },
  { href: "/viareggio", label: "La Zona" },
  { href: "/chi-siamo", label: "Chi Siamo" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#FAFAF8]/95 backdrop-blur-md shadow-sm border-b border-[#E0D8CC]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Viareggio Homes – torna alla homepage"
        >
          <Waves
            className="h-6 w-6 text-[#4A90A4] group-hover:scale-110 transition-transform"
            strokeWidth={1.5}
          />
          <span
            className="font-display text-xl font-semibold text-[#2D3436] tracking-wide"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Viareggio Homes
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#636E72] hover:text-[#2D3436] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:bg-[#4A90A4] after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/appartamenti"
            className="inline-flex items-center justify-center bg-[#4A90A4] hover:bg-[#3A7A8E] text-white rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200"
          >
            Prenota ora
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  aria-label="Apri menu"
                  className="p-2 text-[#2D3436] hover:text-[#4A90A4] transition-colors"
                />
              }
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] bg-[#FAFAF8] border-l border-[#E0D8CC] p-0"
              showCloseButton={false}
            >
              <div className="flex flex-col h-full pt-8 px-4">
                {/* Mobile logo */}
                <div className="flex items-center gap-2 mb-10">
                  <Waves
                    className="h-5 w-5 text-[#4A90A4]"
                    strokeWidth={1.5}
                  />
                  <span
                    className="font-display text-lg font-semibold text-[#2D3436]"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Viareggio Homes
                  </span>
                </div>
                {/* Mobile links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="px-3 py-3 text-base font-medium text-[#2D3436] hover:text-[#4A90A4] hover:bg-[#E8DCC8]/40 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto pb-8">
                  <Link
                    href="/appartamenti"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-full bg-[#4A90A4] hover:bg-[#3A7A8E] text-white rounded-full py-3 text-sm font-medium transition-colors"
                  >
                    Prenota ora
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
