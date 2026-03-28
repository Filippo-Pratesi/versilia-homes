import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { blogPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Viareggio Homes",
  description:
    "Guida a Viareggio e alla Versilia: cosa fare, dove andare, consigli di viaggio per la tua vacanza al mare in Toscana.",
};

export default function BlogPage() {
  return (
    <div className="bg-[#FAFAF8]">
      {/* ── Header ── */}
      <section className="relative py-20 sm:py-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden bg-[#2D3436]">
        <Image
          src="/images/blog/blog-hero.jpg"
          alt="Guida alla Versilia"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(250,250,248,0.82) 0%, rgba(232,220,200,0.70) 40%, rgba(224,239,243,0.65) 100%)",
          }}
        />
        <div className="relative z-[2] max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-4">
            Guida alla Versilia
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#2D3436] leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Il Blog
          </h1>
          <p className="mt-5 text-lg text-[#636E72] max-w-2xl mx-auto leading-relaxed">
            Consigli di viaggio, guide locali e tutto quello che devi sapere per
            vivere al meglio la tua vacanza a Viareggio e nella Versilia.
          </p>
        </div>
      </section>

      {/* ── Articles grid ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-[#E0D8CC] overflow-hidden hover:border-[#4A90A4]/30 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Cover image */}
                <div className="relative w-full h-52 bg-[#E8DCC8]/40 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 gap-3">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-[#636E72]">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span className="text-[#E0D8CC]">·</span>
                    <span>{post.readingTime} min di lettura</span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-display text-xl font-semibold text-[#2D3436] leading-snug"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-[#636E72] leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  {/* CTA link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4A90A4] hover:text-[#3A7A8E] transition-colors mt-2 group"
                  >
                    Leggi l&apos;articolo
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#E8DCC8]/30 border-t border-[#E0D8CC]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-4">
            Prenota direttamente
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl font-semibold text-[#2D3436] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Soggiorna a Viareggio
          </h2>
          <p className="text-[#636E72] mb-10 text-lg max-w-xl mx-auto leading-relaxed">
            I nostri appartamenti si trovano a 500 metri dal mare, nel cuore di
            Viareggio. Prenota senza commissioni e parti per la tua vacanza
            ideale.
          </p>
          <Link
            href="/appartamenti"
            className="inline-flex items-center justify-center bg-[#4A90A4] hover:bg-[#3A7A8E] text-white rounded-full px-10 py-4 text-base font-medium shadow-lg shadow-[#4A90A4]/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Scopri gli appartamenti
          </Link>
        </div>
      </section>
    </div>
  );
}
