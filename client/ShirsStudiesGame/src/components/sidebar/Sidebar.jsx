import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar({}) {
  const [isOpen, setIsOpen] = useState(false);
  const LOGO =
    "https://firebasestorage.googleapis.com/v0/b/shirsstudiesgame.appspot.com/o/shirsStudiesGame_updated.png?alt=media&token=1ff9959f-e111-4719-ab96-649cf0da6903";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
          <h1 className={styles.headerTitle}>Shirs Studies Game</h1>
          <li>
            <Link onClick={toggleMenu} to="/HomePage">
              באו נתחיל לשחק
            </Link>
          </li>
          <li>
            <Link onClick={toggleMenu} to="/userDetails">
              פרטים אישיים
            </Link>
          </li>
          {/* <li>
            <Link to="/">אודות</Link>
          </li>
          <li>
            <Link to="/">צור קשר</Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
}
