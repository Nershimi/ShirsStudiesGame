import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import Input from "../Input.jsx";
import Button from "../Button.jsx";
import { handleSignIn } from "./handleSignIn.js";
import { resetPassword } from "./handleResetPassword.js";
import "./login.css";

import { loadLanguage } from "./../../helpers/loadLanguage.js"; // Import the helper function

export default function SignIn({ lang = "en", setLoggedIn }) {
  const [userFields, setUserFields] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [texts, setTexts] = useState(null);

  const navigate = useNavigate();

  const navigateToHomepage = () => {
    navigate("/HomePage");
  };

  useEffect(() => {
    loadLanguage(lang, "signIn")
      .then((data) => setTexts(data.signIn))
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserFields((prevData) => ({ ...prevData, [name]: value }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(""); // Change: Clear any previous error message
    handleSignIn(userFields.email, userFields.password)
      .then(() => {
        console.log("navigate to home page");
        setLoggedIn(true);
        navigateToHomepage();
      })
      .catch(() => {
        console.error("Sign-in error:", error);
        if (texts && texts.errorMessage) {
          setErrorMessage(texts.errorMessage);
        } else {
          setErrorMessage("Login failed. Please try again."); // Change: Added general error message
        }
        window.scrollTo(0, 0);
      });
  }

  function handleResetPassword(e) {
    e.preventDefault();
    resetPassword(userFields.email);
    console.log("Send reset password");
  }

  if (!texts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="title">{texts.title || "Loading..."}</h1>
        <form onSubmit={handleSubmit} className="form">
          {errorMessage && <div className="error">{errorMessage}</div>}
          <div className="input-container">
            <FaUser className="icon" />
            <Input
              type="email"
              name="email"
              value={userFields.email}
              placeholder={texts.usernamePlaceholder || "Loading..."}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="input-container">
            <FaLock className="icon" />
            <Input
              type={showPass ? "text" : "password"}
              placeholder={texts.passwordPlaceholder || "Loading..."}
              name="password"
              value={userFields.password}
              onChange={handleChange}
              className="input password-input"
            />
            <Button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="show-button"
            >
              {showPass
                ? texts.showButton?.hide || "Hide"
                : texts.showButton?.show || "Show"}
            </Button>
          </div>
          <Button type="submit" className="button">
            {texts.loginButton || "Loading..."}
          </Button>
          <p className="forgot-password" onClick={handleResetPassword}>
            {texts.forgotPassword || "Loading..."}
          </p>
        </form>
      </div>
    </div>
  );
}
