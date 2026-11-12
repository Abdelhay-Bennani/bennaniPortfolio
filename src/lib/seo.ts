import { locales } from "@/i18n/config";

export function buildAlternates(path: string) {
  const rest = path.replace(/^\/(fr|en|ar)/, "");
  return {
    canonical: path,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${rest}`])),
      "x-default": `/fr${rest}`,
    },
  };
}
