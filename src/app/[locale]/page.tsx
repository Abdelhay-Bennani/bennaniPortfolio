import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import {
  Approach,
  Cta,
  ExperiencePreview,
  Expertise,
  Faq,
  Hero,
  Intro,
  Local,
  Selection,
  Stack,
} from "@/components/sections/home";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  return (
    <div className="container-lg">
      <Hero t={t} locale={locale} />
      <Intro t={t} locale={locale} />
      <Expertise t={t} locale={locale} />
      <Approach t={t} locale={locale} />
      <Selection t={t} locale={locale} />
      <Stack t={t} locale={locale} />
      <ExperiencePreview t={t} locale={locale} />
      <Faq t={t} locale={locale} />
      <Local t={t} locale={locale} />
      <Cta t={t} locale={locale} />
    </div>
  );
}
