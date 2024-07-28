// handleSignIn.js
import { auth } from "../../firebaseConfig.js"; // Adjust the path as needed
import { signInWithEmailAndPassword } from 'firebase/auth';

export const handleSignIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(`${user.email} Succeeded to Sign-in`);
    })
    .catch((error) => {
      console.error("Error signing in: ", error); // Log error for better debugging
      throw error;
    });
};
