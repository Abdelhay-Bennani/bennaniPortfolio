"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Mail, Menu, Moon, Phone, Sun, UserRound, X } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { locales, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";
import { useTheme } from "./ThemeProvider";
import { Logo, WhatsAppIcon } from "@/components/ui/Icons";

const localeLabels: Record<Locale, string> = { fr: "FR", en: "EN", ar: "ع" };

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(fr|en|ar)(?=\/|$)/, "") || "";
}

function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const rest = stripLocale(pathname);
  return (
    <nav aria-label={t.nav.language} className="flex items-center gap-0.5">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          onClick={() => {
            document.cookie = `locale=${l}; path=/; max-age=31536000; samesite=lax`;
          }}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-md px-2 py-1 text-xs font-bold transition ${
            l === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/15 hover:text-foreground"
          } ${compact ? "h-7 min-w-7 text-center" : ""}`}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </nav>
  );
}

function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { t } = useLocale();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.theme}
      title={t.nav.theme}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary ${className}`.trim()}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

export default function Header() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const base = `/${locale}`;

  const links = [
    { href: base, label: t.nav.home, icon: Home },
    { href: `${base}/about`, label: t.nav.about, icon: UserRound },
    { href: `${base}/contact`, label: t.nav.contact, icon: Mail },
  ];

  const isActive = (href: string) =>
    href === base ? pathname === base : pathname.startsWith(href);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  return (
    <>
      <div className="h-[76px] w-full md:h-24" aria-hidden="true" />
      <div className="fixed inset-x-0 top-0 z-40 h-[76px] border-b border-glass-border bg-background/40 backdrop-blur-xl md:h-24" />

      <Link
        href={base}
        className="fixed start-4 top-3 z-50 flex h-14 items-center gap-3 md:top-4 md:h-16"
        aria-label={site.name}
      >
        <Logo className="h-11 w-11 text-sm shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_25%,transparent)]" />
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-sm font-bold tracking-tight">{site.name}</span>
          <span className="text-[11px] text-muted-foreground">
            {t.footer.role}
          </span>
        </span>
      </Link>

      {/* Desktop navigation */}
      <div className="glass fixed end-4 top-4 z-50 hidden h-16 items-center gap-4 rounded-2xl px-4 shadow-2xl shadow-black/20 md:flex">
        <LanguageSwitcher />
        <span className="h-8 w-px bg-border" aria-hidden="true" />
        <nav className="flex items-end gap-4" aria-label={t.nav.menu}>
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className="group flex flex-col items-center gap-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_28%,transparent)]"
                      : "bg-muted text-foreground group-hover:bg-primary/20"
                  }`}
                >
                  <Icon size={17} />
                </span>
                {label}
              </Link>
            );
          })}
          <a
            href={site.phoneHref}
            className="group flex flex-col items-center gap-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground transition group-hover:bg-primary/20">
              <Phone size={17} />
            </span>
            {t.nav.call}
          </a>
        </nav>
        <span className="h-8 w-px bg-border" aria-hidden="true" />
        <ThemeToggle />
        <a
          href={`${site.whatsapp}?text=${encodeURIComponent(t.nav.whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.nav.whatsapp}
          title={t.nav.whatsapp}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-105"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </div>

      {/* Mobile top pill */}
      <div className="glass fixed end-4 top-3.5 z-50 flex items-center gap-1 rounded-xl p-1.5 shadow-lg md:hidden">
        <LanguageSwitcher compact />
        <ThemeToggle className="h-7 w-7 border-0" />
      </div>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t.nav.menu}
        className="fixed bottom-4 end-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-soft bg-primary text-primary-foreground shadow-xl shadow-black/40 md:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <nav
          aria-label={t.nav.menu}
          className="glass fixed bottom-20 end-4 z-50 flex w-56 flex-col gap-1 rounded-2xl p-2 shadow-2xl md:hidden"
        >
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(href)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/15"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
          <a
            href={site.phoneHref}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-primary/15"
          >
            <Phone size={17} />
            {t.nav.call}
          </a>
        </nav>
      )}
    </>
  );
}
