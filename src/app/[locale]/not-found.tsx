"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";

export default function NotFound() {
  const { locale, t } = useLocale();
  return (
    <div className="container-lg flex min-h-[60vh] flex-col items-start justify-center py-16">
      <span className="font-mono text-sm text-primary">404</span>
      <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
        {t.notFound.title}
      </h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        {t.notFound.description}
      </p>
      <Link href={`/${locale}`} className="btn btn-primary mt-8">
        {t.notFound.back} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
