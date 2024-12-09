import { useState, useEffect } from "react";
import styles from "./AboutMe.module.css";
import { loadLanguage } from "./../../helpers/loadLanguage.js";

export default function AboutMe({ lang }) {
  const [texts, setTexts] = useState(null);

  useEffect(() => {
    loadLanguage(lang, "aboutMe")
      .then((data) => setTexts(data.aboutMe))
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  if (!texts) {
    return <div>Loading...</div>;
  }

  const directionClass = lang === "he" ? styles.rtl : styles.ltr;

  return (
    <div className={`${styles.container} ${directionClass}`}>
      <p className={styles.paragraph}>{texts.intro || "loading..."}</p>
      <p className={styles.paragraph}>{texts.aboutme || "loading..."}</p>
    </div>
  );
}
