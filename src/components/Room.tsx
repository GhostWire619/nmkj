import React from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

interface Props {
  roomInputref: any;
  handleClick: () => void;
  logout: () => void;
}

const Room: React.FC<Props> = ({ roomInputref, handleClick, logout }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={2}
    >
      <Box mb={4}>
        <Typography variant="h5" gutterBottom sx={{ color: "purple" }}>
          Enter Room Name
        </Typography>
        <TextField
          label="Room Name"
          inputRef={roomInputref}
          variant="outlined"
          fullWidth
          autoComplete="off"
          sx={{ backgroundColor: "#333" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{ mt: 2 }}
        >
          Enter Chat
        </Button>
      </Box>
      <Button variant="outlined" color="secondary" onClick={logout}>
        Logout
      </Button>
    </Box>
  );
};

export default Room;
