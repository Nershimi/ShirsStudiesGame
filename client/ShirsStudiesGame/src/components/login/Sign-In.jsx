import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import Input from "../Input.jsx";
import Button from "../Button.jsx";
import { handleSignIn } from "./handleSignIn.js";
import { resetPassword } from "./handleResetPassword.js";
import styles from "./AuthForm.module.css";

import { loadLanguage } from "./../../helpers/loadLanguage.js"; // Import the helper function

export default function SignIn({ lang, setLoggedIn }) {
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
      .catch((error) => {
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
    <div className={styles.authFormContainer}>
      <h2 className={styles.title}>{texts.title || "Loading..."}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        <div className={styles.inputContainer}>
          <FaUser className={`icon-class ${styles.icon}`} />
          <Input
            type="email"
            name="email"
            value={userFields.email}
            placeholder={texts.usernamePlaceholder || "Loading..."}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.inputContainer}>
          <FaLock className={`icon-class ${styles.icon}`} />
          <Input
            type={showPass ? "text" : "password"}
            placeholder={texts.passwordPlaceholder || "Loading..."}
            name="password"
            value={userFields.password}
            onChange={handleChange}
            className={styles.passwordInput}
          />
          <Button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className={styles.showButton}
          >
            {showPass
              ? texts.showButton?.hide || "Hide"
              : texts.showButton?.show || "Show"}
          </Button>
        </div>
        <Button type="submit" className={styles.button}>
          {texts.loginButton || "Loading..."}
        </Button>
        <p className={styles.forgotPassword} onClick={handleResetPassword}>
          {texts.forgotPassword || "Loading..."}
        </p>
      </form>
    </div>
  );
}
