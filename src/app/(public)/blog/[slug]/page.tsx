import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { blogPosts, getBlogPost, formatDate } from "@/lib/blog";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Articolo non trovato | Viareggio Homes" };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      images: [{ url: post.coverImage }],
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#FAFAF8]">
      {/* ── Back link ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[#636E72] hover:text-[#4A90A4] transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Torna al blog
        </Link>
      </div>

      {/* ── Article header ── */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#636E72] mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#4A90A4]" strokeWidth={1.5} />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span className="text-[#E0D8CC]">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#4A90A4]" strokeWidth={1.5} />
            {post.readingTime} min di lettura
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2D3436] leading-tight"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="mt-5 text-lg text-[#636E72] leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* ── Cover image ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-[#E8DCC8]/40">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      </div>

      {/* ── Article body ── */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            color: "#636E72",
            lineHeight: "1.8",
            fontSize: "1.0625rem",
          }}
        />
      </article>

      {/* ── CTA section ── */}
      <section className="border-t border-[#E0D8CC] bg-[#E8DCC8]/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-4">
            Prenota direttamente
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Soggiorna a Viareggio
          </h2>
          <p className="text-[#636E72] mb-8 max-w-xl mx-auto leading-relaxed">
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

      {/* Prose styles */}
      <style>{`
        .blog-prose h2 {
          font-family: var(--font-cormorant);
          font-size: 1.75rem;
          font-weight: 600;
          color: #2D3436;
          margin-top: 2.5rem;
          margin-bottom: 0.875rem;
          line-height: 1.3;
        }
        .blog-prose h3 {
          font-family: var(--font-cormorant);
          font-size: 1.375rem;
          font-weight: 600;
          color: #2D3436;
          margin-top: 2rem;
          margin-bottom: 0.625rem;
          line-height: 1.3;
        }
        .blog-prose p {
          margin-bottom: 1.25rem;
        }
        .blog-prose ul {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
          list-style: none;
        }
        .blog-prose ul li {
          position: relative;
          padding-left: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .blog-prose ul li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #4A90A4;
        }
        .blog-prose strong {
          color: #2D3436;
          font-weight: 600;
        }
        .blog-prose em {
          font-style: italic;
          color: #2D3436;
        }
      `}</style>
    </div>
  );
}
