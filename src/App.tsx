import { Authentication } from "./components/Authentication";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import { Chat } from "./components/Chat";
import "./App.css";
import { useState, useRef } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(!!cookies.get("auth-token"));
  const [room, setRoom] = useState<string | null>(null);
  const roomInputref = useRef<HTMLInputElement>(null);
  console.log("isAuth:", isAuth); // Add this log
  if (!isAuth) {
    return (
      <>
        <Authentication setIsAuth={setIsAuth} />
      </>
    );
  }

  const handleClick = () => {
    if (roomInputref.current?.value) {
      setRoom(roomInputref.current.value);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  };

  return (
    <>
      {room ? (
        <div>
          <Chat room={room} />
        </div>
      ) : (
        <div>
          <label htmlFor="">enter room Name</label>
          <input type="text" ref={roomInputref} />
          <button onClick={handleClick}>enter chat</button>
        </div>
      )}

      <div>
        <button onClick={handleLogout}>logout</button>
      </div>
    </>
  );
}

export default App;
