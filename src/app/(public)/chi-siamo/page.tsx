import type { Metadata } from "next";
import { Mail, MessageSquare, Heart, Anchor, Sun } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Chi Siamo',
  description: 'Scopri chi siamo: una famiglia viareggina che condivide i propri appartamenti vacanza sul mare della Versilia.',
};

const values = [
  {
    icon: Heart,
    title: "Ospitalità autentica",
    description:
      "Ogni ospite è accolto come un amico di famiglia. Il tuo benessere è la nostra priorità.",
  },
  {
    icon: Anchor,
    title: "Radici nel territorio",
    description:
      "Viviamo a Viareggio da generazioni. Conosciamo ogni angolo della Versilia e siamo felici di condividere i nostri luoghi del cuore.",
  },
  {
    icon: Sun,
    title: "Trasparenza totale",
    description:
      "Nessuna sorpresa, nessuna commissione nascosta. Quello che vedi è quello che paghi.",
  },
];

export default function ChiSiamoPage() {
  return (
    <div className="bg-[#FAFAF8]">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#E8DCC8]/20 border-b border-[#E0D8CC] text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-4">
          La nostra storia
        </p>
        <h1
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#2D3436] leading-tight"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Chi Siamo
        </h1>
        <p className="mt-5 text-lg text-[#636E72] max-w-xl mx-auto leading-relaxed">
          Una famiglia di Viareggio con il mare nel cuore e la passione per
          l&apos;accoglienza.
        </p>
      </section>

      {/* Story section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div className="space-y-6">
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              La nostra famiglia e la Versilia
            </h2>
            <div className="space-y-4 text-[#636E72] leading-relaxed">
              <p>
                Siamo cresciuti a Viareggio, tra il profumo di pino e la
                brezza del mare Tirreno. La Versilia è casa nostra da sempre,
                e nel corso degli anni abbiamo imparato ad amarla nei suoi
                angoli più autentici — le spiagge all&apos;alba, i tramonti sulle
                Apuane, il carnevale che accende la città ogni febbraio.
              </p>
              <p>
                Quando abbiamo deciso di mettere i nostri appartamenti a
                disposizione degli ospiti, lo abbiamo fatto con un obiettivo
                chiaro: offrire un&apos;esperienza genuina, lontana dalle logiche
                delle grandi piattaforme. Vogliamo che chi viene da noi si
                senta accolto come si accoglie un amico, non un cliente.
              </p>
              <p>
                Ogni appartamento è curato personalmente da noi. Conosciamo
                ogni angolo, ogni piccolo dettaglio. E siamo sempre a
                disposizione — via WhatsApp o email — per qualsiasi esigenza,
                prima, durante e dopo il soggiorno.
              </p>
            </div>
          </div>

          {/* Decorative element */}
          <div className="relative">
            <div className="aspect-square max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-[#4A90A4]/20 to-[#E8DCC8]/60 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl font-display text-[#4A90A4] opacity-30"
                  style={{ fontFamily: "var(--font-cormorant)" }}>
                  VH
                </div>
                <div className="space-y-2">
                  <div className="h-0.5 w-16 bg-[#C2714F] mx-auto" />
                  <p
                    className="font-display text-xl text-[#2D3436] font-semibold"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Viareggio Homes
                  </p>
                  <p className="text-xs text-[#636E72] uppercase tracking-widest">
                    Viareggio · Dal 2024
                  </p>
                </div>
              </div>
            </div>
            {/* Floating accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#C2714F]/10 rounded-full blur-xl" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#4A90A4]/10 rounded-full blur-lg" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] text-center mb-12"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            I nostri valori
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center space-y-4 p-6">
                  <div className="w-12 h-12 bg-[#E8DCC8]/60 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon className="h-6 w-6 text-[#C2714F]" strokeWidth={1.5} />
                  </div>
                  <h3
                    className="font-display text-xl font-semibold text-[#2D3436]"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#636E72] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Scrivici
          </h2>
          <p className="text-[#636E72]">
            Siamo a tua disposizione per qualsiasi domanda. Rispondiamo sempre
            entro poche ore.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <a
              href="mailto:prenotazioni@versiliahomes.it"
              className="flex items-center justify-center gap-2.5 px-6 py-4 bg-[#4A90A4] text-white rounded-xl text-sm font-medium hover:bg-[#3A7A8E] transition-colors shadow-md shadow-[#4A90A4]/20"
            >
              <Mail className="h-4 w-4" />
              Scrivici via email
            </a>
            <a
              href="https://wa.me/39"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-6 py-4 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#1ebe5a] transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </a>
          </div>

          <div className="pt-4">
            <p className="text-sm text-[#636E72]">
              Oppure{" "}
              <Link
                href="/appartamenti"
                className="text-[#4A90A4] hover:underline font-medium"
              >
                sfoglia i nostri appartamenti
              </Link>{" "}
              e invia una richiesta direttamente dalla pagina dell&apos;appartamento.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
