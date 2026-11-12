import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { site } from "@/lib/site";
import ScrollReveal from "@/components/scene/ScrollReveal";
import ContactForm from "@/components/ui/ContactForm";
import { LinkedInIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Faq, Local } from "@/components/sections/home";
import { buildAlternates } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const safe = isLocale(locale) ? locale : "fr";
  const t = getMessages(safe);
  return {
    title: t.meta.contactTitle,
    description: t.meta.contactDescription,
    alternates: buildAlternates(`/${safe}/contact`),
  };
}

export default async function ContactPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  const channels = [
    {
      label: t.contact.email,
      value: site.email,
      href: `mailto:${site.email}`,
      icon: <Mail size={20} />,
      external: false,
    },
    {
      label: t.contact.phone,
      value: site.phone,
      href: site.phoneHref,
      icon: <Phone size={20} />,
      external: false,
    },
    {
      label: t.contact.whatsapp,
      value: site.phone,
      href: site.whatsapp,
      icon: <WhatsAppIcon className="h-5 w-5" />,
      external: true,
    },
    {
      label: t.contact.linkedin,
      value: "abdelhay-bennani",
      href: site.linkedin,
      icon: <LinkedInIcon className="h-5 w-5" />,
      external: true,
    },
  ];

  return (
    <div className="container-lg">
      <section className="mb-16 max-w-[900px] pt-4 md:mb-24 md:pt-8">
        <span className="eyebrow">{t.contact.eyebrow}</span>
        <ScrollReveal
          as="h1"
          mode="enter"
          splitBy="words"
          effect="rise"
          baseOpacity={0}
          baseOffset={30}
          enableBlur
          blurStrength={3}
          stagger={0.05}
          containerClassName="page-title-reveal"
        >
          {t.contact.title}
        </ScrollReveal>
        <p className="max-w-[680px] text-lg leading-[1.7] text-muted-foreground">
          {t.contact.description}
        </p>
      </section>

      <section className="mb-24 grid gap-8 md:mb-40 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className="card group flex items-center gap-4 p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                {channel.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                  {channel.label}
                </span>
                <span className="block truncate font-medium" dir="ltr">
                  {channel.value}
                </span>
              </span>
            </a>
          ))}
        </div>
        <ContactForm />
      </section>

      <Local t={t} locale={locale} />
      <Faq t={t} locale={locale} />
    </div>
  );
}
