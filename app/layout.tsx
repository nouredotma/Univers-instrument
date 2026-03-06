import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { LanguageProvider } from "@/components/language-provider";
import CookieBanner from "@/components/cookie-banner";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://univers-instrument-service.com"),
  title: {
    default:
      "Univers Instrument Service | Equipment & Maintenance",
    template: "%s | Univers Instrument Service",
  },
  description:
    "Univers Instrument Service - Your trusted partner for equipment and maintenance services in Agadir, Morocco.",
  keywords: [
    "Univers Instrument Service",
    "equipment maintenance",
    "Agadir",
    "Morocco",
    "instrument service",
  ],
  authors: [
    {
      name: "Univers Instrument Service",
      url: "https://univers-instrument-service.com",
    },
  ],
  creator: "Univers Instrument Service",
  publisher: "Univers Instrument Service",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  category: "Travel",
  classification: "Travel Agency",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/logo.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Univers Instrument Service",
    description:
      "Univers Instrument Service - Your trusted partner for equipment and maintenance services in Agadir, Morocco.",
    url: "https://univers-instrument-service.com",
    siteName: "Univers Instrument Service",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Univers Instrument Service",
        type: "image/jpeg",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Univers Instrument Service Logo",
      },
    ],
    locale: "en_US",
    type: "website",
    countryName: "Morocco",
  },
  twitter: {
    card: "summary_large_image",
    title: "Univers Instrument Service",
    description:
      "Univers Instrument Service - Your trusted partner for equipment and maintenance services in Agadir, Morocco.",
    images: ["/og-image.jpg"],
    creator: "@universinstrument",
    site: "@universinstrument",
  },
  alternates: {
    canonical: "https://univers-instrument-service.com",
    languages: {
      "en-US": "https://univers-instrument-service.com",
      "fr-FR": "https://univers-instrument-service.com/fr",
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
    "geo.region": "MA",
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
      "@type": "Organization",
      "@id": "https://univers-instrument-service.com/#organization",
      name: "Univers Instrument Service",
      url: "https://univers-instrument-service.com",
      logo: {
        "@type": "ImageObject",
        url: "https://univers-instrument-service.com/logo.png",
        width: 512,
        height: 512,
      },
      image: "https://univers-instrument-service.com/og-image.jpg",
      description:
        "Univers Instrument Service - Your trusted partner for equipment and maintenance services in Agadir, Morocco.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bloc B, N 255 Hay assaka Tikiouine",
        addressLocality: "Agadir",
        addressRegion: "Agadir",
        postalCode: "80000",
        addressCountry: "MA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 30.427755,
        longitude: -9.598107,
      },
      telephone: "0666-166945",
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
    },
    {
      "@type": "WebSite",
      "@id": "https://univers-instrument-service.com/#website",
      url: "https://univers-instrument-service.com",
      name: "Univers Instrument Service",
      description: "Univers Instrument Service",
      publisher: {
        "@id": "https://univers-instrument-service.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://univers-instrument-service.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://univers-instrument-service.com/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://univers-instrument-service.com",
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
    <html lang="en" suppressHydrationWarning>
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

        {/* Custom fonts */}
        <link
          href="https://fonts.cdnfonts.com/css/urwclassico?display=swap"
          rel="stylesheet"
        />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#c4a47c" />
        <meta name="msapplication-TileColor" content="#c4a47c" />

        {/* Additional SEO meta tags */}
        <meta name="application-name" content="Univers Instrument Service" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Univers Instrument" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
