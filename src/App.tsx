import React, { useState, useRef, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  useMediaQuery,
} from "@mui/material";
import Header from "./components/Header";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import SaveDialog from "./components/SaveDialog";
import Footer from "./components/Footer";

function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: prefersDark ? "dark" : "light",
        primary: { main: "#6750A4" },
        secondary: { main: "#EADDFF" },
        background: { default: prefersDark ? "#121212" : "#FAFAFA" },
        text: {
          primary: prefersDark ? "#FFFFFF" : "#000000",
          secondary: prefersDark ? "#B0B0B0" : "#666666",
        },
      },
      shape: { borderRadius: 16 },
      typography: {
        fontFamily: ["Google Sans", "Roboto", "Arial", "sans-serif"].join(","),
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
        // Add more if needed
      ],
    }), [prefersDark]
  );

  const [editorState, setEditorState] = useState({
    text: "",
    font: "Google Sans",
    weight: 400,
    size: 36,
    textColor: prefersDark ? "#FFFFFF" : "#000000",
    bgColor: "transparent",
    align: "center",
    canvasSize: { width: 800, height: 800 },
    lineHeight: 1.2,
    letterSpacing: 0,
    wordSpacing: 0,
    transparentBackground: true,
  });

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Update text color when theme changes
  React.useEffect(() => {
    setEditorState(prev => ({
      ...prev,
      textColor: prefersDark ? "#FFFFFF" : "#000000"
    }));
  }, [prefersDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="md" sx={{ px: 2 }}>
        <EditorPanel
          state={editorState}
          setState={setEditorState}
          onSave={() => setSaveDialogOpen(true)}
        />
        <PreviewPanel state={editorState} ref={previewRef} />
        <SaveDialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          previewRef={previewRef}
          state={editorState}
        />
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
