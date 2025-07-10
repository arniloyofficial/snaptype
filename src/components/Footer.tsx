import React from "react";
import { Typography, Box } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ textAlign: "center", py: 2, bgcolor: "background.paper", mt: 4 }}>
      <Typography variant="body2" color="text.secondary">
        Made with ❤️ by <b>arniloyofficial</b>
      </Typography>
    </Box>
  );
}
