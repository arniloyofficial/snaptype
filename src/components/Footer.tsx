import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ py: 3, bgcolor: "#EADDFF", textAlign: "center", mt: 5 }}>
      <Typography variant="body2" color="textSecondary">
        Built by <a href="https://github.com/arniloyofficial" target="_blank" rel="noopener noreferrer">Arniloy Official</a>
      </Typography>
    </Box>
  );
}
