import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import Loader from "../loader/Loader.jsx";
import TopicSelector from "./TopicSelector.jsx";
import { loadLanguage } from "./../../helpers/loadLanguage.js"; 

const HomePage = ({lang = "he"}) => {
  const navigate = useNavigate();
  const [isLoad, setIsLoad] = useState(false);
  const [openTopicIndex, setOpenTopicIndex] = useState(null);
  const [texts, setTexts] = useState(null);

  useEffect(() => {
    loadLanguage(lang, "homePage")
      .then((data) => setTexts(data.homePage))
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

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
  
  if (!texts) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.pageContainer}>
        {isLoad && <Loader />}
        <p>{texts.intro}</p>
        <h1 className={styles.title}>{texts.title}</h1>
        <div className={styles.gameButtonContainer}>
          {texts.topics.map((topic, index) => (
            <TopicSelector
              key={index}
              topics={topic}
              isOpen={openTopicIndex === index}
              onToggle={() => handleToggle(index)}
              onClick={handleTopicClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
