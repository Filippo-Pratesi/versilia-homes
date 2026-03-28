import type { Metadata } from "next";
import Link from "next/link";
import {
  Waves,
  Ticket,
  UtensilsCrossed,
  MapPin,
  Car,
  Train,
  Bike,
  Ship,
  TreePine,
  Landmark,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Viareggio e la Versilia | Viareggio Homes",
  description:
    "Scopri Viareggio e la Versilia: spiagge, carnevale, gastronomia e arte. I nostri appartamenti ti mettono a pochi passi dal mare della Toscana.",
};

const activities = [
  {
    icon: MapPin,
    title: "La Passeggiata",
    description:
      "Il viale a mare è il cuore pulsante di Viareggio: negozi, caffè, gelaterie e locali si affacciano sul lungomare per tutta la sua lunghezza.",
  },
  {
    icon: TreePine,
    title: "Pineta di Levante",
    description:
      "Un polmone verde a pochi passi dal mare. Ideale per passeggiate mattutine, jogging o semplicemente per cercare ombra nelle ore più calde.",
  },
  {
    icon: Landmark,
    title: "Torre Matilde",
    description:
      "La torre medievale a guardia del porto, simbolo storico della città. Dal porto partono gite in barca verso le isole e la costa apuana.",
  },
  {
    icon: Ship,
    title: "Gite in barca",
    description:
      "Dal porto di Viareggio partono escursioni giornaliere verso Capraia, Elba e le Cinque Terre. Un modo meraviglioso per scoprire il Tirreno.",
  },
  {
    icon: Bike,
    title: "Ciclabili e sport",
    description:
      "Viareggio è una città ciclabile: piste dedicate corrono lungo il mare e verso la pineta. Noleggi bici si trovano a ogni angolo.",
  },
];

const dishes = [
  {
    name: "Cacciucco",
    description:
      "La zuppa di pesce versiliese per antonomasia, ricca e saporita.",
  },
  {
    name: "Tordelli",
    description:
      "Pasta ripiena tipica lucchese, servita con ragù di carne.",
  },
  {
    name: "Pescato del giorno",
    description:
      "I ristoranti sul porto propongono ogni giorno il pesce fresco appena sbarcato.",
  },
  {
    name: "Cecina e farinata",
    description:
      "Torta di ceci cotta in forno a legna: uno street food toscano irresistibile.",
  },
  {
    name: "Vini DOC Colline Lucchesi",
    description:
      "Bianchi e rossi prodotti sulle colline a pochi chilometri dalla costa.",
  },
];

export default function ViareggiPage() {
  return (
    <div className="bg-[#FAFAF8]">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#E8DCC8]/20 border-b border-[#E0D8CC] text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-4">
          Versilia · Toscana
        </p>
        <h1
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#2D3436] leading-tight"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Viareggio
        </h1>
        <p className="mt-5 text-lg text-[#636E72] max-w-xl mx-auto leading-relaxed">
          La perla della Versilia: mare, cultura e ospitalità toscana a pochi
          passi dai vostri appartamenti.
        </p>
      </section>

      {/* Intro */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-lg text-[#636E72]">
          <p>
            Viareggio è la città più importante della Versilia, affacciata sul
            Mar Tirreno con il suo iconico lungomare liberty. Meta turistica per
            eccellenza della Toscana costiera, offre chilometri di spiagge
            sabbiose, una vivace vita notturna, ristoranti di pesce fresco e
            una cultura profonda che si esprime nel suo celebre Carnevale.
          </p>
          <p>
            Soggiornare in un appartamento vacanza a Viareggio significa avere
            il mare a portata di mano e la libertà di esplorare la Versilia —
            da Forte dei Marmi a Pietrasanta, fino alle vette delle Alpi
            Apuane.
          </p>
        </div>
      </section>

      {/* Highlights grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-[#E0D8CC]">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] text-center mb-12"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Perché Viareggio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-5 p-6 rounded-2xl bg-[#FAFAF8] border border-[#E0D8CC]">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#E8DCC8]/60 rounded-2xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-[#C2714F]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3
                      className="font-display text-xl font-semibold text-[#2D3436] mb-1"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#636E72] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dintorni */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] text-center mb-3">
            Esplorare la Regione
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] text-center mb-3"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            I Dintorni
          </h2>
          <p className="text-center text-[#636E72] max-w-xl mx-auto mb-12">
            Viareggio è il punto di partenza ideale per scoprire alcune delle
            destinazioni più belle d'Italia. Arte, natura, borghi storici e
            spiagge esclusive — tutto a portata di mano.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {dintorni.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex gap-4 p-6 rounded-2xl bg-white border border-[#E0D8CC] hover:border-[#C2714F]/40 transition-colors"
                >
                  <div className="flex-shrink-0 w-11 h-11 bg-[#E8DCC8]/60 rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#C2714F]" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3
                        className="font-display text-xl font-semibold text-[#2D3436]"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {item.name}
                      </h3>
                      <span className="text-xs font-medium text-[#4A90A4] bg-[#4A90A4]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.distance}
                      </span>
                    </div>
                    <p className="text-sm text-[#636E72] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-[#E8DCC8]/20 border-t border-[#E0D8CC]">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Prenota il tuo soggiorno a Viareggio
        </h2>
        <p className="text-[#636E72] max-w-md mx-auto mb-8">
          Scegli tra i nostri appartamenti vacanza a Viareggio e prenota
          direttamente, senza commissioni Airbnb.
        </p>
        <Link
          href="/appartamenti"
          className="inline-block bg-[#2D3436] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide hover:bg-[#4A90A4] transition-colors"
        >
          Scopri gli appartamenti
        </Link>
      </section>
    </div>
  );
}
