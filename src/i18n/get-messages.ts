import type { Locale } from "./config";
import type { Messages } from "./messages/fr";
import fr from "./messages/fr";
import en from "./messages/en";
import ar from "./messages/ar";

const dictionaries: Record<Locale, Messages> = { fr, en, ar };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export type { Messages };
