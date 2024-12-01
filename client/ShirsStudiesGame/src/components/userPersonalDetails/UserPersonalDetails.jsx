import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./userPersonalDetails.module.css";
import Loader from "../loader/Loader.jsx";
import { loadLanguage } from "./../../helpers/loadLanguage.js";

export default function UserPersonalDetails({ lang = "he" }) {
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    dateOfBirth: null,
    created: null,
  });
  const [userId, setUserId] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const [texts, setTexts] = useState(null);

  useEffect(() => {
    loadLanguage(lang, "userPersonal")
      .then((data) => setTexts(data.userPersonal))
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchUserDetails = async () => {
      try {
        setIsLoad(true);
        const response = await fetch(
          "https://us-central1-shirsstudiesgame.cloudfunctions.net/getUserDetails",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              userId: userId,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const convertFirebaseTimestamp = (timestamp) => {
            return new Date(
              timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
            );
          };

          setUserDetails({
            fullName: data.fullName,
            email: data.email,
            dateOfBirth: data.dateOfBirth
              ? convertFirebaseTimestamp(data.dateOfBirth)
              : null,
            created: data.created
              ? convertFirebaseTimestamp(data.created)
              : null,
            university: data.university.university,
          });
          setIsLoad(false);
        } else {
          console.log("Failed to fetch user details");
        }
      } catch (error) {
        setIsLoad(false);
        console.log(error);
      }
    };
    fetchUserDetails();
  }, [userId]);

  return (
    <div className={styles.centerWrapper}>
      {isLoad && <Loader />}
      <div className={styles.detailsContainer}>
        <h2 className={styles.detailsHeader}>
          {texts ? texts.title : "Loading..."}
        </h2>
        <div className={styles.detailsItem}>
          <span className={styles.detailsLabel}>
            {texts ? texts.fullName : "Loading..."}
          </span>
          <span className={styles.detailsValue}>{userDetails.fullName}</span>
        </div>
        <div className={styles.detailsItem}>
          <span className={styles.detailsLabel}>
            {texts ? texts.email : "Loading..."}
          </span>
          <span className={styles.detailsValue}>{userDetails.email}</span>
        </div>
        <div className={styles.detailsItem}>
          <span className={styles.detailsLabel}>
            {" "}
            {texts ? texts.dateOfBirth : "Loading..."}
          </span>
          <span className={styles.detailsValue}>
            {userDetails.dateOfBirth
              ? userDetails.dateOfBirth.toLocaleDateString()
              : ""}
          </span>
        </div>
        <div className={styles.detailsItem}>
          <span className={styles.detailsLabel}>
            {texts ? texts.university : "Loading..."}
          </span>
          <span className={styles.detailsValue}>
            {userDetails.university ? userDetails.university : ""}
          </span>
        </div>
        <div className={styles.detailsItem}>
          <span className={styles.detailsLabel}>
            {texts ? texts.created : "Loading..."}
          </span>
          <span className={styles.detailsValue}>
            {userDetails.created
              ? userDetails.created.toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
