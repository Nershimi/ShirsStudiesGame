import { useState } from "react";
import { handleSignUp } from "./sign-up.js";
import { isEmailValid } from "../../helpers/ValidateEmail.js";
import {
  isPasswordValid,
  compareFirstAndSecondPw,
} from "../../helpers/password.js";
import { useNavigate } from "react-router-dom";
import Input from "../Input";
import Button from "../Button";
import styles from "../login/AuthForm.module.css";

export default function SignUp() {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    dateOfBirth: "",
    fullName: "",
  });
  const [secondPassword, setSecondPassword] = useState("");
  const [showPass, setShowPass] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [hasInteractedFullName, setHasInteractedFullName] = useState(false);
  const [hasInteractedDate, setHasInteractedDate] = useState(false);
  const navigate = useNavigate();

  const emailValid = isEmailValid(newUser.email);
  const passwordValid = isPasswordValid(newUser.password);
  const isEqualPassword = compareFirstAndSecondPw(
    newUser.password,
    secondPassword
  );

  const navigateToLogin = () => {
    navigate("/");
  };

  async function saveUserDetails(userId) {
    try {
      const response = await fetch(
        "https://us-central1-shirsstudiesgame.cloudfunctions.net/saveUserPersonalDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...newUser, userId }),
        }
      );
      if (response.ok) {
        console.log(response);
        setNewUser({
          email: "",
          password: "",
          dateOfBirth: "",
          fullName: "",
        });
        navigateToLogin();
      } else {
        throw new Error("Failed to save personal user details");
      }
    } catch (error) {
      console.error("Error saving personal user details: ", error);
      alert("Failed to save personal user details");
    }
  }

  const notEmptyFiled =
    newUser.dateOfBirth.length > 0 && newUser.fullName.length > 0;

  const handleChange = (key, value) => {
    setNewUser({ ...newUser, [key]: value });
  };

  const handleSecondPasswordChange = (e) => setSecondPassword(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailValid || !passwordValid || !isEqualPassword || !notEmptyFiled) {
      return setError("Please make sure all fields are correct");
    }
    setError("");
    try {
      const user = await handleSignUp(newUser, setError); // Pass setError here
      await saveUserDetails(user.uid);
      navigate("/");
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  const toggleShowPass = (field) => {
    setShowPass((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className={styles.authFormContainer}>
      <h1 className={styles.title}>Sign Up</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <Input
            type="text"
            className={styles.input}
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => setHasInteractedFullName(true)}
            hasInteracted={hasInteractedFullName}
            error={
              hasInteractedFullName &&
              newUser.fullName.length <= 0 &&
              "Missing name"
            }
          />
        </div>
        <div className={styles.inputContainer}>
          <Input
            type="date"
            className={styles.input}
            placeholder="Date of Birth"
            value={newUser.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            onBlur={() => setHasInteractedDate(true)}
            hasInteracted={hasInteractedDate}
            error={hasInteractedDate && "Missing date of birth"}
          />
        </div>
        <div className={styles.inputContainer}>
          <Input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={
              !emailValid && newUser.email.length > 0 && "This mail not Valid"
            }
          />
        </div>
        <div className={styles.inputContainer}>
          <Input
            type={showPass.password ? "text" : "password"}
            className={styles.passwordInput}
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={
              !passwordValid &&
              newUser.password.length > 0 &&
              "This password not Valid"
            }
          />
          <Button
            type="button"
            className={styles.showButton}
            onClick={() => toggleShowPass("password")}
          >
            {showPass.password ? "Hide" : "Show"}
          </Button>
        </div>
        <div className={styles.inputContainer}>
          <Input
            type={showPass.confirmPassword ? "text" : "password"}
            className={styles.passwordInput}
            placeholder="Confirm Password"
            value={secondPassword}
            onChange={handleSecondPasswordChange}
            error={!isEqualPassword && "Password not match"}
          />
          <Button
            type="button"
            className={styles.showButton}
            onClick={() => toggleShowPass("confirmPassword")}
          >
            {showPass.confirmPassword ? "Hide" : "Show"}
          </Button>
        </div>
        <Button className={styles.button} type="submit">
          Sign up
        </Button>
      </form>
    </div>
  );
}
