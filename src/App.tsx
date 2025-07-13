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
import BackgroundPanel from "./components/BackgroundPanel";
import TextLayerPanel from "./components/TextLayerPanel";
import InteractiveCanvas from "./components/InteractiveCanvas";
import { useTextLayers } from "./hooks/useTextLayers";

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

export interface BackgroundState {
  type: 'solid' | 'gradient' | 'image' | 'template';
  solidColor: string;
  gradientColors: string[];
  gradientDirection: string;
  imageUrl: string;
  imageFile: File | null;
  templateId: string;
  blur: number;
  opacity: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  grayscale: number;
  sepia: number;
}

export interface TextLayer {
  id: string;
  text: string;
  font: string;
  weight: number;
  size: number;
  color: string;
  align: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  shadow: {
    enabled: boolean;
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
  stroke: {
    enabled: boolean;
    color: string;
    width: number;
  };
}

function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof colorPalettes>("purple");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'background' | 'layers'>('text');
  const previewRef = useRef<HTMLDivElement>(null);

  // Background state
  const [backgroundState, setBackgroundState] = useState<BackgroundState>({
    type: 'solid',
    solidColor: prefersDark ? "#121212" : "#ffffff",
    gradientColors: ['#6750A4', '#1976D2'],
    gradientDirection: 'linear-gradient(45deg, var(--color1), var(--color2))',
    imageUrl: '',
    imageFile: null,
    templateId: '',
    blur: 0,
    opacity: 100,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    grayscale: 0,
    sepia: 0,
  });

  // Canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });
  
  // Text layers hook
  const {
    textLayers,
    activeLayerId,
    addTextLayer,
    updateTextLayer,
    deleteTextLayer,
    selectTextLayer,
    duplicateTextLayer,
    reorderTextLayers,
  } = useTextLayers();

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

  // Update background color when theme changes
  React.useEffect(() => {
    if (backgroundState.type === 'solid') {
      setBackgroundState(prev => ({
        ...prev,
        solidColor: prefersDark ? "#121212" : "#ffffff"
      }));
    }
  }, [prefersDark, backgroundState.type]);

  // Handle canvas size changes with responsive adjustments
  const handleCanvasSizeChange = (newSize: { width: number; height: number }) => {
    const responsiveWidth = getResponsiveCanvasWidth(newSize.width);
    const aspectRatio = newSize.height / newSize.width;
    const responsiveHeight = responsiveWidth * aspectRatio;
    
    setCanvasSize({
      width: responsiveWidth,
      height: responsiveHeight
    });
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
        {/* Tab Navigation */}
        <nav style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e0e0e0' }}>
            {[
              { key: 'text', label: 'Text Layers' },
              { key: 'background', label: 'Background' },
              { key: 'layers', label: 'Layer Manager' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: activeTab === tab.key ? theme.palette.primary.main : 'transparent',
                  color: activeTab === tab.key ? '#ffffff' : theme.palette.text.primary,
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Conditional Panel Rendering */}
        {activeTab === 'text' && (
          <EditorPanel
            textLayers={textLayers}
            activeLayerId={activeLayerId}
            onAddTextLayer={addTextLayer}
            onUpdateTextLayer={updateTextLayer}
            onSelectTextLayer={selectTextLayer}
            onDeleteTextLayer={deleteTextLayer}
            onSave={() => setSaveDialogOpen(true)}
            canvasSize={canvasSize}
            onCanvasSizeChange={handleCanvasSizeChange}
          />
        )}

        {activeTab === 'background' && (
          <BackgroundPanel
            backgroundState={backgroundState}
            onBackgroundChange={setBackgroundState}
            canvasSize={canvasSize}
          />
        )}

        {activeTab === 'layers' && (
          <TextLayerPanel
            textLayers={textLayers}
            activeLayerId={activeLayerId}
            onSelectTextLayer={selectTextLayer}
            onUpdateTextLayer={updateTextLayer}
            onDeleteTextLayer={deleteTextLayer}
            onDuplicateTextLayer={duplicateTextLayer}
            onReorderLayers={reorderTextLayers}
          />
        )}

        {/* Interactive Canvas */}
        <InteractiveCanvas
          canvasSize={canvasSize}
          backgroundState={backgroundState}
          textLayers={textLayers}
          activeLayerId={activeLayerId}
          onSelectTextLayer={selectTextLayer}
          onUpdateTextLayer={updateTextLayer}
          ref={previewRef}
        />

        <SaveDialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          previewRef={previewRef}
          canvasSize={canvasSize}
          backgroundState={backgroundState}
          textLayers={textLayers}
        />
      </Container>
      <Footer 
        selectedTheme={selectedTheme} 
        colorPalettes={colorPalettes} 
        isDark={prefersDark}
      />
    </ThemeProvider>
  );
}

export default App;
