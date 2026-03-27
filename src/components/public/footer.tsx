import Link from "next/link";
import { Waves, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#E8DCC8]/30 border-t border-[#E0D8CC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-[#4A90A4]" strokeWidth={1.5} />
              <span
                className="font-display text-lg font-semibold text-[#2D3436]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Versilia Homes
              </span>
            </div>
            <p className="text-sm text-[#636E72] leading-relaxed max-w-[220px]">
              Prenotazione diretta — nessuna commissione. Appartamenti vacanza a
              Viareggio, Versilia.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#2D3436]">
              Navigazione
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/appartamenti"
                className="text-sm text-[#636E72] hover:text-[#4A90A4] transition-colors"
              >
                Appartamenti
              </Link>
              <Link
                href="/chi-siamo"
                className="text-sm text-[#636E72] hover:text-[#4A90A4] transition-colors"
              >
                Chi Siamo
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#2D3436]">
              Contatti
            </h3>
            <div className="flex items-center gap-2 text-sm text-[#636E72]">
              <Mail className="h-4 w-4 text-[#4A90A4] shrink-0" />
              <a
                href="mailto:prenotazioni@versiliahomes.it"
                className="hover:text-[#4A90A4] transition-colors break-all"
              >
                prenotazioni@versiliahomes.it
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[#E0D8CC] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#636E72]">
            &copy; {currentYear} Versilia Homes. Tutti i diritti riservati.
          </p>
          <p className="text-xs text-[#636E72] text-center sm:text-right">
            Struttura registrata ai sensi della normativa regionale sulla
            registrazione turistica.
          </p>
        </div>
      </div>
    </footer>
  );
}
