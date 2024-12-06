import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import SignIn from "./components/login/Sign-In.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import HomePage from "./components/homePage/HomePage.jsx";
import Header from "./components/Header.jsx";
import { isUserLogin } from "./isUserLogin.js";
import QuestionGame from "./components/game/GameComponent.jsx";
import "./index.css";
import styles from "./App.module.css";
import UserPersonalDetails from "./components/userPersonalDetails/UserPersonalDetails.jsx";
import { useTranslation } from "react-i18next";
import "././components/languages/i18n.js"; // Ensure i18n is initialized
import LanguageSwitcher from "./components/switcherLang/LanguageSwitcher.jsx"; // Language switcher component

// TODO: add about the game and my self component.
// TODO: add choose university to sign-in.
// TODO: create Readme to github.
// TODO: option to add wrong questions to next section or a unique game.
// TODO: add section to show thw user progress.
// TODO: find way for the user to upload question.

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "he");

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const user = await isUserLogin();
        setLoggedIn(!!user); // Update loggedIn state based on user's login status
      } catch (error) {
        console.error("Error checking user login status:", error);
      }
    };

    checkUserLogin();
  }, []);

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setLang(language);
  };

  return (
    <Router>
      <div className={styles.appContainer}>
        <Header lang={lang} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <LanguageSwitcher />
        <Routes>
          <Route
            path="/HomePage"
            element={loggedIn ? <HomePage lang={lang} /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate to="/HomePage" />
              ) : (
                <SignIn lang={lang} setLoggedIn={setLoggedIn} />
              )
            }
          />
          <Route path="sign-up" element={<SignUp lang={lang} />} />
          <Route path="/game" element={<QuestionGame lang={lang} />} />
          <Route
            path="/userDetails"
            element={<UserPersonalDetails lang={lang} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
