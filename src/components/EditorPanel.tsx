import React, { useEffect, useState } from "react";
import {
  Paper, Box, TextField, InputAdornment, Button,
  MenuItem, Select, FormControl, InputLabel, Typography, IconButton,
  Slider, Switch, FormControlLabel, useMediaQuery
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import PaletteIcon from "@mui/icons-material/Palette";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FontSelector from "./FontSelector";

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

// Font weights mapping for Google Fonts
const getFontWeights = async (fontFamily: string) => {
  try {
    const response = await fetch(`https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`);
    const cssText = await response.text();
    
    // Parse the CSS to extract available weights
    const weights = [];
    const weightMatches = cssText.match(/font-weight:\s*(\d+)/g);
    
    if (weightMatches) {
      const uniqueWeights = new Set();
      weightMatches.forEach(match => {
        const weight = parseInt(match.match(/\d+/)[0]);
        uniqueWeights.add(weight);
      });
      weights.push(...Array.from(uniqueWeights).sort((a, b) => a - b));
    }
    
    // If no weights found, try alternative method
    if (weights.length === 0) {
      const apiResponse = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyD6UsY0l_2k6pAPE3dRYaZ0sbOBB4_Ax9I&family=${fontFamily.replace(/\s+/g, '+')}`);
      const apiData = await apiResponse.json();
      
      if (apiData.items && apiData.items.length > 0) {
        const font = apiData.items.find((f: any) => f.family === fontFamily);
        if (font && font.variants) {
          const numericWeights = font.variants
            .filter((variant: string) => /^\d+$/.test(variant))
            .map((variant: string) => parseInt(variant))
            .sort((a, b) => a - b);
          weights.push(...numericWeights);
        }
      }
    }
    
    return weights.length > 0 ? weights : [100, 200, 300, 400, 500, 600, 700, 800, 900];
  } catch (error) {
    console.error('Error fetching font weights:', error);
    return [100, 200, 300, 400, 500, 600, 700, 800, 900];
  }
};

// Modern spinner component for number inputs
const ModernSpinnerButton = ({ direction, onClick, disabled }: { direction: 'up' | 'down', onClick: () => void, disabled?: boolean }) => (
  <IconButton
    size="small"
    onClick={onClick}
    disabled={disabled}
    sx={{
      p: 0.3,
      minWidth: 'auto',
      minHeight: 'auto',
      width: 20,
      height: 20,
      borderRadius: '4px',
      bgcolor: 'transparent',
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': {
        bgcolor: 'action.hover',
        borderColor: 'primary.main',
      },
      '&.Mui-disabled': {
        bgcolor: 'action.disabledBackground',
        borderColor: 'action.disabled',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '0.8rem',
      }
    }}
  >
    {direction === 'up' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
  </IconButton>
);

export default function EditorPanel({ state, setState, onSave }: any) {
  const [availableWeights, setAvailableWeights] = useState<number[]>([400]);
  const [isLoadingWeights, setIsLoadingWeights] = useState(false);
  const isDesktop = useMediaQuery('(min-width:900px)');
  const isTablet = useMediaQuery('(min-width:600px)');
  const isMobile = useMediaQuery('(max-width:599px)');

  // Fetch available weights when font changes
  useEffect(() => {
    const fetchWeights = async () => {
      if (!state.font) return;
      
      setIsLoadingWeights(true);
      try {
        const weights = await getFontWeights(state.font);
        setAvailableWeights(weights);
        
        // If current weight is not available, set to closest available weight
        if (!weights.includes(state.weight)) {
          const closestWeight = weights.reduce((prev, curr) => 
            Math.abs(curr - state.weight) < Math.abs(prev - state.weight) ? curr : prev
          );
          setState({ ...state, weight: closestWeight });
        }
      } catch (error) {
        console.error('Error fetching weights:', error);
        setAvailableWeights([100, 200, 300, 400, 500, 600, 700, 800, 900]);
      } finally {
        setIsLoadingWeights(false);
      }
    };
    
    fetchWeights();
  }, [state.font, setState]);

  // Get responsive canvas size based on screen width
  const getResponsiveCanvasSize = (originalSize: { width: number; height: number }) => {
    let maxWidth = window.innerWidth - 100; // Leave some margin
    
    if (isDesktop) {
      maxWidth = Math.min(maxWidth, 800); // Max width for desktop
    } else if (isTablet) {
      maxWidth = Math.min(maxWidth, 600); // Max width for tablet
    } else {
      maxWidth = Math.min(maxWidth, 350); // Max width for mobile
    }

    // Calculate responsive dimensions maintaining aspect ratio
    const aspectRatio = originalSize.height / originalSize.width;
    const responsiveWidth = Math.min(originalSize.width, maxWidth);
    const responsiveHeight = responsiveWidth * aspectRatio;

    return {
      width: responsiveWidth,
      height: responsiveHeight,
      originalWidth: originalSize.width,
      originalHeight: originalSize.height
    };
  };

  // Get current preset key
  const getCurrentPreset = () => {
    const currentPreset = Object.entries(presetSizes).find(
      ([_, size]) => size.width === state.canvasSize.width && size.height === state.canvasSize.height
    );
    return currentPreset ? currentPreset[0] : "1:1 Square";
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

  const handlePresetChange = (presetKey: string) => {
    const size = presetSizes[presetKey as keyof typeof presetSizes];
    if (size) {
      const responsiveSize = getResponsiveCanvasSize(size);
      setState({ 
        ...state, 
        canvasSize: { 
          width: size.width, 
          height: size.height 
        },
        displayCanvasSize: {
          width: responsiveSize.width,
          height: responsiveSize.height
        }
      });
    }
  };

  const handleSizeChange = (newSize: number) => {
    setState({ ...state, size: Math.max(8, Math.min(200, newSize)) });
  };

  const handleCanvasWidthChange = (newWidth: number) => {
    const responsiveSize = getResponsiveCanvasSize({ width: newWidth, height: state.canvasSize.height });
    setState({ 
      ...state, 
      canvasSize: { ...state.canvasSize, width: newWidth },
      displayCanvasSize: {
        width: responsiveSize.width,
        height: responsiveSize.height
      }
    });
  };

  const handleCanvasHeightChange = (newHeight: number) => {
    const responsiveSize = getResponsiveCanvasSize({ width: state.canvasSize.width, height: newHeight });
    setState({ 
      ...state, 
      canvasSize: { ...state.canvasSize, height: newHeight },
      displayCanvasSize: {
        width: responsiveSize.width,
        height: responsiveSize.height
      }
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>Create a Snaptext</Typography>
      
      {/* Desktop Layout */}
      {isDesktop ? (
        <>
          {/* Row 1: Font, Weight, Text Size */}
          <Box display="flex" gap={2} alignItems="center" mb={2}>
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
                disabled={isLoadingWeights}
              >
                {availableWeights.map(weight => (
                  <MenuItem key={weight} value={weight}>{weight}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ position: 'relative' }}>
              <TextField
                label="Text Size"
                type="number"
                value={state.size}
                onChange={e => handleSizeChange(Number(e.target.value))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mr: 1 }}>
                        <ModernSpinnerButton 
                          direction="up" 
                          onClick={() => handleSizeChange(state.size + 1)}
                          disabled={state.size >= 200}
                        />
                        <ModernSpinnerButton 
                          direction="down" 
                          onClick={() => handleSizeChange(state.size - 1)}
                          disabled={state.size <= 8}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>px</Typography>
                    </InputAdornment>
                  ),
                  inputProps: { min: 8, max: 200, step: 1 }
                }}
                sx={{ width: 140 }}
              />
            </Box>
          </Box>

          {/* Row 2: Color Selectors and Transparent Background */}
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            {/* Circular Text Color Picker */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon sx={{ color: 'text.secondary' }} />
              <Box sx={{ position: 'relative' }}>
                <input
                  type="color"
                  value={state.textColor}
                  onChange={e => setState({ ...state, textColor: e.target.value })}
                  style={{
                    width: 40,
                    height: 40,
                    border: '2px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none'
                  }}
                />
              </Box>
              <Typography variant="body2">Text Color</Typography>
            </Box>

            {/* Circular Background Color Picker */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormatColorFillIcon sx={{ color: 'text.secondary' }} />
              <Box sx={{ position: 'relative' }}>
                <input
                  type="color"
                  value={state.bgColor === "transparent" ? "#ffffff" : state.bgColor}
                  onChange={e => handleBgColorChange(e.target.value)}
                  disabled={state.transparentBackground}
                  style={{
                    width: 40,
                    height: 40,
                    border: '2px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '50%',
                    cursor: state.transparentBackground ? 'not-allowed' : 'pointer',
                    opacity: state.transparentBackground ? 0.5 : 1,
                    padding: 0,
                    outline: 'none'
                  }}
                />
              </Box>
              <Typography variant="body2">BG Color</Typography>
            </Box>

            {/* Toggle for Transparent Background */}
            <FormControlLabel
              control={
                <Switch
                  checked={state.transparentBackground}
                  onChange={e => handleTransparentBackgroundChange(e.target.checked)}
                  color="primary"
                />
              }
              label="Transparent Background"
            />
          </Box>

          {/* Row 3: Alignment, Canvas Preset, Canvas Width, Canvas Height */}
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Align:</Typography>
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

            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Canvas Preset</InputLabel>
              <Select
                value={getCurrentPreset()}
                label="Canvas Preset"
                onChange={e => handlePresetChange(e.target.value)}
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
              onChange={e => handleCanvasWidthChange(Number(e.target.value))}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mr: 1 }}>
                      <ModernSpinnerButton 
                        direction="up" 
                        onClick={() => handleCanvasWidthChange(state.canvasSize.width + 10)}
                      />
                      <ModernSpinnerButton 
                        direction="down" 
                        onClick={() => handleCanvasWidthChange(Math.max(100, state.canvasSize.width - 10))}
                      />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{ width: 120 }}
            />
            <TextField
              label="Height"
              type="number"
              value={state.canvasSize.height}
              onChange={e => handleCanvasHeightChange(Number(e.target.value))}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mr: 1 }}>
                      <ModernSpinnerButton 
                        direction="up" 
                        onClick={() => handleCanvasHeightChange(state.canvasSize.height + 10)}
                      />
                      <ModernSpinnerButton 
                        direction="down" 
                        onClick={() => handleCanvasHeightChange(Math.max(100, state.canvasSize.height - 10))}
                      />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{ width: 120 }}
            />
          </Box>

          {/* Row 4: Three Sliders */}
          <Box display="flex" gap={3} alignItems="center" mb={2}>
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
              />
            </Box>
          </Box>
        </>
      ) : (
        /* Mobile Layout */
        <>
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
                disabled={isLoadingWeights}
              >
                {availableWeights.map(weight => (
                  <MenuItem key={weight} value={weight}>{weight}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Row 2: Size and Colors */}
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                label="Size"
                type="number"
                value={state.size}
                onChange={e => handleSizeChange(Number(e.target.value))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mr: 1 }}>
                        <ModernSpinnerButton 
                          direction="up" 
                          onClick={() => handleSizeChange(state.size + 1)}
                          disabled={state.size >= 200}
                        />
                        <ModernSpinnerButton 
                          direction="down" 
                          onClick={() => handleSizeChange(state.size - 1)}
                          disabled={state.size <= 8}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>px</Typography>
                    </InputAdornment>
                  ),
                  inputProps: { min: 8, max: 200, step: 1 }
                }}
                sx={{ width: 120 }}
              />
            </Box>

            {/* Circular Text Color Picker */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon sx={{ color: 'text.secondary' }} />
              <input
                type="color"
                value={state.textColor}
                onChange={e => setState({ ...state, textColor: e.target.value })}
                style={{
                  width: 40,
                  height: 40,
                  border: '2px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  padding: 0,
                  outline: 'none'
                }}
              />
            </Box>

            {/* Circular Background Color Picker */}
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
                  border: '2px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '50%',
                  cursor: state.transparentBackground ? 'not-allowed' : 'pointer',
                  opacity: state.transparentBackground ? 0.5 : 1,
                  padding: 0,
                  outline: 'none'
                }}
              />
            </Box>
          </Box>

          {/* Row 3: Transparent Background Toggle */}
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={state.transparentBackground}
                  onChange={e => handleTransparentBackgroundChange(e.target.checked)}
                  color="primary"
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
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
            {/* Line Height Slider */}
            <Box sx={{ minWidth: 150, flexGrow: 1 }}>
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
            <Box sx={{ minWidth: 150, flexGrow: 1 }}>
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
            <Box sx={{ minWidth: 150, flexGrow: 1 }}>
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
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Canvas Preset</InputLabel>
              <Select
                value={getCurrentPreset()}
                label="Canvas Preset"
                onChange={e => handlePresetChange(e.target.value)}
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
              onChange={e => handleCanvasWidthChange(Number(e.target.value))}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mr: 1 }}>
                      <ModernSpinnerButton 
                        direction="up" 
                        onClick={() => handleCanvasWidthChange(state.canvasSize.width + 10)}
                      />
                      <ModernSpinnerButton 
                        direction="down" 
                        onClick={() => handleCanvasWidthChange(Math.max(100, state.canvasSize.width - 10))}
                      />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{ width: 100 }}
            />
            <TextField
              label="Height"
              type="number"
              value={state.canvasSize.height}
              onChange={e => handleCanvasHeightChange(Number(e.target.value))}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mr: 1 }}>
                      <ModernSpinnerButton 
                        direction="up" 
                        onClick={() => handleCanvasHeightChange(state.canvasSize.height + 10)}
                      />
                      <ModernSpinnerButton 
                        direction="down" 
                        onClick={() => handleCanvasHeightChange(Math.max(100, state.canvasSize.height - 10))}
                      />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{ width: 100 }}
            />
          </Box>
        </>
      )}

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
