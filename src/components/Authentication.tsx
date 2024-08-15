import React, { useState } from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup, AuthError } from "firebase/auth";
import Cookies from "universal-cookie";
interface Props {
  setIsAuth: (auth: boolean) => void;
}
export const Authentication: React.FC<Props> = ({ setIsAuth }) => {
  const cookies = new Cookies();
  const [error, setError] = useState<string | null>(null);
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
      console.log("Auth state updated");
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
    <div className="auth">
      <p>Sign in with Google to continue</p>
      <button onClick={signInWithGoogle}>Sign in</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
