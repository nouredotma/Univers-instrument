export { en, type TranslationKeys } from "./en"
export { fr } from "./fr"
export { es } from "./es"

import { en } from "./en"
import { fr } from "./fr"
import { es } from "./es"

export type Language = "en" | "fr" | "es"

export const translations = {
  en,
  fr,
  es,
} as const

export const languages = [
  {
    code: "en" as const,
    name: "English",
    flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",
  },
  {
    code: "fr" as const,
    name: "Français",
    flag: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg",
  },
  {
    code: "es" as const,
    name: "Español",
    flag: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",
  },
] as const

export const DEFAULT_LANGUAGE: Language = "en"
export const LANGUAGE_STORAGE_KEY = "mts-language"
