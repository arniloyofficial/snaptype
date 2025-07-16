import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import { Element } from "../types";

type LayerControlsProps = {
  onAddElement: (el: Element) => void;
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
};

const presetSizes: Record<string, { width: number; height: number }> = {
  "1:1 Square": { width: 1080, height: 1080 },
  "16:9 Landscape": { width: 1920, height: 1080 },
  "9:16 Portrait": { width: 1080, height: 1920 },
  "4:3 Standard": { width: 1024, height: 768 },
  "3:2 Photo": { width: 1080, height: 720 },
  "2:1 Banner": { width: 1200, height: 600 },
  "Twitter Post": { width: 1200, height: 675 },
  "Instagram Story": { width: 1080, height: 1920 },
  "Facebook Cover": { width: 1200, height: 630 },
  "YouTube Thumbnail": { width: 1280, height: 720 },
};

export default function LayerControls({ onAddElement, onCanvasSizeChange }: LayerControlsProps) {
  const [textInput, setTextInput] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("1:1 Square");

  const addTextElement = () => {
    if (!textInput.trim()) return;
    const newEl: Element = {
      id: `text_${Date.now()}`,
      type: "text",
      text: textInput,
      x: 50,
      y: 50,
      width: 200,
      height: 60,
      rotation: 0,
      fontFamily: "Arial",
      fontSize: 24,
      fontWeight: "normal",
      color: "#000000",
      textAlign: "left",
    };
    onAddElement(newEl);
    setTextInput("");
  };

  const addImageElement = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const newEl: Element = {
          id: `image_${Date.now()}`,
          type: "image",
          src: reader.result,
          x: 50,
          y: 50,
          width: 200,
          height: 150,
          rotation: 0,
        };
        onAddElement(newEl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      addImageElement(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handlePresetChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const preset = e.target.value as string;
    setSelectedPreset(preset);
    const size = presetSizes[preset];
    onCanvasSizeChange(size);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Add Elements
      </Typography>

      <Stack spacing={1} direction="row" alignItems="center" mb={1}>
        <TextField
          label="New Text"
          size="small"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTextElement()}
          fullWidth
        />
        <Button variant="contained" onClick={addTextElement} disabled={!textInput.trim()}>
          Add
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Button
        variant="outlined"
        component="label"
        startIcon={<AddPhotoAlternateIcon />}
        fullWidth
      >
        Upload Image
        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Canvas Preset
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Preset Size</InputLabel>
        <Select value={selectedPreset} label="Preset Size" onChange={handlePresetChange}>
          {Object.keys(presetSizes).map((preset) => (
            <MenuItem key={preset} value={preset}>
              {preset} ({presetSizes[preset].width}×{presetSizes[preset].height})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
