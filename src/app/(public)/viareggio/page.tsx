import type { Metadata } from "next";
import Image from "next/image";
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

export default function ViarегgioPage() {
  return (
    <div className="bg-[#FAFAF8]">
      {/* ── Hero ── */}
      <section className="relative py-20 sm:py-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden bg-[#2D3436]">
        <Image
          src="/images/viareggio-zona.jpg"
          alt="Passeggiata di Viareggio sul lungomare della Versilia"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,250,248,0.80) 0%, rgba(232,220,200,0.68) 40%, rgba(224,239,243,0.62) 100%)",
          }}
        />
        <div className="relative z-[2] max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-4">
            Toscana · Versilia
          </p>
          <h1
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#2D3436] leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Viareggio e la Versilia
          </h1>
          <p className="mt-5 text-lg text-[#636E72] max-w-2xl mx-auto leading-relaxed">
            Una riviera di sabbia dorata, storia, cultura e sapori autentici.
            Scopri perché la Versilia è una delle mete più amate d&apos;Italia.
          </p>
        </div>
      </section>

      {/* ── Il Mare ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Waves className="h-5 w-5 text-[#4A90A4]" strokeWidth={1.5} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4]">
              La costa
            </p>
          </div>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] mb-6"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Il Mare
          </h2>
          <div className="space-y-5 text-[#636E72] leading-relaxed text-base sm:text-lg">
            <p>
              Viareggio si affaccia sul Mar Tirreno con oltre quattro
              chilometri di spiaggia sabbiosa che si estendono senza
              interruzione lungo la costa della Versilia. La sabbia fine e
              dorata, il mare calmo e trasparente e l&apos;acqua che si scalda
              presto in primavera rendono questo litorale perfetto per
              famiglie, coppie e sportivi.
            </p>
            <p>
              I famosi{" "}
              <strong className="text-[#2D3436] font-medium">
                stabilimenti balneari
              </strong>{" "}
              viareggini sono un&apos;istituzione: ombrelloni colorati, lettini,
              piscine, ristoranti e servizi di ogni tipo si alternano sul
              lungomare creando un&apos;esperienza balneare unica. Chi preferisce
              la libertà può trovare tratti di spiaggia libera attrezzata.
            </p>
            <p>
              La passeggiata a mare — il viale Giosuè Carducci — corre
              parallela all&apos;Oceano per tutta la lunghezza del litorale, e di
              sera si anima di luci, musica e il profumo del gelato
              artigianale.
            </p>
          </div>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: "4 km", label: "di spiaggia" },
              { value: "~26°C", label: "mare in estate" },
              { value: "500 m", label: "dai nostri appartamenti" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 bg-[#4A90A4]/5 rounded-2xl border border-[#4A90A4]/10"
              >
                <p
                  className="font-display text-2xl sm:text-3xl font-semibold text-[#4A90A4]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-[#636E72] mt-1 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-[#E0D8CC]" />

      {/* ── Il Carnevale ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#C2714F]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Ticket className="h-5 w-5 text-[#C2714F]" strokeWidth={1.5} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2714F]">
              Tradizione dal 1873
            </p>
          </div>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] mb-6"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Il Carnevale
          </h2>

          <div className="lg:grid lg:grid-cols-5 lg:gap-12 space-y-6 lg:space-y-0">
            <div className="lg:col-span-3 space-y-5 text-[#636E72] leading-relaxed">
              <p>
                Il{" "}
                <strong className="text-[#2D3436] font-medium">
                  Carnevale di Viareggio
                </strong>{" "}
                è uno dei più celebri al mondo. Nato nel 1873 come semplice
                sfilata di maschere, si è evoluto nel corso di 150 anni fino
                a diventare un evento di portata internazionale che richiama
                centinaia di migliaia di visitatori ogni anno.
              </p>
              <p>
                Il cuore della manifestazione sono i{" "}
                <strong className="text-[#2D3436] font-medium">
                  carri allegorici
                </strong>
                : gigantesche sculture mobili di cartapesta, alte anche
                quindici metri, realizzate da maestri artigiani nei capannoni
                viareggini nel corso di mesi di lavoro. Ogni carro è
                un&apos;opera d&apos;arte animata, con personaggi che si muovono,
                ruotano e prendono vita lungo il lungomare.
              </p>
              <p>
                Le sfilate si tengono la domenica e il martedì grasso di
                febbraio e marzo. Il Carnevale si chiude nel gran finale del
                martedì grasso con il rogo del Burlamacco, maschera simbolo
                di Viareggio.
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-3xl bg-gradient-to-br from-[#C2714F]/15 to-[#E8DCC8]/50 p-8 h-full flex flex-col justify-center space-y-5">
                <p
                  className="font-display text-5xl text-[#C2714F]/30 font-semibold"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  1873
                </p>
                <div className="h-0.5 w-12 bg-[#C2714F]" />
                <div className="space-y-3">
                  <div className="text-sm text-[#636E72]">
                    <span className="text-[#2D3436] font-medium">
                      Periodo:
                    </span>{" "}
                    Febbraio – Marzo
                  </div>
                  <div className="text-sm text-[#636E72]">
                    <span className="text-[#2D3436] font-medium">Carri:</span>{" "}
                    Prima, seconda e terza categoria
                  </div>
                  <div className="text-sm text-[#636E72]">
                    <span className="text-[#2D3436] font-medium">
                      Mascotte:
                    </span>{" "}
                    Burlamacco e Ondina
                  </div>
                  <div className="text-sm text-[#636E72]">
                    <span className="text-[#2D3436] font-medium">
                      Visitatori:
                    </span>{" "}
                    oltre 500.000 ogni anno
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-[#E0D8CC]" />

      {/* ── Cosa Fare ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-3">
              Esperienze
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Cosa Fare
            </h2>
            <p className="mt-3 text-[#636E72] max-w-lg mx-auto">
              Viareggio e la Versilia offrono molto più della spiaggia: arte,
              natura, sport e cultura a portata di mano.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.title}
                  className="p-6 bg-white rounded-2xl border border-[#E0D8CC] hover:border-[#4A90A4]/30 hover:shadow-sm transition-all duration-200 space-y-3"
                >
                  <div className="w-10 h-10 bg-[#E8DCC8]/60 rounded-xl flex items-center justify-center">
                    <Icon
                      className="h-5 w-5 text-[#4A90A4]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3
                    className="font-display text-lg font-semibold text-[#2D3436]"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {activity.title}
                  </h3>
                  <p className="text-sm text-[#636E72] leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              );
            })}
            {/* Bonus card */}
            <div className="p-6 bg-[#4A90A4]/5 rounded-2xl border border-[#4A90A4]/15 space-y-3">
              <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-xl flex items-center justify-center">
                <MapPin
                  className="h-5 w-5 text-[#4A90A4]"
                  strokeWidth={1.5}
                />
              </div>
              <h3
                className="font-display text-lg font-semibold text-[#2D3436]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Gite nei dintorni
              </h3>
              <p className="text-sm text-[#636E72] leading-relaxed">
                Lucca, Pisa, Pietrasanta e le Cinque Terre sono raggiungibili
                in meno di un&apos;ora. La Versilia è la base ideale per esplorare
                la Toscana.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-[#E0D8CC]" />

      {/* ── Gastronomia ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#C2714F]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed
                className="h-5 w-5 text-[#C2714F]"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2714F]">
              Cucina versiliese
            </p>
          </div>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] mb-6"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Gastronomia
          </h2>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12 space-y-6 lg:space-y-0">
            <div className="space-y-5 text-[#636E72] leading-relaxed">
              <p>
                La cucina versiliese è figlia del mare e della campagna
                toscana. Il pescato freschissimo del Tirreno — branzino,
                orata, seppie, gamberi e vongole — incontra la tradizione
                contadina dell&apos;entroterra lucchese in un connubio di sapori
                unico.
              </p>
              <p>
                Sul lungomare e nel centro storico si trovano trattorie di
                famiglia dove le ricette si tramandano da generazioni accanto
                a ristoranti di cucina contemporanea che reinterpretano la
                tradizione con eleganza. La colazione al bar con la
                schiacciata calda e il cappuccino è un rito imprescindibile.
              </p>
            </div>

            <div className="space-y-3">
              {dishes.map((dish) => (
                <div
                  key={dish.name}
                  className="flex gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#E0D8CC]"
                >
                  <div className="w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-[#C2714F] to-[#C2714F]/30 self-stretch" />
                  <div>
                    <p
                      className="font-display text-base font-semibold text-[#2D3436]"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {dish.name}
                    </p>
                    <p className="text-sm text-[#636E72] mt-0.5 leading-snug">
                      {dish.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-[#E0D8CC]" />

      {/* ── Come Arrivare ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-3">
              Logistica
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Come Arrivare
            </h2>
            <p className="mt-3 text-[#636E72] max-w-lg mx-auto">
              Viareggio è ben collegata con le principali città italiane e
              raggiungibile sia in auto che in treno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* In auto */}
            <div className="p-6 bg-white rounded-2xl border border-[#E0D8CC] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8DCC8]/60 rounded-xl flex items-center justify-center">
                  <Car
                    className="h-5 w-5 text-[#2D3436]"
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  className="font-display text-xl font-semibold text-[#2D3436]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  In auto
                </h3>
              </div>
              <div className="space-y-2 text-sm text-[#636E72]">
                <p>
                  Da nord: Autostrada A12 Genova–Livorno, uscita Viareggio.
                </p>
                <p>
                  Da est/Firenze: A11 Firenze–Mare fino a Viareggio, oppure
                  A12 via Pisa.
                </p>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { city: "Firenze", dist: "100 km · ~1h 10min" },
                  { city: "Pisa", dist: "25 km · ~25min" },
                  { city: "Lucca", dist: "30 km · ~30min" },
                  { city: "Milano", dist: "300 km · ~3h" },
                  { city: "Roma", dist: "380 km · ~4h" },
                ].map((item) => (
                  <div
                    key={item.city}
                    className="flex justify-between items-center py-1.5 border-b border-[#E0D8CC] last:border-0"
                  >
                    <span className="font-medium text-[#2D3436] text-sm">
                      {item.city}
                    </span>
                    <span className="text-[#636E72] text-sm">
                      {item.dist}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* In treno */}
            <div className="p-6 bg-white rounded-2xl border border-[#E0D8CC] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8DCC8]/60 rounded-xl flex items-center justify-center">
                  <Train
                    className="h-5 w-5 text-[#2D3436]"
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  className="font-display text-xl font-semibold text-[#2D3436]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  In treno
                </h3>
              </div>
              <div className="space-y-3 text-sm text-[#636E72]">
                <p>
                  La stazione di Viareggio è servita dalla linea
                  Genova–Roma (via Pisa) con collegamenti diretti da
                  Firenze, Pisa e Genova.
                </p>
                <p>
                  Da Milano è possibile prendere un Intercity con cambio a
                  Pisa o La Spezia. Da Roma si sale su treni diretti via
                  Livorno e Pisa.
                </p>
                <p>
                  La stazione si trova a circa{" "}
                  <strong className="text-[#2D3436] font-medium">
                    10 minuti a piedi
                  </strong>{" "}
                  dal mare e vicino al centro. I nostri appartamenti sono
                  raggiungibili in taxi o a piedi.
                </p>
              </div>
              <div className="mt-2 p-3 bg-[#4A90A4]/5 rounded-xl border border-[#4A90A4]/10">
                <p className="text-xs text-[#4A90A4] font-medium">
                  Aeroporto più vicino
                </p>
                <p className="text-sm text-[#636E72] mt-0.5">
                  Pisa (PSA) — 30 minuti in auto o in treno regionale
                  diretto fino a Viareggio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-[#E0D8CC]" />

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#E8DCC8]/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-4">
            Prenota direttamente
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl font-semibold text-[#2D3436] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Vivi la Versilia da vicino
          </h2>
          <p className="text-[#636E72] mb-10 text-lg max-w-xl mx-auto leading-relaxed">
            I nostri appartamenti si trovano a 500 metri dal mare, nel cuore
            di Viareggio. Prenota con noi senza commissioni e parti per la
            tua vacanza ideale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/appartamenti"
              className="inline-flex items-center justify-center bg-[#4A90A4] hover:bg-[#3A7A8E] text-white rounded-full px-10 py-4 text-base font-medium shadow-lg shadow-[#4A90A4]/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Scopri gli appartamenti
            </Link>
            <Link
              href="/chi-siamo"
              className="inline-flex items-center justify-center border border-[#2D3436]/20 text-[#2D3436] hover:bg-[#2D3436]/5 rounded-full px-10 py-4 text-base font-medium transition-all duration-300"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
