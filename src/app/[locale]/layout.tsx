import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "../globals.css";
import {
  isLocale,
  localeDirection,
  locales,
  type Locale,
} from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { ThemeProvider, themeScript } from "@/components/layout/ThemeProvider";
import SmoothScrollScene from "@/components/scene/SmoothScrollScene";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { site } from "@/lib/site";
import { skills } from "@/lib/data";
import { buildAlternates } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

type Params = Promise<{ locale: string }>;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const safe: Locale = isLocale(locale) ? locale : "fr";
  const t = getMessages(safe);
  return {
    metadataBase: new URL(site.url),
    title: {
      default: t.meta.title,
      template: `%s · ${site.name}`,
    },
    description: t.meta.description,
    keywords: [
      "Développeur WordPress",
      "Développeur Web",
      "Full Stack",
      "Freelance",
      "Maroc",
      "WooCommerce",
      "PrestaShop",
      "Oktopus CMS",
      "PHP",
    ],
    alternates: buildAlternates(`/${safe}`),
    icons: { icon: "/icon.svg" },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      locale: safe === "fr" ? "fr_FR" : safe === "en" ? "en_US" : "ar_MA",
      url: `${site.url}/${safe}`,
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  const dir = localeDirection[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        jobTitle: t.footer.role,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        address: { "@type": "PostalAddress", addressCountry: site.country },
        knowsAbout: skills,
        sameAs: [site.linkedin],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#business`,
        name: site.name,
        url: site.url,
        description: t.meta.description,
        founder: { "@id": `${site.url}/#person` },
        email: site.email,
        telephone: site.phone,
        address: { "@type": "PostalAddress", addressCountry: site.country },
        areaServed: [{ "@type": "Country", name: "Morocco" }, "Worldwide"],
        availableLanguage: ["fr", "en", "ar"],
      },
    ],
  };

  return (
    <html
      lang={locale}
      dir={dir}
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#060606" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <LocaleProvider locale={locale} messages={t}>
            <SmoothScrollScene>
              <Header />
              <main className="page-glow min-h-screen w-full max-w-[100vw] overflow-x-clip py-2 md:py-4">
                {children}
              </main>
              <Footer />
            </SmoothScrollScene>
            <WhatsAppButton />
          </LocaleProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
