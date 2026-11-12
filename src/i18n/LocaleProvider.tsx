"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { localeDirection, type Locale } from "./config";
import type { Messages } from "./messages/fr";

type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ locale, dir: localeDirection[locale], t: messages }),
    [locale, messages],
  );
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
