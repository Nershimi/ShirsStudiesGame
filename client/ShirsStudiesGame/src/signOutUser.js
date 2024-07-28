import { auth } from "./firebaseConfig.js";
import { signOut } from "firebase/auth";

export const signOutUser = () => {
    return signOut(auth)
      .then(() => {
        console.log("User sign-out");
      })
      .catch((error) => {
        // An error happened.
      });
  };