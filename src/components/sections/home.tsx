import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code,
  Gauge,
  MapPin,
  Palette,
  ShoppingCart,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/get-messages";
import {
  education,
  experiences,
  languages,
  projects,
  skills,
  stats,
  type Experience,
} from "@/lib/data";
import { site } from "@/lib/site";
import NameCanvas from "@/components/scene/NameCanvas";
import ScrollReveal from "@/components/scene/ScrollReveal";
import Accordion from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";

type SectionProps = { t: Messages; locale: Locale };

const containImages = new Set(["/projects/axilum.png", "/projects/barji-net.svg"]);

function HeroTitle({
  start,
  highlight,
  end,
}: {
  start: string;
  highlight: string;
  end: string;
}) {
  const parts = [
    { text: start, gold: false },
    { text: highlight, gold: true },
    { text: end, gold: false },
  ];
  const nodes: ReactNode[] = [];
  let index = 0;
  parts.forEach((part) => {
    part.text.split(" ").forEach((word) => {
      if (nodes.length) nodes.push(" ");
      nodes.push(
        <span className="hero-word" key={index} aria-hidden="true">
          <span
            className={`hero-word-inner${part.gold ? " hero-gold" : ""}`}
            style={{ "--i": index } as CSSProperties}
          >
            {word}
          </span>
        </span>,
      );
      index++;
    });
  });
  return (
    <h1
      aria-label={`${start} ${highlight} ${end}`}
      className="mb-5 text-[2.6rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[3.2rem] md:text-[4.5rem]"
    >
      {nodes}
    </h1>
  );
}

export function Hero({ t, locale }: SectionProps) {
  return (
    <section className="mb-24 max-w-[900px] pt-4 md:mb-40 md:pt-8">
      <div className="mb-3 h-[82px] w-full text-foreground md:h-[108px]">
        <NameCanvas text={site.short} />
      </div>
      <span className="chip-primary mb-4">{t.hero.eyebrow}</span>
      <HeroTitle
        start={t.hero.titleStart}
        highlight={t.hero.titleHighlight}
        end={t.hero.titleEnd}
      />
      <p className="mb-8 max-w-[680px] text-lg leading-[1.7] text-muted-foreground">
        {t.hero.description}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`/${locale}/contact`} className="btn btn-primary">
          {t.hero.cta} <ArrowRight size={16} />
        </Link>
        <a href="#projects" className="btn btn-outline">
          {t.hero.secondary}
        </a>
      </div>
    </section>
  );
}

export function Intro({ t }: SectionProps) {
  return (
    <section className="mb-24 max-w-[820px] md:mb-40">
      <span className="eyebrow">{t.intro.eyebrow}</span>
      <ScrollReveal
        as="h2"
        mode="scrub"
        splitBy="words"
        effect="rise"
        baseOpacity={0.12}
        baseOffset={24}
        enableBlur
        blurStrength={2}
        stagger={0.08}
        smoothing={0.45}
        containerClassName="introduction-title-reveal"
        textClassName="introduction-title-text"
      >
        {t.intro.title}
      </ScrollReveal>
      {t.intro.paragraphs.map((paragraph) => (
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
    </section>
  );
}

export function Expertise({ t, locale }: SectionProps) {
  const cards = [
    { key: "design", icon: Palette },
    { key: "development", icon: Code },
    { key: "ecommerce", icon: ShoppingCart },
    { key: "seo", icon: Gauge },
  ] as const;
  return (
    <Section eyebrow={t.expertise.eyebrow} title={t.expertise.title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ key, icon: Icon }) => (
          <Link
            key={key}
            href={`/${locale}/contact`}
            className="card group flex flex-col gap-4 p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon size={20} />
            </span>
            <h3 className="text-lg font-semibold">
              {t.expertise.cards[key].title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.expertise.cards[key].description}
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
              {t.hero.cta} <ArrowUpRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function Approach({ t }: SectionProps) {
  return (
    <Section eyebrow={t.approach.eyebrow} title={t.approach.title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.approach.steps.map((step, index) => (
          <div key={step.title} className="card p-6">
            <span className="font-mono text-3xl font-bold text-gold">
              0{index + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Selection({ t, locale }: SectionProps) {
  return (
    <Section id="projects" eyebrow={t.selection.eyebrow} title={t.selection.title}>
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project, index) => (
          <article key={project.slug} className="card group flex flex-col overflow-hidden">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-[16/9] overflow-hidden bg-muted"
            >
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                unoptimized={project.image.endsWith(".svg")}
                className={`transition duration-500 group-hover:scale-[1.03] ${
                  containImages.has(project.image)
                    ? "object-contain p-8"
                    : "object-cover object-top"
                }`}
              />
              <span className="absolute start-3 top-3 rounded-full bg-background/70 px-2 py-0.5 font-mono text-[11px] text-foreground backdrop-blur">
                {String(index + 1).padStart(2, "0")}
              </span>
            </a>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-xs uppercase tracking-wider text-primary">
                  {project.category[locale]}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.description[locale]}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary hover:underline"
              >
                {t.selection.view} <ArrowUpRight size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Stack({ t }: SectionProps) {
  const doubled = [...skills, ...skills];
  return (
    <Section eyebrow={t.stack.eyebrow} title={t.stack.title}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {skills.map((skill, index) => (
          <div key={skill} className="card flex items-center gap-3 px-4 py-3">
            <span className="font-mono text-xs text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-medium">{skill}</span>
          </div>
        ))}
      </div>
      <div
        className="mt-8 overflow-hidden border-y border-border py-3"
        aria-hidden="true"
      >
        <div className="marquee gap-8 whitespace-nowrap text-sm font-medium text-muted-foreground">
          {doubled.map((skill, index) => (
            <span key={`${skill}-${index}`} className="inline-flex items-center gap-8">
              {skill} <span className="text-primary">·</span>
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Timeline({
  items,
  locale,
}: {
  items: Experience[];
  locale: Locale;
}) {
  return (
    <ol className="timeline flex flex-col gap-8">
      {items.map((item, index) => (
        <li key={`${item.company}-${index}`} className="relative">
          <span className="timeline-dot" aria-hidden="true" />
          <p className="font-mono text-xs text-primary">{item.period[locale]}</p>
          <h3 className="mt-1 text-lg font-semibold">{item.company}</h3>
          <p className="text-sm text-muted-foreground">{item.role[locale]}</p>
          <ul className="mt-3 flex list-disc flex-col gap-1 ps-4 text-sm leading-relaxed text-muted-foreground marker:text-primary">
            {item.bullets[locale].map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function ExperiencePreview({ t, locale }: SectionProps) {
  return (
    <Section eyebrow={t.experience.eyebrow} title={t.experience.title} maxWidth={820}>
      <Timeline items={experiences.slice(0, 3)} locale={locale} />
      <Link
        href={`/${locale}/about`}
        className="btn btn-outline mt-8 inline-flex"
      >
        {t.nav.about} <ArrowRight size={16} />
      </Link>
    </Section>
  );
}

export function EducationBlock({ t, locale }: SectionProps) {
  return (
    <Section eyebrow={t.education.eyebrow} title={t.education.title}>
      <div className="grid gap-4 md:grid-cols-3">
        {education.map((item) => (
          <div key={item.school} className="card p-6">
            <p className="font-mono text-xs text-primary">{item.period}</p>
            <h3 className="mt-2 font-semibold">{item.school}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.title[locale]}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.detail[locale]}</p>
          </div>
        ))}
        <div className="card p-6">
          <h3 className="font-semibold">{t.education.languages}</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {languages.map((lang) => (
              <li
                key={lang.name.fr}
                className="flex items-center justify-between border-b border-border pb-2 last:border-0"
              >
                <span>{lang.name[locale]}</span>
                <span className="text-muted-foreground">{lang.level[locale]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function Stats({ t }: SectionProps) {
  return (
    <div className="mb-24 grid grid-cols-2 gap-4 md:mb-40 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.key} className="card p-6">
          <p className="text-4xl font-bold tracking-tight text-gold">
            {stat.value}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.stats[stat.key]}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Faq({ t }: SectionProps) {
  return (
    <Section eyebrow={t.faq.eyebrow} title={t.faq.title} maxWidth={900}>
      <Accordion items={t.faq.items} />
    </Section>
  );
}

export function Local({ t }: SectionProps) {
  return (
    <Section eyebrow={t.local.eyebrow} title={t.local.title} maxWidth={820}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <MapPin size={22} />
        </span>
        <div>
          <p className="leading-relaxed text-muted-foreground">
            {t.local.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip">Français</span>
            <span className="chip">English</span>
            <span className="chip">العربية</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Cta({ t, locale }: SectionProps) {
  return (
    <section className="mb-16 md:mb-24">
      <div className="card relative overflow-hidden p-8 md:p-14">
        <div
          className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          {t.cta.title}
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{t.cta.description}</p>
        <Link
          href={`/${locale}/contact`}
          className="btn btn-primary mt-8 inline-flex"
        >
          {t.cta.button} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
