import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

export const isUserLogin = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          resolve(user); // Resolve with the user object if user is logged in
        } else {
          resolve(null); // Resolve with null if no user is logged in
        }
      },
      (error) => {
        reject(error); // Reject if there's an error
      }
    );
  });
};
