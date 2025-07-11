import React from "react";
import { AppBar, Toolbar, Typography, Link, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Header() {
  return (
    <AppBar position="static" elevation={2} color="primary" sx={{ mb: 3 }}>
      <Toolbar>
        <img src="/logo.svg" alt="Snaptype Logo" style={{ height: 32, marginRight: 16 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "Google Sans" }}>
          Snaptype
        </Typography>
        <Box>
          <Link
            href="https://github.com/arniloyofficial/snaptype"
            target="_blank"
            rel="noopener"
            color="inherit"
            underline="none"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <GitHubIcon sx={{ mr: 0.5 }} />
            GitHub Repo
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
