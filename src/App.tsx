import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  useMediaQuery,
} from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileToolbar from "./components/MobileToolbar";
import PreviewPanel from "./components/PreviewPanel";
import SaveDialog from "./components/SaveDialog";

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
    darkBg: "#121212",
  },
  green: {
    name: "Green",
    primary: "#2E7D32",
    secondary: "#C8E6C9",
    lightBg: "#F1F8E9",
    darkBg: "#121212",
  },
  orange: {
    name: "Orange",
    primary: "#F57C00",
    secondary: "#FFE0B2",
    lightBg: "#FFF8E1",
    darkBg: "#121212",
  },
  red: {
    name: "Red",
    primary: "#D32F2F",
    secondary: "#FFCDD2",
    lightBg: "#FFEBEE",
    darkBg: "#121212",
  },
  teal: {
    name: "Teal",
    primary: "#00796B",
    secondary: "#B2DFDB",
    lightBg: "#E0F2F1",
    darkBg: "#121212",
  },
};

function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const isMobile = useMediaQuery("(max-width:768px)");
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof colorPalettes>("purple");

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
        `0px 8px 32px ${palette.primary}30`,
      ],
    });
  }, [prefersDark, selectedTheme]);

  const [editorState, setEditorState] = useState({
    text: "",
    font: "Google Sans",
    weight: 400,
    size: 36,
    textColor: prefersDark ? "#FFFFFF" : "#000000",
    bgColor: prefersDark ? "#1E1E1E" : "#FFFFFF",
    align: "center",
    canvasSize: { width: 800, height: 800 },
    lineHeight: 1.2,
    letterSpacing: 0,
    wordSpacing: 0,
    transparentBackground: false,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Update text color when theme changes
  useEffect(() => {
    setEditorState(prev => ({
      ...prev,
      textColor: prefersDark ? "#FFFFFF" : "#000000"
    }));
  }, [prefersDark]);

  // Handle canvas size changes - no responsive adjustments needed since we use fixed 500px height
  const handleCanvasSizeChange = (newSize: { width: number; height: number }) => {
    setEditorState(prev => ({
      ...prev,
      canvasSize: newSize
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Main App Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Header 
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          colorPalettes={colorPalettes}
        />
        
        {/* Main Content Area */}
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            overflow: 'hidden', // Prevent content from spilling over
          }}
        >
          {/* Desktop Sidebar */}
          {!isMobile && (
            <Box
              sx={{
                width: 304, // 300px + 4px margin
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                py: 2, // Vertical padding
              }}
            >
              <Sidebar
                state={editorState}
                setState={setEditorState}
                onSave={() => setSaveDialogOpen(true)}
                onCanvasSizeChange={handleCanvasSizeChange}
              />
            </Box>
          )}

          {/* Main Content Area - Centered Canvas */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'auto',
              py: 2, // Vertical padding
              pb: isMobile ? 12 : 2, // Extra padding for mobile toolbar
            }}
          >
            <PreviewPanel state={editorState} ref={previewRef} />
          </Box>

          {/* Mobile Bottom Toolbar */}
          {isMobile && (
            <MobileToolbar
              state={editorState}
              setState={setEditorState}
              onSave={() => setSaveDialogOpen(true)}
              onCanvasSizeChange={handleCanvasSizeChange}
            />
          )}
        </Box>
      </Box>

      {/* Save Dialog */}
      <SaveDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        previewRef={previewRef}
        state={editorState}
      />
    </ThemeProvider>
  );
}

export default App;