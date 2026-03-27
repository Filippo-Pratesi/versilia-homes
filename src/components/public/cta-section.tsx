"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#E8DCC8]/30">
      <div className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-4"
        >
          Pronti a partire?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl font-semibold text-[#2D3436] mb-4 leading-tight"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          La tua estate in Versilia ti aspetta
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#636E72] mb-10 text-lg"
        >
          Prenota direttamente con noi e risparmia. Ti risponderemo entro 24
          ore.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/appartamenti"
            className="inline-flex items-center justify-center bg-[#4A90A4] hover:bg-[#3A7A8E] text-white rounded-full px-10 py-4 text-base font-medium shadow-lg shadow-[#4A90A4]/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Vedi gli appartamenti
          </Link>
          <Link
            href="/chi-siamo"
            className="inline-flex items-center justify-center border border-[#2D3436]/20 text-[#2D3436] hover:bg-[#2D3436]/5 rounded-full px-10 py-4 text-base font-medium transition-all duration-300"
          >
            Contattaci
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
