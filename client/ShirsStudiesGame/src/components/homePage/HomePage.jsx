import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import Loader from "../loader/Loader.jsx";
import Button from "../Button.jsx";

// TODO: Add  option to choose by Subtopic

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoad, setIsLoad] = useState(false);

  const handleTopicClick = async (topic) => {
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
      navigate("/game", { state: { questions } });
    } catch (error) {
      setIsLoad(false);
      console.error(error);
    }
  };

  return (
    <div>
      {isLoad && <Loader />}
      <h1>Choose a Topic</h1>
      <Button
        className={styles["home-button"]} // Use the CSS module class
        onClick={() => handleTopicClick("ביולוגיה מולקולרית")}
      >
        ביולוגיה מולקולרית
      </Button>
      <Button
        className={styles["home-button"]} // Use the CSS module class
        onClick={() => handleTopicClick("אימונולוגיה")}
      >
        אימונולוגיה
      </Button>
      <Button
        className={styles["home-button"]} // Use the CSS module class
        onClick={() => handleTopicClick("פזיולוגיה ב")}
      >
        פזיולוגיה ב
      </Button>
      <Button
        className={styles["home-button"]} // Use the CSS module class
        onClick={() => handleTopicClick("מבוא למיקרוביולוגיה")}
      >
        מבוא למיקרוביולוגיה
      </Button>
      {/* Add more buttons as needed */}
    </div>
  );
};

export default HomePage;
