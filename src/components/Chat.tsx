import { useState, useEffect } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
interface Props {
  room: string;
}
interface Message {
  text: string;
  createdAt: any; // Use Firebase Timestamp or Date as per your data structure
  user: string | null;
  room: string;
  id: string;
}

export const Chat: React.FC<Props> = ({ room }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      const messagesArray: Message[] = [];
      snapshot.forEach((doc) => {
        messagesArray.push({ ...doc.data(), id: doc.id } as Message);
      });
      setMessages(messagesArray);
    });
    return () => unsuscribe();
  }, [room]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!room) {
      console.error("Room field is undefined.");
      return;
    }
    if (newMessage.trim() === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser?.displayName,
      room: room,
    });
    setNewMessage("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="type ur message here"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button type="submit">Send</button>
        <div>
          {messages.map((m) => (
            <p>
              {m.user}:{m.text}
            </p>
          ))}
        </div>
      </form>
    </div>
  );
};
