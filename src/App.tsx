import { Authentication } from "./components/Authentication";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import { Chat } from "./components/Chat";
import "./App.css";
import { useState, useRef } from "react";
import Cookies from "universal-cookie";
import { useCookies } from "react-cookie";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Room from "./components/Room";
import _404 from "./components/404";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(!!cookies.get("auth-token"));
  const [room, setRoom] = useState<string | null>(null);
  const roomInputref = useRef<HTMLInputElement>(null);
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  console.log("isAuth:", isAuth);
  const navigate = useNavigate(); // Add this log
  if (!isAuth) {
    return (
      <>
        <div>
          {<Authentication setIsAuth={setIsAuth} setCookie={setCookie} />}
        </div>
      </>
    );
  }

  const handleClick = () => {
    if (roomInputref.current?.value) {
      setRoom(roomInputref.current.value);
      navigate("/chat");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    removeCookie("user");
    setIsAuth(false);
    setRoom(null);
  };

  return (
    <>
      <Routes>
        {room ? (
          <Route
            path="/chat"
            element={<Chat room={room} cookie={cookie.user} />}
          />
        ) : (
          <Route path="/chat" element={<_404 />} />
        )}
        <Route
          path="/"
          element={
            <Room
              roomInputref={roomInputref}
              handleClick={handleClick}
              logout={handleLogout}
            />
          }
        />
        <Route path="*" element={<_404 />} />
      </Routes>
    </>
  );
}

export default App;
