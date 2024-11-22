import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import Loader from "../loader/Loader.jsx";
import TopicSelector from "./TopicSelector.jsx";

const TOPICS = [
  {
    title: "נוירופיזיולוגיה ב",
    subTopics: [
      "תנועות מוטוריות בסיסיות ושליטה מוטורית",
      "רפלקסים ומנגנונים נוירופיזיולוגיים",
      "מערכות שליטה בתנועה במוח",
      "תנועות מורכבות ואינטגרציה בין מערכות",
      "מנגנוני קואורדינציה ושילוב מידע חושי",
      "מחלות והפרעות נוירולוגיות",
      "נוירונים מוטוריים והשפעתם על תנועה",
    ],
  },
  {
    title: "ביוכימיה 2",
    subTopics: [
      "מבוא למטבוליזם",
      "גליקוליזה",
      "גלוקונאוגנזה ומסלול הפנטוזות",
      "מעגל קרבס",
      "זרחון חמצני-נשימה תאית",
      "גליקוגן ועקרונות הבקרה המטבולית",
      "פירוק שומנים",
      "בניית שומנים",
      "פירוק חלבונים",
      "בקרה מטבולית",
    ],
  },
  {
    title: "מבוא למיקרוביולוגיה",
    subTopics: [],
  },
  {
    title: "אימונולוגיה",
    subTopics: [
      "תאי מערכת החיסון",
      "מנגנונים ותהליכים חיסוניים",
      "מערכות חיסון",
      "נוגדנים וציטוקינים",
      "שיטות וכלים במעבדה",
      "פתולוגיות והפרעות במערכת החיסון",
    ],
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
  // console.log("<HomePage/>");
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
        <p>
          🎉 ברוכים הבאים למשחק הטריוויה שלנו! 🎉 איזה כיף שאתם כאן! זו ההזדמנות
          שלכם ללמוד, לאתגר את עצמכם ולהתנסות בדרך מהנה ומשתפת. 📚 איך זה עובד?
          ענו על שאלות, צברו נקודות, והפגינו את הידע שלכם. יש לכם שאלה טובה?
          מעולה! העלו אותה למשחק ותהיו חלק מהבנאים של הקהילה שלנו! ✨ כל משחק
          הוא צעד נוסף בדרך להצלחה! אז קדימה, בואו נכבוש יחד את האתגרים, נצחק,
          נלמד ונשתפר. 💡 טיפ קטן: אל תשכחו לבדוק שאלות חדשות שנוספו! בהצלחה
          ו... שחקו בכיף! 😄
        </p>
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
