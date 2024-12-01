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

// TODO: fix languages in All components - needs to add module to change lang.
// TODO: add about the game and my self component.
// TODO: add choose university to sign-in.
// TODO: create Readme to github.
// TODO: option to add wrong questions to next section or a unique game.
// TODO: add section to show thw user progress.
// TODO: find way for the user to upload question.

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

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

  return (
    <Router>
      <div className={styles.appContainer}>
        <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          <Route
            path="/HomePage"
            element={loggedIn ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate to="/HomePage" />
              ) : (
                <SignIn setLoggedIn={setLoggedIn} />
              )
            }
          />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="/game" element={<QuestionGame />} />
          <Route path="/userDetails" element={<UserPersonalDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
