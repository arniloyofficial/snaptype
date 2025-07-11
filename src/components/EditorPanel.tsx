import React, { useEffect, useState } from "react";
import {
  Paper, Box, TextField, InputAdornment, Button,
  MenuItem, Select, FormControl, InputLabel, Typography, IconButton 
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { fonts, fontWeights } from "../fonts"; // See fonts.tsx below

export default function EditorPanel({ state, setState, onSave }: any) {
  const [fontSearch, setFontSearch] = useState("");
  const [filteredFonts, setFilteredFonts] = useState(fonts);

  useEffect(() => {
    setFilteredFonts(
      fonts.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()))
    );
  }, [fontSearch]);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>Editor</Typography>
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        {/* Font dropdown with search */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Font</InputLabel>
          <Select
            value={state.font}
            label="Font"
            onChange={e => setState({ ...state, font: e.target.value })}
            MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
          >
            <MenuItem>
              <TextField
                placeholder="Search font"
                value={fontSearch}
                onChange={e => setFontSearch(e.target.value)}
                size="small"
                sx={{ width: "100%" }}
              />
            </MenuItem>
            {filteredFonts.map(font => (
              <MenuItem key={font} value={font}>{font}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Font style/weight dropdown */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Style/Weight</InputLabel>
          <Select
            value={state.weight}
            label="Style/Weight"
            onChange={e => setState({ ...state, weight: e.target.value })}
          >
            {fontWeights[state.font]?.map(weight => (
              <MenuItem key={weight} value={weight}>{weight}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Text size input */}
        <TextField
          label="Text Size"
          type="number"
          value={state.size}
          onChange={e =>
            setState({ ...state, size: Number(e.target.value) })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">px</InputAdornment>
            ),
            inputProps: { min: 8, max: 200, step: 1 }
          }}
          sx={{ width: 100 }}
        />

        {/* Text color */}
        <IconButton
          onClick={() => {
            const color = prompt("Enter text color hex", state.textColor);
            if (color) setState({ ...state, textColor: color });
          }}
          title="Text Color"
        >
          <ColorLensIcon sx={{ color: state.textColor }} />
        </IconButton>

        {/* Background color */}
        <IconButton
          onClick={() => {
            const color = prompt("Enter background color hex (or 'transparent')", state.bgColor);
            if (color) setState({ ...state, bgColor: color });
          }}
          title="Background Color"
        >
          <ColorLensIcon sx={{ color: state.bgColor === "transparent" ? "#ccc" : state.bgColor }} />
        </IconButton>

        {/* Text alignment */}
        <Box>
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

        {/* Canvas size selector */}
        <TextField
          label="Canvas Width"
          type="number"
          value={state.canvasSize.width}
          onChange={e =>
            setState({ ...state, canvasSize: { ...state.canvasSize, width: Number(e.target.value) } })
          }
          sx={{ width: 100 }}
        />
        <TextField
          label="Canvas Height"
          type="number"
          value={state.canvasSize.height}
          onChange={e =>
            setState({ ...state, canvasSize: { ...state.canvasSize, height: Number(e.target.value) } })
          }
          sx={{ width: 100 }}
        />
      </Box>

      {/* Text input box */}
      <Box sx={{ mt: 3 }}>
        <TextField
          label="Enter your text"
          multiline
          fullWidth
          minRows={3}
          value={state.text}
          onChange={e => setState({ ...state, text: e.target.value })}
          sx={{ fontFamily: state.font }}
        />
      </Box>

      {/* Save image button */}
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button variant="contained" color="primary" onClick={onSave}>
          Save Image
        </Button>
      </Box>
    </Paper>
  );
}
