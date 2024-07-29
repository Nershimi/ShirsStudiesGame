import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import SignIn from "./components/login/Sign-In.jsx";
import HomePage from "./components/homePage/HomePage.jsx";
import Header from "./components/Header.jsx";
import { isUserLogin } from "./isUserLogin.js";
import "./index.css";

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
      </Routes>
    </Router>
  );
}

export default App;
