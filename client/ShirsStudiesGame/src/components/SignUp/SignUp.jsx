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
import "../login/login.css";

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
      setError(error.message);
    }
  };

  const toggleShowPass = (field) => {
    setShowPass((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="title">Sign Up</h1>
        {error && <p className="error">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-container">
            <Input
              type="text"
              className="input"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => setHasInteractedFullName(true)}
              hasInteracted={hasInteractedFullName}
            />
          </div>
          <div className="input-container">
            <Input
              type="date"
              className="input"
              placeholder="Date of Birth"
              value={newUser.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              onBlur={() => setHasInteractedDate(true)}
              hasInteracted={hasInteractedDate}
            />
          </div>
          <div className="input-container">
            <Input
              type="email"
              className="input"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="input-container">
            <Input
              type={showPass.password ? "text" : "password"}
              className="password-input"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <button
              type="button"
              className="show-button"
              onClick={() => toggleShowPass("password")}
            >
              {showPass.password ? "Hide" : "Show"}
            </button>
          </div>
          <div className="input-container">
            <Input
              type={showPass.confirmPassword ? "text" : "password"}
              className="password-input"
              placeholder="Confirm Password"
              value={secondPassword}
              onChange={handleSecondPasswordChange}
            />
            <button
              type="button"
              className="show-button"
              onClick={() => toggleShowPass("confirmPassword")}
            >
              {showPass.confirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Button className="button" type="submit">
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}
