import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { experiences, skills } from "@/lib/data";
import ScrollReveal from "@/components/scene/ScrollReveal";
import { Section } from "@/components/ui/Section";
import {
  Cta,
  EducationBlock,
  Stats,
  Timeline,
} from "@/components/sections/home";
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
    title: t.meta.aboutTitle,
    description: t.meta.aboutDescription,
    alternates: buildAlternates(`/${safe}/about`),
  };
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  return (
    <div className="container-lg">
      <section className="mb-16 max-w-[900px] pt-4 md:mb-24 md:pt-8">
        <span className="eyebrow">{t.about.eyebrow}</span>
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
          {t.about.title}
        </ScrollReveal>
        <div className="mt-6 flex max-w-[760px] flex-col gap-4">
          {t.about.paragraphs.map((paragraph) => (
            <ScrollReveal
              key={paragraph}
              as="p"
              mode="scrub"
              splitBy="words"
              effect="rise"
              highlightColor="var(--primary)"
              baseOpacity={0.12}
              baseOffset={20}
              enableBlur
              blurStrength={3}
              stagger={0.06}
              smoothing={0.45}
              containerClassName="introduction-reveal"
            >
              {paragraph}
            </ScrollReveal>
          ))}
        </div>
        <Link
          href={`/${locale}/contact`}
          className="btn btn-primary mt-8 inline-flex"
        >
          {t.about.cta} <ArrowRight size={16} />
        </Link>
      </section>

      <Stats t={t} locale={locale} />

      <Section eyebrow={t.stack.eyebrow} title={t.about.skillsTitle}>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="chip text-sm">
              {skill}
            </span>
          ))}
        </div>
      </Section>

      <Section eyebrow={t.experience.eyebrow} title={t.experience.title} maxWidth={820}>
        <Timeline items={experiences} locale={locale} />
      </Section>

      <EducationBlock t={t} locale={locale} />
      <Cta t={t} locale={locale} />
    </div>
  );
}
