import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
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
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
  room: string;
  cookie: string;
}
interface Message {
  text: string;
  createdAt: any; // Use Firebase Timestamp or Date as per your data structure
  user: string | null;
  room: string;
  id: string;
}

export const Chat: React.FC<Props> = ({ room, cookie }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = collection(db, "messages");
  const navigate = useNavigate();

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
  const name = cookie;

  console.log(name);
  console.log("yoo");
  return (
    <Box
      component={Paper}
      elevation={6}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "90vh",
        width: "100%",
        maxWidth: "400px",

        padding: 2,
        borderRadius: "12px",
        color: "white",
        // backgroundColor: "transparent",
        // backgroundImage: `url(${bgimg2})`,
        backgroundColor: "black",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
          backgroundColor: "transparent",
          borderRadius: 5,
          overflow: "hidden",
          height: 150,
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center", color: "purple" }}
        >
          Room {room}
        </Typography>
      </Box>
      <List
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          paddingBottom: 2,
          backgroundColor: "black",
          // backgroundImage: `url(${bgimg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          "&::-webkit-scrollbar": {
            backgroundColor: "Transparent", // Transparent track background
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#444", // Color of the scrollbar thumb
            borderRadius: "4px", // Rounded corners for the thumb
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555", // Darker color on hover
          },
        }}
      >
        {messages.map((m) => (
          <>
            {name == m.user ? (
              <Box display="flex" justifyContent="flex-end" key={m.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: "#202c33",
                    boxShadow: "2px 2px 5px rgba(0,0,0,.6)",
                    marginBottom: 2,
                    borderRadius: 2,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    width: "70%",
                  }}
                >
                  <ListItemText
                    secondary={
                      <Typography variant="body2" sx={{ textAlign: "right" }}>
                        {m.text}
                      </Typography>
                    }
                  />
                </ListItem>
              </Box>
            ) : (
              <ListItem
                key={m.id}
                alignItems="flex-start"
                sx={{
                  boxShadow: "2px 2px 5px rgba(0,0,0,.6)",
                  backgroundColor: "#2a2f32",
                  marginBottom: 2,
                  borderRadius: 2,
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  width: "70%",
                }}
              >
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
            )}
          </>
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
          autoComplete="off"
          sx={{
            autoFill: "none",
            backgroundColor: "#333333",
            borderRadius: 5,
            zIndex: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none", // Border color of the text field
              },
              "&:hover fieldset": {
                border: "none", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                border: "none", // Border color when focused
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#445" }}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
