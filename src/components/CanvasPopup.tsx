import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Paper,
  Chip,
} from "@mui/material";

interface CanvasPopupProps {
  state: any;
  setState: (state: any) => void;
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
  onClose: () => void;
}

// Enhanced preset sizes with more popular options
const presetSizes = {
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

const CanvasPopup: React.FC<CanvasPopupProps> = ({ state, setState, onCanvasSizeChange, onClose }) => {
  // Get current preset key
  const getCurrentPreset = () => {
    const currentPreset = Object.entries(presetSizes).find(
      ([_, size]) => size.width === state.canvasSize.width && size.height === state.canvasSize.height
    );
    return currentPreset ? currentPreset[0] : "Custom";
  };

  const handlePresetChange = (presetKey: string) => {
    const size = presetSizes[presetKey as keyof typeof presetSizes];
    if (size) {
      setState({ 
        ...state, 
        canvasSize: { 
          width: size.width, 
          height: size.height 
        }
      });
      onCanvasSizeChange(size);
    }
  };

  const handleCanvasWidthChange = (newWidth: number) => {
    const newSize = { width: newWidth, height: state.canvasSize.height };
    setState({ 
      ...state, 
      canvasSize: newSize
    });
    onCanvasSizeChange(newSize);
  };

  const handleCanvasHeightChange = (newHeight: number) => {
    const newSize = { width: state.canvasSize.width, height: newHeight };
    setState({ 
      ...state, 
      canvasSize: newSize
    });
    onCanvasSizeChange(newSize);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Canvas Settings
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Preset Sizes */}
        <FormControl fullWidth>
          <InputLabel>Canvas Preset</InputLabel>
          <Select
            value={getCurrentPreset()}
            label="Canvas Preset"
            onChange={(e) => handlePresetChange(e.target.value)}
          >
            {Object.keys(presetSizes).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
            <MenuItem value="Custom">Custom Size</MenuItem>
          </Select>
        </FormControl>

        {/* Popular Presets as Chips */}
        <Box>
          <Typography variant="body2" gutterBottom>
            Quick Presets:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['1:1 Square', 'Instagram Story', 'Twitter Post', 'YouTube Thumbnail'].map((preset) => (
              <Chip
                key={preset}
                label={preset}
                onClick={() => handlePresetChange(preset)}
                color={getCurrentPreset() === preset ? 'primary' : 'default'}
                size="small"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>

        {/* Custom Dimensions */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Width"
              type="number"
              value={state.canvasSize.width}
              onChange={(e) => handleCanvasWidthChange(Number(e.target.value))}
              InputProps={{
                inputProps: { 
                  min: 100,
                  max: 4000
                }
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Height"
              type="number"
              value={state.canvasSize.height}
              onChange={(e) => handleCanvasHeightChange(Number(e.target.value))}
              InputProps={{
                inputProps: { 
                  min: 100,
                  max: 4000
                }
              }}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Canvas Info */}
        <Paper sx={{ p: 2, backgroundColor: 'action.hover' }}>
          <Typography variant="body2">
            <strong>Current Size:</strong> {state.canvasSize.width} × {state.canvasSize.height}px
          </Typography>
          <Typography variant="body2">
            <strong>Aspect Ratio:</strong> {(state.canvasSize.width / state.canvasSize.height).toFixed(2)}:1
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default CanvasPopup;