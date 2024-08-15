import React, { useState } from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup, AuthError } from "firebase/auth";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Alert } from "@mui/material";

interface Props {
  setIsAuth: (auth: boolean) => void;
  setCookie: (name: "user", value: any, options?: any) => void;
}

export const Authentication: React.FC<Props> = ({ setIsAuth, setCookie }) => {
  const cookies = new Cookies();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      cookies.set("auth-token", result.user.refreshToken);
      setCookie("user", result.user.displayName, { path: "/" });
      setIsAuth(true);
      console.log("Auth state updated");
      console.log(result.user.displayName);
      navigate("/");
    } catch (error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case "auth/popup-closed-by-user":
          console.warn(
            "The popup was closed before completing the sign-in process."
          );
          break;
        case "auth/network-request-failed":
          console.error("Network error, please try again.");
          setError("Network error, please try again.");
          break;
        case "auth/popup-blocked":
          console.error("Popup was blocked by the browser.");
          setError("Popup was blocked by the browser.");
          break;
        default:
          console.error("Error signing in with Google: ", authError);
          setError(authError.message);
          break;
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={2}
    >
      <Typography variant="h6" gutterBottom>
        Sign in with Google to continue
      </Typography>
      <Button variant="contained" color="primary" onClick={signInWithGoogle}>
        Sign in
      </Button>
      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </Box>
  );
};
