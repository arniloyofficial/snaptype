// src/components/TextLayerPanel.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { SketchPicker } from "react-color";

import { Element } from "../types";

interface Props {
  selectedElement?: Element;
  onUpdate: (changes: Partial<Element>) => void;
}

export default function TextLayerPanel({ selectedElement, onUpdate }: Props) {
  const [fontSize, setFontSize] = useState(36);
  const [fontFamily, setFontFamily] = useState("Google Sans");
  const [color, setColor] = useState("#000000");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strike, setStrike] = useState(false);

  useEffect(() => {
    if (!selectedElement || selectedElement.type !== "text") return;

    setFontSize(selectedElement.fontSize || 36);
    setFontFamily(selectedElement.fontFamily || "Google Sans");
    setColor(selectedElement.color || "#000000");
    setLineHeight(selectedElement.lineHeight || 1.2);
    setLetterSpacing(selectedElement.letterSpacing || 0);
    setWordSpacing(selectedElement.wordSpacing || 0);
    setTextAlign(selectedElement.textAlign || "left");
    setBold(selectedElement.fontWeight === "bold" || selectedElement.fontWeight === 700);
    setItalic(!!selectedElement.italic);
    setUnderline(!!selectedElement.underline);
    setStrike(!!selectedElement.strikethrough);
  }, [selectedElement]);

  if (!selectedElement || selectedElement.type !== "text") return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>📝 Formatting</Typography>

      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Font</InputLabel>
          <Select
            value={fontFamily}
            label="Font"
            onChange={(e) => {
              const value = e.target.value;
              setFontFamily(value);
              onUpdate({ fontFamily: value });
            }}
          >
            <MenuItem value="Google Sans">Google Sans</MenuItem>
            <MenuItem value="Roboto">Roboto</MenuItem>
            <MenuItem value="Poppins">Poppins</MenuItem>
            <MenuItem value="Lato">Lato</MenuItem>
            <MenuItem value="Open Sans">Open Sans</MenuItem>
            <MenuItem value="Inter">Inter</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body2">Font Size</Typography>
        <Slider
          value={fontSize}
          min={12}
          max={200}
          step={1}
          onChange={(_, val) => {
            const size = Number(val);
            setFontSize(size);
            onUpdate({ fontSize: size });
          }}
        />

        <Typography variant="body2">Text Color</Typography>
        <SketchPicker
          color={color}
          onChangeComplete={(c) => {
            setColor(c.hex);
            onUpdate({ color: c.hex });
          }}
        />

        <Typography variant="body2">Line Height</Typography>
        <Slider
          value={lineHeight}
          min={1}
          max={3}
          step={0.1}
          onChange={(_, val) => {
            const lh = Number(val);
            setLineHeight(lh);
            onUpdate({ lineHeight: lh });
          }}
        />

        <Typography variant="body2">Letter Spacing</Typography>
        <Slider
          value={letterSpacing}
          min={-5}
          max={20}
          step={0.5}
          onChange={(_, val) => {
            const ls = Number(val);
            setLetterSpacing(ls);
            onUpdate({ letterSpacing: ls });
          }}
        />

        <Typography variant="body2">Word Spacing</Typography>
        <Slider
          value={wordSpacing}
          min={-5}
          max={40}
          step={1}
          onChange={(_, val) => {
            const ws = Number(val);
            setWordSpacing(ws);
            onUpdate({ wordSpacing: ws });
          }}
        />

        <Typography variant="body2">Style</Typography>
        <ToggleButtonGroup size="small">
          <ToggleButton
            value="bold"
            selected={bold}
            onChange={() => {
              const newVal = !bold;
              setBold(newVal);
              onUpdate({ fontWeight: newVal ? 700 : 400 });
            }}
          >
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton
            value="italic"
            selected={italic}
            onChange={() => {
              const newVal = !italic;
              setItalic(newVal);
              onUpdate({ italic: newVal });
            }}
          >
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton
            value="underline"
            selected={underline}
            onChange={() => {
              const newVal = !underline;
              setUnderline(newVal);
              onUpdate({ underline: newVal });
            }}
          >
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton
            value="strike"
            selected={strike}
            onChange={() => {
              const newVal = !strike;
              setStrike(newVal);
              onUpdate({ strikethrough: newVal });
            }}
          >
            <StrikethroughSIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="body2">Alignment</Typography>
        <ToggleButtonGroup
          value={textAlign}
          exclusive
          onChange={(_, value) => {
            if (value) {
              setTextAlign(value);
              onUpdate({ textAlign: value });
            }
          }}
          aria-label="text alignment"
          size="small"
        >
          <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
          <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
          <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
          <ToggleButton value="justify"><FormatAlignJustifyIcon /></ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
}
