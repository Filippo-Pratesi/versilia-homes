"use client";

import { motion } from "framer-motion";
import { PiggyBank, Smartphone, Home } from "lucide-react";

const items = [
  {
    icon: PiggyBank,
    title: "Risparmia le commissioni",
    description:
      "Airbnb prende fino al 20% del tuo soggiorno. Qui paghi solo l'affitto, senza costi aggiuntivi.",
  },
  {
    icon: Smartphone,
    title: "Contatto diretto con i proprietari",
    description:
      "Risposte rapide via WhatsApp e email. Nessun chatbot, nessuna attesa — parli con noi direttamente.",
  },
  {
    icon: Home,
    title: "Massima flessibilità",
    description:
      "Accordi personalizzati su orari di check-in, animali domestici e ogni esigenza speciale.",
  },
];

export function WhyBookDirect() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-3"
          >
            Prenota con noi
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-semibold text-[#2D3436]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Perché prenotare direttamente?
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                  ease: "easeOut",
                }}
                className="relative p-6 rounded-2xl bg-[#FAFAF8] border border-[#E0D8CC] border-l-4 border-l-[#C2714F] hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-4 w-11 h-11 rounded-xl bg-[#E8DCC8]/60 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#C2714F]" strokeWidth={1.5} />
                </div>
                <h3
                  className="font-display text-xl font-semibold text-[#2D3436] mb-2"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-[#636E72] leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
