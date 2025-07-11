import React from "react";
import { AppBar, Toolbar, Link, Box, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Header() {
  return (
    <AppBar position="static" elevation={2} color="primary" sx={{ mb: 3 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src="/logo.svg" 
            alt="Snaptype Logo" 
            style={{ 
              height: '40px', 
              width: 'auto', 
              marginRight: '12px' 
            }} 
          />
        </Box>
        <Box>
          <Link
            href="https://github.com/arniloyofficial/snaptype"
            target="_blank"
            rel="noopener"
            color="inherit"
            underline="none"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <GitHubIcon />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
