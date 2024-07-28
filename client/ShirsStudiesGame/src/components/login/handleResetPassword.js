import { auth } from "../../firebaseConfig.js";
import { sendPasswordResetEmail } from "firebase/auth";

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Send reset password mail");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};
