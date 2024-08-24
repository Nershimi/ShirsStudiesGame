import React from "react";
import styles from "./Loader.module.css";
const Loader = () => (
  <div className={styles.loaderOverlay}>
    <span className={styles.loader}>good luck</span>
  </div>
);

export default Loader;
