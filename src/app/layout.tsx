import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://viareggiohomes.it'),
  title: {
    default: 'Appartamenti Vacanza a Viareggio — Viareggio Homes',
    template: '%s | Viareggio Homes',
  },
  description: 'Appartamenti vacanza a Viareggio sul mare della Versilia. Prenotazione diretta senza commissioni: Il Nido, La Pineta, Il Veliero.',
  keywords: [
    'appartamento vacanza Viareggio',
    'mare Versilia',
    'prenotazione diretta',
    'affitto vacanze Viareggio',
    'appartamenti Versilia',
  ],
  authors: [{ name: 'Viareggio Homes' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Viareggio Homes',
    title: 'Appartamenti Vacanza a Viareggio — Viareggio Homes',
    description: 'Appartamenti vacanza a Viareggio sul mare della Versilia. Prenotazione diretta senza commissioni.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${cormorant.variable} ${dmSans.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-34DCVPETBT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-34DCVPETBT');
          `}
        </Script>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
