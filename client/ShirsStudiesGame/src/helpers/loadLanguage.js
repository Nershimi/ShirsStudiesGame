export const loadLanguage = async (lang, component) => {
  try {
    let module;
    if (lang === "en") {
      module = await import(
        /* @vite-ignore */ `../components/languages/en.json`
      );
    } else if (lang === "he") {
      module = await import(
        /* @vite-ignore */ `../components/languages/he.json`
      );
    } else {
      throw new Error(`Unsupported language: ${lang}`);
    }
    return module.default;
  } catch (error) {
    console.error(
      `Error loading language file for ${lang}/${component}:`,
      error
    );
    return { [component]: {} }; // Return an empty object for the component key
  }
};
