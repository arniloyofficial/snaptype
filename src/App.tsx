import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FontSelector from "./components/FontSelector";
import StyleSelector from "./components/StyleSelector";
import SizeSelector from "./components/SizeSelector";
import ColorPicker from "./components/ColorPicker";
import BgColorPicker from "./components/BgColorPicker";
import AlignmentSelector from "./components/AlignmentSelector";
import CanvasSizeSelector from "./components/CanvasSizeSelector";
import PreviewPanel from "./components/PreviewPanel";
import ExportButton from "./components/ExportButton";
import TextInputBox from "./components/TextInputBox";

const DEFAULT_FONT = "Roboto";
const DEFAULT_STYLE = "regular";
const DEFAULT_SIZE = 48;
const DEFAULT_COLOR = "#000000";
const DEFAULT_BG = "transparent";
const DEFAULT_ALIGNMENT = "center";
const DEFAULT_CANVAS_SIZE = { width: 800, height: 400 };

function App() {
  const [text, setText] = useState("");
  const [font, setFont] = useState(DEFAULT_FONT);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [bgColor, setBgColor] = useState(DEFAULT_BG);
  const [alignment, setAlignment] = useState(DEFAULT_ALIGNMENT);
  const [canvasSize, setCanvasSize] = useState(DEFAULT_CANVAS_SIZE);

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <main style={{ padding: "32px 8px", minHeight: "80vh", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <FontSelector value={font} onChange={setFont} />
          <StyleSelector font={font} value={style} onChange={setStyle} />
          <SizeSelector value={size} onChange={setSize} />
          <ColorPicker value={color} onChange={setColor} />
          <BgColorPicker value={bgColor} onChange={setBgColor} />
          <AlignmentSelector value={alignment} onChange={setAlignment} />
          <CanvasSizeSelector value={canvasSize} onChange={setCanvasSize} />
        </div>
        <TextInputBox value={text} onChange={setText} />
        <PreviewPanel
          text={text}
          font={font}
          style={style}
          size={size}
          color={color}
          bgColor={bgColor}
          alignment={alignment}
          canvasSize={canvasSize}
        />
        <ExportButton />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
