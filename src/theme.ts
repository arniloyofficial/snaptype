import { createTheme } from "@mui/material/styles";

// Material 3 expressive theme starter
const theme = createTheme({
  palette: {
    primary: { main: "#6750A4" },
    secondary: { main: "#625B71" },
    background: { default: "#FAF8FF", paper: "#FFFFFF" },
    text: { primary: "#1C1B1F", secondary: "#49454F" },
  },
  typography: {
    fontFamily: "Google Sans, Roboto, Arial, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    button: { fontWeight: 600 }
  },
  shape: { borderRadius: 16 },
  shadows: [
    "none",
    "0px 2px 8px rgba(0,0,0,0.04)",
    "0px 4px 16px rgba(0,0,0,0.10)"
  ],
  transitions: { duration: { standard: 300 } }
});
export default theme;
