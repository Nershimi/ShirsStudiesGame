import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleTopicClick = async (topic) => {
    try {
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
        throw new Error("Failed to fetch questions");
      }

      const questions = await response.json();
      navigate("/game", { state: { questions } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Choose a Topic</h1>
      <button onClick={() => handleTopicClick("ביולוגיה מולקולרית")}>
        Biochemistry
      </button>
      {/* <button onClick={() => handleTopicClick("Neurophysiology")}>
        Neurophysiology
      </button> */}
      {/* Add more buttons as needed */}
    </div>
  );
};

export default HomePage;
