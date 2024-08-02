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

export default function SignUp() {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    dateOfBirth: "",
    fullName: "",
  });
  const [secondPassword, setSecondPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState();
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
      console.error("Error save personal user details: ", error);
      alert("Failed to save personal user details");
    }
  }

  const notEmptyFiled =
    newUser.dateOfBirth.length > 0 && newUser.fullName.length > 0;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigateToSignIn = () => {
    navigate("/");
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (emailValid && passwordValid && isEqualPassword && notEmptyFiled) {
      handleSignUp(newUser, setError)
        .then((user) => {
          saveUserDetails(user.uid); // Pass user ID to saveUserDetails
          navigateToSignIn();
        })
        .catch((error) => {
          console.error("Sign up failed:", error);
        });
    } else {
      setHasInteractedDate(true);
    }
  }

  return (
    <div>
      <div>
        <h1></h1>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            value={newUser.email}
            onChange={handleChange}
            name="email"
            placeholder="Please enter your email"
            error={
              !emailValid && newUser.email.length > 0 && "This mail not Valid"
            }
          />
          <Input
            type={showPass ? "text" : "password"}
            value={newUser.password}
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            error={
              !passwordValid &&
              newUser.password.length > 0 &&
              "This password not Valid"
            }
          />
          <Input
            type={showPass ? "text" : "password"}
            value={secondPassword}
            onChange={(event) => setSecondPassword(event.target.value)}
            placeholder="Re-enter your password"
            error={!isEqualPassword && "Password not match"}
          />
          <Input
            type="text"
            name="fullName"
            value={newUser.fullName}
            placeholder="Your full name"
            onChange={handleChange}
            error={
              hasInteractedFullName &&
              newUser.fullName.length <= 0 &&
              "Missing name"
            }
          />
          <Input
            type="date"
            name="dateOfBirth"
            value={newUser.dateOfBirth}
            onChange={handleChange}
            error={hasInteractedDate && "Missing date of birth"}
          />
          <Button type="submit">Sign up</Button>
        </form>
      </div>
    </div>
  );
}
