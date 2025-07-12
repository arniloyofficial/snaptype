import React, { useEffect, useState, useRef, useCallback } from "react";
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

// Modern spinner component with tap-and-hold functionality
const ModernSpinnerButton = ({ 
  direction, 
  onClick, 
  disabled,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd
}: { 
  direction: 'up' | 'down', 
  onClick: () => void, 
  disabled?: boolean,
  onMouseDown?: () => void,
  onMouseUp?: () => void,
  onMouseLeave?: () => void,
  onTouchStart?: () => void,
  onTouchEnd?: () => void
}) => (
  <IconButton
    size="small"
    onClick={onClick}
    disabled={disabled}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
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

// Custom TextField with hidden arrows
const NumberTextField = ({ 
  label, 
  value, 
  onChange, 
  onIncrement, 
  onDecrement, 
  min, 
  max, 
  step = 1,
  unit = '',
  sx,
  disabled = false,
  incrementDisabled = false,
  decrementDisabled = false
}: {
  label: string,
  value: number,
  onChange: (value: number) => void,
  onIncrement: () => void,
  onDecrement: () => void,
  min?: number,
  max?: number,
  step?: number,
  unit?: string,
  sx?: any,
  disabled?: boolean,
  incrementDisabled?: boolean,
  decrementDisabled?: boolean
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoIncrement = useCallback(() => {
    if (incrementDisabled || disabled) return;
    
    onIncrement();
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onIncrement();
      }, 100);
    }, 500);
  }, [onIncrement, incrementDisabled, disabled]);

  const startAutoDecrement = useCallback(() => {
    if (decrementDisabled || disabled) return;
    
    onDecrement();
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onDecrement();
      }, 100);
    }, 500);
  }, [onDecrement, decrementDisabled, disabled]);

  const stopAuto = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAuto();
    };
  }, [stopAuto]);

  return (
    <TextField
      label={label}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mr: 1 }}>
              <ModernSpinnerButton 
                direction="up" 
                onClick={onIncrement}
                disabled={incrementDisabled || disabled}
                onMouseDown={startAutoIncrement}
                onMouseUp={stopAuto}
                onMouseLeave={stopAuto}
                onTouchStart={startAutoIncrement}
                onTouchEnd={stopAuto}
              />
              <ModernSpinnerButton 
                direction="down" 
                onClick={onDecrement}
                disabled={decrementDisabled || disabled}
                onMouseDown={startAutoDecrement}
                onMouseUp={stopAuto}
                onMouseLeave={stopAuto}
                onTouchStart={startAutoDecrement}
                onTouchEnd={stopAuto}
              />
            </Box>
            {unit && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {unit}
              </Typography>
            )}
          </InputAdornment>
        ),
        inputProps: { 
          min, 
          max, 
          step,
          style: {
            // Hide browser default arrows
            MozAppearance: 'textfield',
            WebkitAppearance: 'none',
            appearance: 'none'
          }
        },
        sx: {
          // Hide browser default arrows for WebKit browsers
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          // Hide browser default arrows for Firefox
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
        }
      }}
      sx={sx}
    />
  );
};

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

  // Add these auto-increment functions for canvas width/height
const autoIncrementWidth = {
  intervalRef: useRef<NodeJS.Timeout | null>(null),
  timeoutRef: useRef<NodeJS.Timeout | null>(null),
  start: () => {
    autoIncrementWidth.timeoutRef.current = setTimeout(() => {
      autoIncrementWidth.intervalRef.current = setInterval(() => {
        handleCanvasWidthChange(state.canvasSize.width + 10);
      }, 100);
    }, 500);
  },
  stop: () => {
    if (autoIncrementWidth.timeoutRef.current) {
      clearTimeout(autoIncrementWidth.timeoutRef.current);
      autoIncrementWidth.timeoutRef.current = null;
    }
    if (autoIncrementWidth.intervalRef.current) {
      clearInterval(autoIncrementWidth.intervalRef.current);
      autoIncrementWidth.intervalRef.current = null;
    }
  }
};

const autoDecrementWidth = {
  intervalRef: useRef<NodeJS.Timeout | null>(null),
  timeoutRef: useRef<NodeJS.Timeout | null>(null),
  start: () => {
    autoDecrementWidth.timeoutRef.current = setTimeout(() => {
      autoDecrementWidth.intervalRef.current = setInterval(() => {
        handleCanvasWidthChange(Math.max(100, state.canvasSize.width - 10));
      }, 100);
    }, 500);
  },
  stop: () => {
    if (autoDecrementWidth.timeoutRef.current) {
      clearTimeout(autoDecrementWidth.timeoutRef.current);
      autoDecrementWidth.timeoutRef.current = null;
    }
    if (autoDecrementWidth.intervalRef.current) {
      clearInterval(autoDecrementWidth.intervalRef.current);
      autoDecrementWidth.intervalRef.current = null;
    }
  }
};

const autoIncrementHeight = {
  intervalRef: useRef<NodeJS.Timeout | null>(null),
  timeoutRef: useRef<NodeJS.Timeout | null>(null),
  start: () => {
    autoIncrementHeight.timeoutRef.current = setTimeout(() => {
      autoIncrementHeight.intervalRef.current = setInterval(() => {
        handleCanvasHeightChange(state.canvasSize.height + 10);
      }, 100);
    }, 500);
  },
  stop: () => {
    if (autoIncrementHeight.timeoutRef.current) {
      clearTimeout(autoIncrementHeight.timeoutRef.current);
      autoIncrementHeight.timeoutRef.current = null;
    }
    if (autoIncrementHeight.intervalRef.current) {
      clearInterval(autoIncrementHeight.intervalRef.current);
      autoIncrementHeight.intervalRef.current = null;
    }
  }
};

const autoDecrementHeight = {
  intervalRef: useRef<NodeJS.Timeout | null>(null),
  timeoutRef: useRef<NodeJS.Timeout | null>(null),
  start: () => {
    autoDecrementHeight.timeoutRef.current = setTimeout(() => {
      autoDecrementHeight.intervalRef.current = setInterval(() => {
        handleCanvasHeightChange(Math.max(100, state.canvasSize.height - 10));
      }, 100);
    }, 500);
  },
  stop: () => {
    if (autoDecrementHeight.timeoutRef.current) {
      clearTimeout(autoDecrementHeight.timeoutRef.current);
      autoDecrementHeight.timeoutRef.current = null;
    }
    if (autoDecrementHeight.intervalRef.current) {
      clearInterval(autoDecrementHeight.intervalRef.current);
      autoDecrementHeight.intervalRef.current = null;
    }
  }
};

  // Cleanup effect for auto-increment functions
useEffect(() => {
  return () => {
    autoIncrementWidth.stop();
    autoDecrementWidth.stop();
    autoIncrementHeight.stop();
    autoDecrementHeight.stop();
  };
}, []);

  // Initialize responsive canvas size
useEffect(() => {
  if (state.canvasSize && !state.displayCanvasSize) {
    const responsiveSize = getResponsiveCanvasSize(state.canvasSize);
    setState({
      ...state,
      displayCanvasSize: {
        width: responsiveSize.width,
        height: responsiveSize.height
      }
    });
  }
}, [state.canvasSize, state.displayCanvasSize]);

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
    <Paper elevation={3} sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>Create a Snaptext</Typography>
      
      {/* Desktop Layout */}
      {isDesktop ? (
        <>
          {/* Row 1: Font, Weight, Text Size, Canvas Preset, Canvas Width, Canvas Height */}
          <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
            <FontSelector
              value={state.font}
              onChange={font => setState({ ...state, font })}
              sx={{ minWidth: 180 }}
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
            <NumberTextField
              label="Text Size"
              value={state.size}
              onChange={handleSizeChange}
              onIncrement={() => handleSizeChange(state.size + 1)}
              onDecrement={() => handleSizeChange(state.size - 1)}
              min={8}
              max={200}
              unit="px"
              sx={{ width: 140 }}
              incrementDisabled={state.size >= 200}
              decrementDisabled={state.size <= 8}
            />
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
            <NumberTextField
              label="Width"
              value={state.canvasSize.width}
              onChange={handleCanvasWidthChange}
              onIncrement={() => handleCanvasWidthChange(state.canvasSize.width + 10)}
              onDecrement={() => handleCanvasWidthChange(Math.max(100, state.canvasSize.width - 10))}
              min={100}
              sx={{ width: 120 }}
              decrementDisabled={state.canvasSize.width <= 100}
            />
            <NumberTextField
              label="Height"
              value={state.canvasSize.height}
              onChange={handleCanvasHeightChange}
              onIncrement={() => handleCanvasHeightChange(state.canvasSize.height + 10)}
              onDecrement={() => handleCanvasHeightChange(Math.max(100, state.canvasSize.height - 10))}
              min={100}
              sx={{ width: 120 }}
              decrementDisabled={state.canvasSize.height <= 100}
            />
          </Box>

          {/* Row 2: Text Color, Background Color, Transparent Background, Alignment */}
          <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
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

            {/* Alignment Options */}
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
          </Box>

          {/* Row 3: Three Sliders */}
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
            <NumberTextField
              label="Size"
              value={state.size}
              onChange={handleSizeChange}
              onIncrement={() => handleSizeChange(state.size + 1)}
              onDecrement={() => handleSizeChange(state.size - 1)}
              min={8}
              max={200}
              unit="px"
              sx={{ width: 120 }}
              incrementDisabled={state.size >= 200}
              decrementDisabled={state.size <= 8}
            />

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
  <NumberTextField
    label="Width"
    value={state.canvasSize.width}
    onChange={handleCanvasWidthChange}
    onIncrement={() => handleCanvasWidthChange(state.canvasSize.width + 10)}
    onDecrement={() => handleCanvasWidthChange(Math.max(100, state.canvasSize.width - 10))}
    min={100}
    sx={{ width: 100 }}
    decrementDisabled={state.canvasSize.width <= 100}
  />
  <NumberTextField
    label="Height"
    value={state.canvasSize.height}
    onChange={handleCanvasHeightChange}
    onIncrement={() => handleCanvasHeightChange(state.canvasSize.height + 10)}
    onDecrement={() => handleCanvasHeightChange(Math.max(100, state.canvasSize.height - 10))}
    min={100}
    sx={{ width: 100 }}
    decrementDisabled={state.canvasSize.height <= 100}
  />
</Box>
</>
        )}
        
        {/* Text input */}
        <TextField
          label="Enter your text"
          multiline
          fullWidth
          minRows={1}
          maxRows={10}
          value={state.text}
          onChange={e => setState({ ...state, text: e.target.value })}
          sx={{ 
            fontFamily: state.font, 
            mb: 2,
            '& .MuiInputBase-root': {
              minHeight: 'auto',
            },
            '& .MuiInputBase-input': {
              minHeight: '1.2em',
              overflow: 'hidden',
              resize: 'none',
            }
          }}
        />
        
        {/* Save button */}
        <Box sx={{ textAlign: "right" }}>
          <Button variant="contained" color="primary" onClick={onSave}>
            Save Image
          </Button>
        </Box>
      </Paper>
