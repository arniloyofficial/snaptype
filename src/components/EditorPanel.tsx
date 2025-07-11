import React from "react";
import {
  Paper, Box, TextField, InputAdornment, Button,
  MenuItem, Select, FormControl, InputLabel, Typography, IconButton,
  Slider, Checkbox, FormControlLabel
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import PaletteIcon from "@mui/icons-material/Palette";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { fontWeights } from "../fonts";
import FontSelector from "./FontSelector";

const presetSizes = {
  "1:1": { width: 800, height: 800 },
  "16:9": { width: 1280, height: 720 },
  "4:3": { width: 1024, height: 768 },
  "9:16": { width: 720, height: 1280 },
};

export default function EditorPanel({ state, setState, onSave }: any) {
  const weights = fontWeights || ["400"];

  // Get current preset key
  const getCurrentPreset = () => {
    const currentPreset = Object.entries(presetSizes).find(
      ([_, size]) => size.width === state.canvasSize.width && size.height === state.canvasSize.height
    );
    return currentPreset ? currentPreset[0] : "1:1";
  };

  const handleTransparentBackgroundChange = (checked: boolean) => {
    setState({
      ...state,
      transparentBackground: checked,
      bgColor: checked ? "transparent" : "#ffffff"
    });
  };

  const handleBgColorChange = (color: string) => {
    setState({
      ...state,
      bgColor: color,
      transparentBackground: false
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>Create a Snaptext</Typography>
      
      {/* Row 1: Font and Weight */}
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
        <FontSelector
          value={state.font}
          onChange={font => setState({ ...state, font })}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Weight</InputLabel>
          <Select
            value={state.weight}
            label="Weight"
            onChange={e => setState({ ...state, weight: e.target.value })}
          >
            {weights.map(weight => (
              <MenuItem key={weight} value={weight}>{weight}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Row 2: Size and Colors */}
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
        <TextField
          label="Text Size"
          type="number"
          value={state.size}
          onChange={e => setState({ ...state, size: Number(e.target.value) })}
          InputProps={{
            endAdornment: <InputAdornment position="end">px</InputAdornment>,
            inputProps: { min: 8, max: 200, step: 1 }
          }}
          sx={{ width: 120 }}
        />

        {/* Visual Text Color Picker with Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaletteIcon sx={{ color: 'text.secondary' }} />
          <input
            type="color"
            value={state.textColor}
            onChange={e => setState({ ...state, textColor: e.target.value })}
            style={{
              width: 40,
              height: 40,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          />
          <Typography variant="body2">Text Color</Typography>
        </Box>

        {/* Visual Background Color Picker with Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatColorFillIcon sx={{ color: 'text.secondary' }} />
          <input
            type="color"
            value={state.bgColor === "transparent" ? "#ffffff" : state.bgColor}
            onChange={e => handleBgColorChange(e.target.value)}
            disabled={state.transparentBackground}
            style={{
              width: 40,
              height: 40,
              border: 'none',
              borderRadius: '8px',
              cursor: state.transparentBackground ? 'not-allowed' : 'pointer',
              opacity: state.transparentBackground ? 0.5 : 1
            }}
          />
          <Typography variant="body2">BG Color</Typography>
        </Box>
      </Box>

      {/* Row 3: Transparent Background Checkbox */}
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.transparentBackground}
              onChange={e => handleTransparentBackgroundChange(e.target.checked)}
            />
          }
          label="Transparent Background"
        />
      </Box>

      {/* Row 4: Alignment */}
      <Box display="flex" gap={1} alignItems="center" mb={2}>
        <Typography variant="body2" sx={{ mr: 1 }}>Align:</Typography>
        <IconButton
          color={state.align === "left" ? "primary" : "default"}
          onClick={() => setState({ ...state, align: "left" })}
          title="Align Left"
        >
          <FormatAlignLeftIcon />
        </IconButton>
        <IconButton
          color={state.align === "center" ? "primary" : "default"}
          onClick={() => setState({ ...state, align: "center" })}
          title="Align Center"
        >
          <FormatAlignCenterIcon />
        </IconButton>
        <IconButton
          color={state.align === "right" ? "primary" : "default"}
          onClick={() => setState({ ...state, align: "right" })}
          title="Align Right"
        >
          <FormatAlignRightIcon />
        </IconButton>
      </Box>

      {/* Row 5: Typography Controls */}
      <Box display="flex" gap={3} alignItems="center" flexWrap="wrap" mb={2}>
        {/* Line Height Slider */}
        <Box sx={{ minWidth: 200 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <FormatLineSpacingIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body2">Line Height</Typography>
          </Box>
          <Slider
            value={state.lineHeight}
            onChange={(e, newValue) => setState({ ...state, lineHeight: newValue })}
            min={0.5}
            max={3}
            step={0.1}
            valueLabelDisplay="auto"
            sx={{ width: '100%' }}
          />
        </Box>

        {/* Letter Spacing Slider */}
        <Box sx={{ minWidth: 200 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <TextFieldsIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body2">Letter Spacing</Typography>
          </Box>
          <Slider
            value={state.letterSpacing}
            onChange={(e, newValue) => setState({ ...state, letterSpacing: newValue })}
            min={-5}
            max={20}
            step={0.5}
            valueLabelDisplay="auto"
            sx={{ width: '100%' }}
          />
        </Box>

        {/* Word Spacing Slider */}
        <Box sx={{ minWidth: 200 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <SpaceBarIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body2">Word Spacing</Typography>
          </Box>
          <Slider
            value={state.wordSpacing}
            onChange={(e, newValue) => setState({ ...state, wordSpacing: newValue })}
            min={-10}
            max={50}
            step={1}
            valueLabelDisplay="auto"
            sx={{ width: '100%' }}
          />
        </Box>
      </Box>

      {/* Row 6: Canvas Settings */}
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Canvas Preset</InputLabel>
          <Select
            value={getCurrentPreset()}
            label="Canvas Preset"
            onChange={e => {
              const size = presetSizes[e.target.value as keyof typeof presetSizes];
              if (size) setState({ ...state, canvasSize: size });
            }}
          >
            {Object.keys(presetSizes).map(key => (
              <MenuItem key={key} value={key}>{key}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Width"
          type="number"
          value={state.canvasSize.width}
          onChange={e =>
            setState({ ...state, canvasSize: { ...state.canvasSize, width: Number(e.target.value) } })
          }
          sx={{ width: 100 }}
        />
        <TextField
          label="Height"
          type="number"
          value={state.canvasSize.height}
          onChange={e =>
            setState({ ...state, canvasSize: { ...state.canvasSize, height: Number(e.target.value) } })
          }
          sx={{ width: 100 }}
        />
      </Box>

      {/* Text input */}
      <TextField
        label="Enter your text"
        multiline
        fullWidth
        minRows={3}
        value={state.text}
        onChange={e => setState({ ...state, text: e.target.value })}
        sx={{ fontFamily: state.font, mb: 2 }}
      />

      {/* Save button */}
      <Box sx={{ textAlign: "right" }}>
        <Button variant="contained" color="primary" onClick={onSave}>
          Save Image
        </Button>
      </Box>
    </Paper>
  );
}
