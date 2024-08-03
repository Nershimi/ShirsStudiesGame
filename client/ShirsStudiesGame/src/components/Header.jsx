import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import "./header.css"; // Import the new CSS file
import { isUserLogin } from "./../isUserLogin.js";
import { signOutUser } from "./../signOutUser.js";

export default function Header({ loggedIn, setLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const user = await isUserLogin();
        setLoggedIn(!!user);
      } catch (error) {
        console.error("Error checking user login status:", error);
      }
    };

    checkUserLogin();
  }, [setLoggedIn]);

  const navigateToSignUp = () => {
    navigate("/sign-up");
  };
  const navigateToSignIn = () => {
    navigate("/");
  };

  function handleSignOut() {
    signOutUser();
    setLoggedIn(false); // Update loggedIn state when signing out
    navigateToSignIn();
  }

  return (
    <div className="header-component">
      <header id="header">
        <div className="left-content">
          {/* <img src={logo} alt="Logo of website" /> */}
          <h1>Shirs Studies Game</h1>
        </div>
        <div className="right-content">
          {!loggedIn ? (
            <div>
              <Button
                type="button"
                onClick={navigateToSignUp}
                className="button-17"
                role="button"
              >
                Sign up
              </Button>
              <Button
                type="button"
                onClick={navigateToSignIn}
                className="button-17"
                role="button"
              >
                Sign in
              </Button>
            </div>
          ) : (
            <div>
              <Button
                type="button"
                onClick={handleSignOut}
                className="button-17"
                role="button"
              >
                Sign out
              </Button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
