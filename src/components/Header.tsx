import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Link } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import logo from "../../public/logo.svg";

export default function Header() {
  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar>
        <img src={logo} alt="Logo" style={{ height: 32, marginRight: 16 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Google Fonts Text Exporter
        </Typography>
        <Link href="https://github.com/arniloyofficial/google-fonts-text-exporter" target="_blank" rel="noopener">
          <IconButton color="inherit">
            <GitHubIcon />
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
