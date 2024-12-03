import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./en.json";
import translationHE from "./he.json";
// import translationRU from './ru.json';
// import translationAR from './ar.json';

const resources = {
  en: { translation: translationEN },
  he: { translation: translationHE },
  //   ru: { translation: translationRU },
  //   ar: { translation: translationAR },
};

i18n
  .use(LanguageDetector) // זיהוי שפה אוטומטי
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", // שפת ברירת מחדל
    debug: true, // הדפסת נתונים לקונסול לצורך דיבאג
    keySeparator: false, // מפתחות שלמים
    interpolation: {
      escapeValue: false, // לא נדרש עבור React
    },
  });

export default i18n;
