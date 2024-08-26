import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import Loader from "../loader/Loader.jsx";
import Button from "../Button.jsx";
import TopicSelector from "./TopicSelector.jsx";

const TOPICS = [
  {
    title: "מבוא למיקרוביולוגיה",
    subTopics: [],
  },
  {
    title: "אימונולוגיה",
    subTopics: [],
  },
  {
    title: "ביולוגיה מולקולרית",
    subTopics: [
      "שכפול ותיקון דנ״א",
      "תרגום ועיבוד רנ״א",
      "שחבור ועריכת רנ״א",
      "מנגנוני שעתוק",
      "השתקת רנ״א ופירוקו",
      "כרומטין ואפיגנטיקה",
      "רגולציה של ביטוי גנים",
    ],
  },
  {
    title: "פזיולוגיה ב",
    subTopics: [
      "מערכת קרדיווסקולרית",
      "מערכת העיכול",
      "מערכת הנשימה",
      "מערכת הכליות והשתן",
    ],
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoad, setIsLoad] = useState(false);
  const [openTopicIndex, setOpenTopicIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenTopicIndex(openTopicIndex === index ? null : index);
  };

  const handleTopicClick = async (topic, subTopic) => {
    try {
      setIsLoad(true);
      const response = await fetch(
        "https://us-central1-shirsstudiesgame.cloudfunctions.net/getQuestionsByTopic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("idToken")}`,
          },
          body: JSON.stringify({ topic }),
        }
      );
      if (!response.ok) {
        setIsLoad(false);
        throw new Error("Failed to fetch questions");
      }
      const questions = await response.json();
      if (subTopic === null) {
        navigate("/game", { state: { questions } });
      } else {
        const filteredQuestion = questions.filter(
          (question) => question.subtopic === subTopic
        );
        if (Array.isArray(filteredQuestion)) {
          navigate("/game", { state: { filteredQuestion } });
        } else {
          console.error("Received data is not an array:", questions);
        }
      }
    } catch (error) {
      setIsLoad(false);
      console.error(error);
    }
  };

  return (
    <div>
      <div className={styles.pageContainer}>
        {isLoad && <Loader />}
        <h1 className={styles.title}>בחר נושא:</h1>
        <div className={styles.gameButtonContainer}>
          {TOPICS.map((topic, index) => (
            <TopicSelector
              key={index}
              topics={topic}
              isOpen={openTopicIndex === index}
              onToggle={() => handleToggle(index)}
              onClick={handleTopicClick}
            />
          ))}
        </div>
        {/* Add more buttons as needed */}
      </div>
    </div>
  );
};

export default HomePage;
