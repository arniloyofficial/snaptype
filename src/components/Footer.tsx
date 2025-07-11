import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ 
      py: 3, 
      bgcolor: "#6750A4", // Same as header primary color
      textAlign: "center", 
      mt: 5 
    }}>
      <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
        Built with ❤️ by{" "}
        <a 
          href="https://arniloy.framer.website" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#FFFFFF', 
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          Arifin Rahman Niloy
        </a>
      </Typography>
    </Box>
  );
}
