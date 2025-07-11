import React, { useState, useRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import SaveDialog from "./components/SaveDialog";
import Footer from "./components/Footer";

const theme = createTheme({
  palette: {
    primary: { main: "#6750A4" },
    secondary: { main: "#EADDFF" },
    background: { default: "#F6F6F6" }
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: [
      "Google Sans",
      "Roboto",
      "Arial",
      "sans-serif"
    ].join(","),
  },
  transitions: {
    duration: {
      enteringScreen: 250,
      leavingScreen: 200,
    },
  },
  shadows: [
    "none",
    "0px 2px 8px rgba(103,80,164,0.14)",
    // ...add more expressive shadows if needed
  ],
});

function App() {
  const [editorState, setEditorState] = useState({
    text: "",
    font: "Roboto",
    style: "Regular",
    weight: 400,
    size: 36,
    textColor: "#000000",
    bgColor: "transparent",
    align: "left",
    canvasSize: { width: 600, height: 300 },
  });

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main>
        <EditorPanel
          state={editorState}
          setState={setEditorState}
          onSave={() => setSaveDialogOpen(true)}
        />
        <PreviewPanel
          state={editorState}
          ref={previewRef}
        />
        <SaveDialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          previewRef={previewRef}
          state={editorState}
        />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
