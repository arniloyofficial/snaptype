import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface FooterProps {
  selectedTheme: string;
  colorPalettes: Record<string, any>;
}

export default function Footer({ selectedTheme, colorPalettes }: FooterProps) {
  const theme = useTheme();
  const currentPalette = colorPalettes[selectedTheme];
  
  return (
    <Box 
      sx={{ 
        py: 3, 
        px: 2,
        bgcolor: theme.palette.primary.main, // This will automatically match the header color
        textAlign: "center", 
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
        // Ensure it stays at bottom
        position: 'relative',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#FFFFFF',
          fontWeight: 500,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        Built with ❤️ by{" "}
        <Box
          component="a"
          href="https://arniloy.framer.website" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ 
            color: '#FFFFFF', 
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            borderBottom: '1px solid transparent',
            '&:hover': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.7)',
              opacity: 0.9,
            }
          }}
        >
          Arifin Rahman Niloy
        </Box>
      </Typography>
      
      {/* Optional: Add current theme indicator */}
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          }}
        />
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.75rem',
            fontWeight: 400
          }}
        >
          {currentPalette.name} Theme
        </Typography>
      </Box>
    </Box>
  );
}
