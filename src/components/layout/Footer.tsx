"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUp, Mail, Phone } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { site } from "@/lib/site";
import { LinkedInIcon, Logo, WhatsAppIcon } from "@/components/ui/Icons";

const noop = () => () => {};

export default function Footer() {
  const { locale, t } = useLocale();
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => 2026,
  );

  const scrollTop = () => {
    const lenis = window.__portfolioLenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border">
      <div className="container-lg flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-11 w-11 text-sm" />
          <div className="leading-tight">
            <p className="font-bold">{site.name}</p>
            <p className="text-sm text-muted-foreground">{t.footer.role}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${site.email}`}
            className="chip hover:border-primary hover:text-foreground"
          >
            <Mail size={14} /> {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="chip hover:border-primary hover:text-foreground"
          >
            <Phone size={14} /> {site.phone}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="chip hover:border-primary hover:text-foreground"
          >
            <LinkedInIcon className="h-3.5 w-3.5" /> LinkedIn
          </a>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="chip hover:border-primary hover:text-foreground"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
          </a>
        </div>
      </div>

      <div className="container-lg flex flex-col gap-4 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. {t.footer.rights}
        </p>
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/contact`} className="hover:text-foreground">
            {t.nav.contact}
          </Link>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            {t.footer.top} <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
