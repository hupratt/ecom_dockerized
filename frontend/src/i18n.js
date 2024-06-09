import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationPT from "./locales/pt/translation.json";

// // the translations
const resources = {
  de: {
    translation: translationDE
  },
  en: {
    translation: translationEN
  },
  pt: {
    translation: translationPT
  },
  fr: {
    translation: translationFR
  }
};
i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: "en",
    debug: false,
    resources: resources,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
