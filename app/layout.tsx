import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Lora } from "next/font/google";
import { Montserrat } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DandiyaPopup from "@/components/DandiyaPopup";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://indiaclubgt.com";
const SITE_NAME = "India Club @ Georgia Tech";
const SITE_DESCRIPTION =
  "India Club at Georgia Tech (ICGT) is a student community celebrating Indian culture through Holi, Diwali, Garba, and more. Explore our events, get involved, and meet the board.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | India Club @ GT",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "India Club",
    "India Club GT",
    "GT India Club",
    "Georgia Tech India Club",
    "India Club Georgia Tech",
    "India Club at Georgia Tech",
    "ICGT",
    "Georgia Tech",
    "Indian culture",
    "Indian student organization",
    "Indian student association Georgia Tech",
    "Holi",
    "Diwali",
    "Garba",
    "Atlanta",
    "GT student org",
  ],
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization + WebSite structured data (schema.org / JSON-LD) for rich results.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: [
        "India Club @ GT",
        "ICGT",
        "India Club GT",
        "GT India Club",
        "Georgia Tech India Club",
        "India Club Georgia Tech",
        "India Club at Georgia Tech",
      ],
      url: SITE_URL,
      logo: `${SITE_URL}/images/IClogo.png`,
      email: "info@indiaclub.gatech.edu",
      sameAs: [
        "https://www.instagram.com/indiaclub_gt/",
        "https://www.tiktok.com/@indiaclub_gt",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${montserrat.variable} ${playfair.variable} ${raleway.variable} min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <DandiyaPopup />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
