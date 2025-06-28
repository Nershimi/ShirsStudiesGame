import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import Loader from "../loader/Loader.jsx";
import TopicSelector from "./TopicSelector.jsx";
import { loadLanguage } from "./../../helpers/loadLanguage.js";

const HomePage = ({ lang }) => {
  const navigate = useNavigate();
  const [isLoad, setIsLoad] = useState(false);
  const [openTopicIndex, setOpenTopicIndex] = useState(null);
  const [texts, setTexts] = useState(null);
  const APP_VERSION_KEY = "appVersion";

  useEffect(() => {
    loadLanguage(lang, "homePage")
      .then((data) => setTexts(data.homePage))
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  const handleToggle = (index) => {
    setOpenTopicIndex(openTopicIndex === index ? null : index);
  };

  const checkAndUpdateVersion = async () => {
    try {
      // Fetch the latest app version from Firebase Hosting
      const response = await fetch("/version.json"); // Hosted file with version
      const { version: latestVersion } = await response.json();

      const storedVersion = localStorage.getItem(APP_VERSION_KEY);

      // If the version has changed, clear cache
      if (storedVersion !== latestVersion) {
        console.log("New app version detected! Clearing cache...");
        localStorage.clear();
        localStorage.setItem(APP_VERSION_KEY, latestVersion);
      }
    } catch (error) {
      console.error("Failed to check app version:", error);
    }
  };

  // Call this when the app starts
  useEffect(() => {
    checkAndUpdateVersion();
  }, []);

  const handleTopicClick = async (topic, subTopic) => {
    try {
      const cacheKey = `${topic}`;
      const storedData = localStorage.getItem(cacheKey);

      if (storedData) {
        console.log("Using cached data from localStorage");
        const questions = JSON.parse(storedData);
        if (subTopic === null) {
          navigate("/game", { state: { questions } });
        } else {
          const filteredQuestion = questions.filter(
            (question) => question.subtopic === subTopic
          );
          if (Array.isArray(filteredQuestion)) {
            navigate("/game", { state: { filteredQuestion } });
          } else {
            console.log("Received data is not an array: ", questions);
          }
        }
        return;
      }

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
      localStorage.setItem(cacheKey, JSON.stringify(questions)); // Cache the questions
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
