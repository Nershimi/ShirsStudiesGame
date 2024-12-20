import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import { isUserLogin } from "./../isUserLogin.js";
import { signOutUser } from "./../signOutUser.js";
import styles from "./Header.module.css";
import Sidebar from "./sidebar/Sidebar.jsx";
import { loadLanguage } from "../helpers/loadLanguage.js";

const LOGO =
  "https://firebasestorage.googleapis.com/v0/b/shirsstudiesgame.appspot.com/o/shirsStudiesGame_updated.png?alt=media&token=1ff9959f-e111-4719-ab96-649cf0da6903";

export default function Header({ loggedIn, setLoggedIn, lang }) {
  const [texts, setTexts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const user = await isUserLogin();
        setLoggedIn(!!user);
      } catch (error) {
        console.error("Error checking user login status:", error);
      }
    };

    checkUserLogin();
  }, [setLoggedIn]);

  useEffect(() => {
    loadLanguage(lang, "header")
      .then((data) => {
        setTexts(data.header);
      })
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  const navigateToSignUp = () => {
    navigate("/sign-up");
  };
  const navigateToSignIn = () => {
    navigate("/");
  };

  function handleSignOut() {
    signOutUser();
    setLoggedIn(false); // Update loggedIn state when signing out
    navigateToSignIn();
  }

  return (
    <div className={styles.header}>
      <div className={styles.leftContent}>
        <Sidebar lang={lang} />
        <img src={LOGO} alt="App logo" />
        <h1 className={styles.headerTitle}>
          {texts ? texts.headerTitle : "Loading..."}
        </h1>
      </div>
      <div className={styles.rightContent}>
        {!loggedIn ? (
          <div>
            <Button
              type="button"
              onClick={navigateToSignUp}
              className={styles.button17}
              role="button"
            >
              {texts ? texts.signUp : "Loading..."}
            </Button>
            <Button
              type="button"
              onClick={navigateToSignIn}
              className={styles.button17}
              role="button"
            >
              {texts ? texts.signIn : "Loading..."}
            </Button>
          </div>
        ) : (
          <div>
            <Button
              type="button"
              onClick={handleSignOut}
              className={styles.button17}
              role="button"
            >
              {texts ? texts.signOut : "Loading..."}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
