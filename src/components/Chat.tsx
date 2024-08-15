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
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = collection(db, "messages");

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
    if (!room || newMessage.trim() === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser?.displayName,
      room: room,
    });

    setNewMessage("");
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "80vh",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: 2,
        borderRadius: "12px",
      }}
    >
      <List sx={{ flexGrow: 1, overflowY: "auto", paddingBottom: 2 }}>
        {messages.map((m) => (
          <ListItem key={m.id} alignItems="flex-start">
            <Avatar sx={{ bgcolor: "#3f51b5", marginRight: 2 }}>
              {m.user ? m.user.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <ListItemText
              primary={
                <Typography variant="body1" fontWeight="bold">
                  {m.user || "Unknown"}
                </Typography>
              }
              secondary={<Typography variant="body2">{m.text}</Typography>}
            />
          </ListItem>
        ))}
      </List>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 2 }}
      >
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
