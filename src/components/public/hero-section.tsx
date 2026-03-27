"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

const words = ["Appartamenti", "Vacanza", "a", "Viareggio"];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

const subVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: 0.6 },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.9 },
  },
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden public-hero-bg"
    >
      {/* Parallax content wrapper */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto"
        style={{ y: yParallax, opacity: opacityFade }}
      >
        {/* Radial glow orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle at center, rgba(74,144,164,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle at center, rgba(232,220,200,0.6) 0%, transparent 70%)",
          }}
        />

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4]"
        >
          Viareggio · Versilia
        </motion.p>

        {/* Word-by-word animated headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#2D3436] leading-tight tracking-tight mb-6"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className={`inline-block mr-[0.25em] ${
                word === "Viareggio"
                  ? "bg-gradient-to-r from-[#C2714F] to-[#4A90A4] bg-clip-text text-transparent"
                  : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={subVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-lg sm:text-xl text-[#636E72] max-w-xl leading-relaxed mb-10"
        >
          A pochi passi dal mare della Versilia. Prenota direttamente, senza
          intermediari.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/appartamenti"
            className="inline-flex items-center justify-center bg-[#4A90A4] hover:bg-[#3A7A8E] text-white rounded-full px-8 py-4 text-base font-medium shadow-lg shadow-[#4A90A4]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#4A90A4]/30 hover:-translate-y-0.5"
          >
            Scopri gli appartamenti
          </Link>
          <Link
            href="/chi-siamo"
            className="inline-flex items-center justify-center border border-[#2D3436]/20 text-[#2D3436] hover:bg-[#2D3436]/5 rounded-full px-8 py-4 text-base font-medium transition-all duration-300"
          >
            Contattaci
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll-down arrow */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-[#636E72] cursor-default"
        >
          <span className="text-xs tracking-widest uppercase opacity-60">
            Scorri
          </span>
          <ChevronDown className="h-5 w-5 opacity-60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
