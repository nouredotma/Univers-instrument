import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { LanguageProvider } from "@/components/language-provider";
import { CartProvider } from "@/components/cart-provider";
import CartModal from "@/components/cart-modal";
import CookieBanner from "@/components/cookie-banner";
import SplashScreen from "@/components/splash-screen";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://universinstrument.com"),
  title: {
    default:
      "Univers Instrument Service | Professional Scientific & Laboratory Equipment in Morocco",
    template: "%s | Univers Instrument Service",
  },
  description:
    "Univers Instrument — Leading supplier of professional scientific instruments, laboratory equipment, calibration tools, and maintenance services in Agadir, Morocco. Quality equipment for research, industry, and education.",
  keywords: [
    "Univers Instrument Service",
    "Univers Instrument Service",
    "scientific instruments Morocco",
    "laboratory equipment Agadir",
    "calibration tools Morocco",
    "equipment maintenance Agadir",
    "pH meter Morocco",
    "measuring instruments",
    "industrial equipment Morocco",
    "lab equipment supplier",
    "instruments de laboratoire Maroc",
    "équipement scientifique Agadir",
    "matériel de mesure Maroc",
  ],
  authors: [
    {
      name: "Univers Instrument Service",
      url: "https://universinstrument.com",
    },
  ],
  creator: "Univers Instrument Service",
  publisher: "Univers Instrument Service",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  category: "Scientific Equipment",
  classification: "Scientific Instruments & Laboratory Equipment Supplier",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Univers Instrument Service | Professional Scientific & Laboratory Equipment",
    description:
      "Leading supplier of professional scientific instruments, laboratory equipment, calibration tools, and maintenance services in Agadir, Morocco.",
    url: "https://universinstrument.com",
    siteName: "Univers Instrument Service",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Univers Instrument Service — Scientific & Laboratory Equipment in Morocco",
        type: "image/jpeg",
      },
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Univers Instrument Service Logo",
      },
    ],
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_MA"],
    type: "website",
    countryName: "Morocco",
  },
  twitter: {
    card: "summary_large_image",
    title: "Univers Instrument Service | Scientific & Laboratory Equipment",
    description:
      "Leading supplier of professional scientific instruments, laboratory equipment, and maintenance services in Agadir, Morocco.",
    images: ["/og-image.jpg"],
    creator: "@universinstrument",
    site: "@universinstrument",
  },
  alternates: {
    canonical: "https://universinstrument.com",
    languages: {
      "en-US": "https://universinstrument.com",
      "fr-FR": "https://universinstrument.com/fr",
      "ar-MA": "https://universinstrument.com/ar",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  other: {
    "geo.region": "MA-AGD",
    "geo.placename": "Agadir",
    "geo.position": "30.427755;-9.598107",
    ICBM: "30.427755, -9.598107",
  },
};

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "Store"],
      "@id": "https://universinstrument.com/#organization",
      name: "Univers Instrument Service",
      url: "https://universinstrument.com",
      logo: {
        "@type": "ImageObject",
        url: "https://universinstrument.com/favicon.png",
        width: 512,
        height: 512,
      },
      image: "https://universinstrument.com/og-image.jpg",
      description:
        "Univers Instrument Service — Leading supplier of professional scientific instruments, laboratory equipment, calibration tools, and maintenance services in Agadir, Morocco.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bloc B, N 255 Hay assaka Tikiouine",
        addressLocality: "Agadir",
        addressRegion: "Souss-Massa",
        postalCode: "80000",
        addressCountry: "MA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 30.427755,
        longitude: -9.598107,
      },
      telephone: "+212666166945",
      email: "uis.instruments@gmail.com",
      priceRange: "$$",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "08:00",
          closes: "18:00",
        },
      ],
      sameAs: [
        "https://www.facebook.com/universinstrument/",
        "https://www.linkedin.com/in/univers-instrument-service-b81575267/",
      ],
      areaServed: {
        "@type": "Country",
        name: "Morocco",
      },
      knowsLanguage: ["en", "fr", "ar"],
    },
    {
      "@type": "WebSite",
      "@id": "https://universinstrument.com/#website",
      url: "https://universinstrument.com",
      name: "Univers Instrument",
      description:
        "Professional scientific instruments, laboratory equipment, and maintenance services in Morocco",
      publisher: {
        "@id": "https://universinstrument.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://universinstrument.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: ["en-US", "fr-FR", "ar-MA"],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://universinstrument.com/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://universinstrument.com",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="loading-lock" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources for performance */}
        <link
          rel="preconnect"
          href="https://fonts.cdnfonts.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.cdnfonts.com" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#c4a47c" />
        <meta name="msapplication-TileColor" content="#c4a47c" />

        {/* Additional SEO meta tags */}
        <meta name="application-name" content="Univers Instrument Service" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Univers Instrument Service" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <SplashScreen />
        <LanguageProvider>
          <CartProvider>
            {children}
            <CartModal />
            <CookieBanner />
          </CartProvider>
        </LanguageProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
