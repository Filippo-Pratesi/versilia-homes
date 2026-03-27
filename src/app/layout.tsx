import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://versiliahomes.it'),
  title: {
    default: 'Vacanze in Versilia — Appartamenti a Viareggio',
    template: '%s | Versilia Homes',
  },
  description: 'Prenota direttamente i tuoi appartamenti vacanza a Viareggio, Versilia. A pochi passi dal mare. Contatto diretto con i proprietari, senza commissioni Airbnb.',
  keywords: ['appartamenti viareggio', 'vacanze versilia', 'affitto mare viareggio', 'versilia homes', 'prenotazione diretta'],
  authors: [{ name: 'Versilia Homes' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Versilia Homes',
    title: 'Vacanze in Versilia — Appartamenti a Viareggio',
    description: 'Appartamenti vacanza a Viareggio, a pochi passi dal mare della Versilia.',
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
