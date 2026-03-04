import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import viCommon from "./locales/vi/common.json";
import enCommon from "./locales/en/common.json";

const STORAGE_KEY = "memora-language";

type SupportedLanguage = "vi" | "en";

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") {
    return "vi";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
  if (stored === "vi" || stored === "en") {
    return stored;
  }

  const browserLang = window.navigator.language.toLowerCase();
  if (browserLang.startsWith("vi")) return "vi";
  if (browserLang.startsWith("en")) return "en";

  return "vi";
};

export const resources = {
  vi: {
    common: viCommon,
  },
  en: {
    common: enCommon,
  },
} as const;

export const defaultNS = "common";

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "vi",
  supportedLngs: ["vi", "en"],
  ns: ["common"],
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

export const setAppLanguage = (lng: SupportedLanguage) => {
  i18n.changeLanguage(lng);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, lng);
  }
};

export default i18n;

