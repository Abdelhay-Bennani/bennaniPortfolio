"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/Icons";

export default function WhatsAppButton() {
  const { t } = useLocale();
  return (
    <a
      href={`${site.whatsapp}?text=${encodeURIComponent(t.nav.whatsapp)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.nav.whatsapp}
      title={t.nav.whatsapp}
      className="fixed bottom-4 start-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-black/40 transition-transform hover:scale-110 md:bottom-6 md:start-auto md:end-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
