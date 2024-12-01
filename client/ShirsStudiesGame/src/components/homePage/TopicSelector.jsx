import styles from "./topicSelector.module.css";
import { loadLanguage } from "./../../helpers/loadLanguage.js";
import { useState, useEffect } from "react";

export default function TopicSelector({
  topics,
  onClick,
  isOpen,
  onToggle,
  lang = "he",
}) {
  const [texts, setTexts] = useState(null);
  useEffect(() => {
    loadLanguage(lang, "topicSelector")
      .then((data) => setTexts(data.topicSelector))
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  return (
    <div className={styles.topicContainer}>
      <div onClick={onToggle} className={styles.topicTitle}>
        {<span>{topics.title}</span>}
        <span className={`${styles.topicArrow} ${isOpen ? styles.open : ""}`}>
          ▼
        </span>
      </div>
      <ul className={`${styles.subTopicsList} ${isOpen ? styles.open : ""}`}>
        <li
          onClick={() => onClick(topics.title, null)}
          className={styles.subTopicItem}
        >
          {texts ? texts.allQuestions : "Loading..."}
        </li>
        {topics.subTopics.map((subTopic, index) => (
          <li
            onClick={() => onClick(topics.title, subTopic)}
            key={index}
            className={styles.subTopicItem}
          >
            {subTopic}
          </li>
        ))}
      </ul>
    </div>
  );
}
