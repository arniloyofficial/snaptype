import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function Footer() {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      py: 3, 
      bgcolor: theme.palette.primary.main, // Use theme primary color (same as header)
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
