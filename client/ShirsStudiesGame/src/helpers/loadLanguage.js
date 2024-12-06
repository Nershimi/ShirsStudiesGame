// export const loadLanguage = async (lang, component) => {
//   try {
//     let module;
//     if (lang === "en") {
//       module = await import(
//         /* @vite-ignore */ `../components/languages/en.json`
//       );
//     } else if (lang === "he") {
//       module = await import(
//         /* @vite-ignore */ `../components/languages/he.json`
//       );
//     } else {
//       throw new Error(`Unsupported language: ${lang}`);
//     }
//     return module.default;
//   } catch (error) {
//     console.error(
//       `Error loading language file for ${lang}/${component}:`,
//       error
//     );
//     return { [component]: {} }; // Return an empty object for the component key
//   }
// };

const supportedLanguages = ["en", "he"]; // Add more supported languages here
const DEFAULT_LANG = "en";
const languageCache = {};

export const loadLanguage = async (lang, component) => {
  const selectedLang = supportedLanguages.includes(lang) ? lang : DEFAULT_LANG;

  if (languageCache[selectedLang]) {
    return languageCache[selectedLang];
  }

  try {
    const module = await import(`../components/languages/${selectedLang}.json`);
    languageCache[selectedLang] = module.default;
    return module.default;
  } catch (error) {
    console.error(`Error loading language file for ${selectedLang}/${component}:`, error);
    if (selectedLang !== DEFAULT_LANG) {
      console.warn(`Falling back to default language: ${DEFAULT_LANG}`);
      return loadLanguage(DEFAULT_LANG, component);
    }
    return { [component]: {} };
  }
};

