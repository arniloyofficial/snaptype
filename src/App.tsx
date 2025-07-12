import React, { useState, useRef, useMemo, useEffect } from "react";
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

// Material Design v3 Color Palettes
const colorPalettes = {
  purple: {
    name: "Purple",
    primary: "#6750A4",
    secondary: "#EADDFF",
    lightBg: "#FAF8FF",
    darkBg: "#121212",
  },
  blue: {
    name: "Blue",
    primary: "#1976D2",
    secondary: "#BBDEFB",
    lightBg: "#F3F9FF",
    darkBg: "#0D1B2A",
  },
  green: {
    name: "Green",
    primary: "#2E7D32",
    secondary: "#C8E6C9",
    lightBg: "#F1F8E9",
    darkBg: "#1B5E20",
  },
  orange: {
    name: "Orange",
    primary: "#F57C00",
    secondary: "#FFE0B2",
    lightBg: "#FFF8E1",
    darkBg: "#E65100",
  },
  red: {
    name: "Red",
    primary: "#D32F2F",
    secondary: "#FFCDD2",
    lightBg: "#FFEBEE",
    darkBg: "#B71C1C",
  },
  teal: {
    name: "Teal",
    primary: "#00796B",
    secondary: "#B2DFDB",
    lightBg: "#E0F2F1",
    darkBg: "#004D40",
  },
};

function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof colorPalettes>("purple");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Handle responsive screen width
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive canvas width
  const getResponsiveCanvasWidth = (originalWidth: number) => {
    const maxWidth = screenWidth > 1200 ? 1000 : 
                    screenWidth > 768 ? screenWidth * 0.8 : 
                    screenWidth * 0.9;
    return Math.min(originalWidth, maxWidth);
  };

  const theme = useMemo(() => {
    const palette = colorPalettes[selectedTheme];
    return createTheme({
      palette: {
        mode: prefersDark ? "dark" : "light",
        primary: { main: palette.primary },
        secondary: { main: palette.secondary },
        background: { 
          default: prefersDark ? palette.darkBg : palette.lightBg,
          paper: prefersDark ? "#1E1E1E" : "#FFFFFF"
        },
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
        `0px 2px 8px ${palette.primary}14`,
        `0px 4px 16px ${palette.primary}20`,
      ],
    });
  }, [prefersDark, selectedTheme]);

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

  // Handle canvas size changes with responsive adjustments
  const handleCanvasSizeChange = (newSize: { width: number; height: number }) => {
    const responsiveWidth = getResponsiveCanvasWidth(newSize.width);
    const aspectRatio = newSize.height / newSize.width;
    const responsiveHeight = responsiveWidth * aspectRatio;
    
    setEditorState(prev => ({
      ...prev,
      canvasSize: {
        width: responsiveWidth,
        height: responsiveHeight
      }
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header 
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
        colorPalettes={colorPalettes}
      />
      <Container maxWidth="lg" sx={{ px: 2, minHeight: 'calc(100vh - 200px)' }}>
        <EditorPanel
          state={editorState}
          setState={setEditorState}
          onSave={() => setSaveDialogOpen(true)}
          onCanvasSizeChange={handleCanvasSizeChange}
        />
        <PreviewPanel state={editorState} ref={previewRef} />
        <SaveDialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          previewRef={previewRef}
          state={editorState}
        />
      </Container>
      <Footer selectedTheme={selectedTheme} colorPalettes={colorPalettes} />
    </ThemeProvider>
  );
}

export default App;
