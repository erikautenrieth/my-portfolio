export type Lang = "de" | "en";

export type Bilingual = { de: string; en: string };

export const t = (lang: Lang, b: Bilingual): string => b[lang];

export { en } from "./en";
export { de } from "./de";

import { en } from "./en";
import { de } from "./de";
import type { Dict } from "./en";

export const dict: Record<Lang, Dict> = { de, en };
