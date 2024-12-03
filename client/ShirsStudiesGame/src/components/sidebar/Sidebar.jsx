import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { loadLanguage } from "./../../helpers/loadLanguage.js";

export default function Sidebar({ lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [texts, setTexts] = useState(null);

  const LOGO =
    "https://firebasestorage.googleapis.com/v0/b/shirsstudiesgame.appspot.com/o/shirsStudiesGame_updated.png?alt=media&token=1ff9959f-e111-4719-ab96-649cf0da6903";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    loadLanguage(lang, "sideBar")
      .then((data) => {
        // console.log("Language data loaded:", data);
        setTexts(data.sideBar);
      })
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  return (
    <div className={styles.menuContainer}>
      <button onClick={toggleMenu} className={styles.menuButton}>
        ☰
      </button>
      <nav className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
        <button onClick={toggleMenu} className={styles.menuButton}>
          X
        </button>
        <ul>
          <img src={LOGO} alt="App logo" />
          <h1 className={styles.headerTitle}>
            {" "}
            {texts ? texts.headerTitle : "Loading..."}
          </h1>
          <li>
            <Link onClick={toggleMenu} to="/HomePage">
              {texts ? texts.letsPlay : "Loading..."}
            </Link>
          </li>
          <li>
            <Link onClick={toggleMenu} to="/userDetails">
              {texts ? texts.userDetails : "Loading..."}
            </Link>
          </li>
          <li>
            <Link to="/">{texts ? texts.about : "Loading..."}</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
