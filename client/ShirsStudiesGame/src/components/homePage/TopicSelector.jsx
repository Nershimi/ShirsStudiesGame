import styles from "./topicSelector.module.css";
import { useState } from "react";

export default function TopicSelector({ topics, onClick, isOpen, onToggle }) {
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
          כל השאלות
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
