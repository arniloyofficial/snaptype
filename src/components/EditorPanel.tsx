import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Paper, Box, TextField, InputAdornment, Button,
  MenuItem, Select, FormControl, InputLabel, Typography, IconButton,
  Slider, Switch, FormControlLabel, useMediaQuery, Divider,
  Accordion, AccordionSummary, AccordionDetails, Chip, Alert
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import PaletteIcon from "@mui/icons-material/Palette";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AddIcon from "@mui/icons-material/Add";
import LayersIcon from "@mui/icons-material/Layers";
import OpacityIcon from "@mui/icons-material/Opacity";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import ShadowIcon from "@mui/icons-material/Shadow";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FontSelector from "./FontSelector";
import { TextLayer } from "../App";

const GOOGLE_FONTS_API_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
const GOOGLE_FONTS_API_URL = import.meta.env.VITE_GOOGLE_FONTS_API_URL;

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
      const apiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
      const apiUrl = import.meta.env.VITE_GOOGLE_FONTS_API_URL;

      if (!apiKey || !apiUrl) {
        console.error('Google Fonts API key or URL not configured');
        return [100, 200, 300, 400, 500, 600, 700, 800, 900];
      }

      const apiResponse = await fetch(`${apiUrl}?key=${apiKey}&family=${fontFamily.replace(/\s+/g, '+')}`);
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

interface EditorPanelProps {
  textLayers: TextLayer[];
  activeLayerId: string | null;
  onAddTextLayer: () => void;
  onUpdateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  onSelectTextLayer: (id: string) => void;
  onDeleteTextLayer: (id: string) => void;
  onSave: () => void;
  canvasSize: { width: number; height: number };
  onCanvasSizeChange: (newSize: { width: number; height: number }) => void;
}

export default function EditorPanel({ 
  textLayers, 
  activeLayerId, 
  onAddTextLayer, 
  onUpdateTextLayer, 
  onSelectTextLayer, 
  onDeleteTextLayer, 
  onSave,
  canvasSize,
  onCanvasSizeChange
}: EditorPanelProps) {
  const [availableWeights, setAvailableWeights] = useState<number[]>([400]);
  const [isLoadingWeights, setIsLoadingWeights] = useState(false);
  const isDesktop = useMediaQuery('(min-width:900px)');
  const isTablet = useMediaQuery('(min-width:600px)');
  const isMobile = useMediaQuery('(max-width:599px)');

  // Get the active text layer
  const activeLayer = textLayers.find(layer => layer.id === activeLayerId);

  // Fetch available weights when font changes
  useEffect(() => {
    const fetchWeights = async () => {
      if (!activeLayer?.font) return;
      
      setIsLoadingWeights(true);
      try {
        const weights = await getFontWeights(activeLayer.font);
        setAvailableWeights(weights);
        
        // If current weight is not available, set to closest available weight
        if (!weights.includes(activeLayer.weight)) {
          const closestWeight = weights.reduce((prev, curr) => 
            Math.abs(curr - activeLayer.weight) < Math.abs(prev - activeLayer.weight) ? curr : prev
          );
          onUpdateTextLayer(activeLayer.id, { weight: closestWeight });
        }
      } catch (error) {
        console.error('Error fetching weights:', error);
        setAvailableWeights([100, 200, 300, 400, 500, 600, 700, 800, 900]);
      } finally {
        setIsLoadingWeights(false);
      }
    };
    
    fetchWeights();
  }, [activeLayer?.font, activeLayer?.weight, activeLayer?.id, onUpdateTextLayer]);

  // Get current preset key
  const getCurrentPreset = () => {
    const currentPreset = Object.entries(presetSizes).find(
      ([_, size]) => size.width === canvasSize.width && size.height === canvasSize.height
    );
    return currentPreset ? currentPreset[0] : "Custom";
  };

  const handlePresetChange = (presetKey: string) => {
    const size = presetSizes[presetKey as keyof typeof presetSizes];
    if (size) {
      onCanvasSizeChange(size);
    }
  };

  const handleCanvasWidthChange = (newWidth: number) => {
    onCanvasSizeChange({ width: newWidth, height: canvasSize.height });
  };

  const handleCanvasHeightChange = (newHeight: number) => {
    onCanvasSizeChange({ width: canvasSize.width, height: newHeight });
  };

  // Helper function to update active layer
  const updateActiveLayer = (updates: Partial<TextLayer>) => {
    if (activeLayer) {
      onUpdateTextLayer(activeLayer.id, updates);
    }
  };

  // Text formatting handlers
  const handleBoldToggle = () => {
    updateActiveLayer({ bold: !activeLayer?.bold });
  };

  const handleItalicToggle = () => {
    updateActiveLayer({ italic: !activeLayer?.italic });
  };

  const handleUnderlineToggle = () => {
    updateActiveLayer({ underline: !activeLayer?.underline });
  };

  const handleStrikethroughToggle = () => {
    updateActiveLayer({ strikethrough: !activeLayer?.strikethrough });
  };

  if (!activeLayer) {
    return (
      <Paper elevation={3} sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>Text Editor</Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          Select a text layer to edit its properties, or create a new one to get started.
        </Alert>

        {/* Canvas Size Controls */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Canvas Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
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
                value={canvasSize.width}
                onChange={e => handleCanvasWidthChange(Number(e.target.value))}
                InputProps={{
                  inputProps: { min: 100 }
                }}
                sx={{ width: 120 }}
              />
              <TextField
                label="Height"
                type="number"
                value={canvasSize.height}
                onChange={e => handleCanvasHeightChange(Number(e.target.value))}
                InputProps={{
                  inputProps: { min: 100 }
                }}
                sx={{ width: 120 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Add Text Layer Button */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddTextLayer}
            size="large"
          >
            Add Text Layer
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Text Editor</Typography>
        <Chip 
          icon={<LayersIcon />} 
          label={`Layer ${textLayers.findIndex(l => l.id === activeLayerId) + 1}`}
          color="primary"
          variant="outlined"
        />
      </Box>
      
      {/* Desktop Layout */}
      {isDesktop ? (
        <>
          {/* Canvas Settings */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Canvas Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
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
                  value={canvasSize.width}
                  onChange={e => handleCanvasWidthChange(Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 100 }
                  }}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Height"
                  type="number"
                  value={canvasSize.height}
                  onChange={e => handleCanvasHeightChange(Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 100 }
                  }}
                  sx={{ width: 120 }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Basic Text Properties */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Basic Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Row 1: Font, Weight, Size */}
              <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
                <FontSelector
                  value={activeLayer.font}
                  onChange={font => updateActiveLayer({ font })}
                  sx={{ minWidth: 180 }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Weight</InputLabel>
                  <Select
                    value={activeLayer.weight}
                    label="Weight"
                    onChange={e => updateActiveLayer({ weight: Number(e.target.value) })}
                    disabled={isLoadingWeights}
                  >
                    {availableWeights.map(weight => (
                      <MenuItem key={weight} value={weight}>{weight}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Text Size"
                  type="number"
                  value={activeLayer.size}
                  onChange={e => updateActiveLayer({ size: Math.max(8, Math.min(200, Number(e.target.value))) })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                    inputProps: { min: 8, max: 200, step: 1 }
                  }}
                  sx={{ width: 140 }}
                />
              </Box>

              {/* Row 2: Colors and Alignment */}
              <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
                {/* Text Color */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaletteIcon sx={{ color: 'text.secondary' }} />
                  <input
                    type="color"
                    value={activeLayer.color}
                    onChange={e => updateActiveLayer({ color: e.target.value })}
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
                  <Typography variant="body2">Text Color</Typography>
                </Box>

                {/* Alignment Options */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Align:</Typography>
                  <IconButton
                    color={activeLayer.align === "left" ? "primary" : "default"}
                    onClick={() => updateActiveLayer({ align: "left" })}
                    title="Align Left"
                  >
                    <FormatAlignLeftIcon />
                  </IconButton>
                  <IconButton
                    color={activeLayer.align === "center" ? "primary" : "default"}
                    onClick={() => updateActiveLayer({ align: "center" })}
                    title="Align Center"
                  >
                    <FormatAlignCenterIcon />
                  </IconButton>
                  <IconButton
                    color={activeLayer.align === "right" ? "primary" : "default"}
                    onClick={() => updateActiveLayer({ align: "right" })}
                    title="Align Right"
                  >
                    <FormatAlignRightIcon />
                  </IconButton>
                </Box>

                {/* Text Formatting Options */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Format:</Typography>
                  <IconButton
                    color={activeLayer.bold ? "primary" : "default"}
                    onClick={handleBoldToggle}
                    title="Bold"
                  >
                    <FormatBoldIcon />
                  </IconButton>
                  <IconButton
                    color={activeLayer.italic ? "primary" : "default"}
                    onClick={handleItalicToggle}
                    title="Italic"
                  >
                    <FormatItalicIcon />
                  </IconButton>
                  <IconButton
                    color={activeLayer.underline ? "primary" : "default"}
                    onClick={handleUnderlineToggle}
                    title="Underline"
                  >
                    <FormatUnderlinedIcon />
                  </IconButton>
                  <IconButton
                    color={activeLayer.strikethrough ? "primary" : "default"}
                    onClick={handleStrikethroughToggle}
                    title="Strikethrough"
                  >
                    <StrikethroughSIcon />
                  </IconButton>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Advanced Typography */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Typography</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" gap={3} alignItems="center" mb={2}>
                {/* Line Height Slider */}
                <Box sx={{ minWidth: 200 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <FormatLineSpacingIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">Line Height</Typography>
                  </Box>
                  <Slider
                    value={activeLayer.lineHeight}
                    onChange={(e, newValue) => updateActiveLayer({ lineHeight: newValue as number })}
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
                    value={activeLayer.letterSpacing}
                    onChange={(e, newValue) => updateActiveLayer({ letterSpacing: newValue as number })}
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
                    value={activeLayer.wordSpacing}
                    onChange={(e, newValue) => updateActiveLayer({ wordSpacing: newValue as number })}
                    min={-10}
                    max={50}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Transform & Effects */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Transform & Effects</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" gap={3} alignItems="center" mb={2}>
                {/* Opacity Slider */}
                <Box sx={{ minWidth: 200 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <OpacityIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">Opacity</Typography>
                  </Box>
                  <Slider
                    value={activeLayer.opacity}
                    onChange={(e, newValue) => updateActiveLayer({ opacity: newValue as number })}
                    min={0}
                    max={1}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Box>

                {/* Rotation Slider */}
                <Box sx={{ minWidth: 200 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <RotateRightIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">Rotation</Typography>
                  </Box>
                  <Slider
                    value={activeLayer.rotation}
                    onChange={(e, newValue) => updateActiveLayer({ rotation: newValue as number })}
                    min={-180}
                    max={180}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Shadow & Stroke */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Shadow & Stroke</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Shadow Controls */}
              <Box mb={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={activeLayer.shadow.enabled}
                      onChange={e => updateActiveLayer({ 
                        shadow: { ...activeLayer.shadow, enabled: e.target.checked } 
                      })}
                    />
                  }
                  label="Enable Shadow"
                />
                
                {activeLayer.shadow.enabled && (
                  <Box display="flex" gap={2} alignItems="center" mt={2} flexWrap="wrap">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShadowIcon sx={{ color: 'text.secondary' }} />
                      <input
                        type="color"
                        value={activeLayer.shadow.color}
                        onChange={e => updateActiveLayer({ 
                          shadow: { ...activeLayer.shadow, color: e.target.value } 
                        })}
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
                      <Typography variant="body2">Shadow Color</Typography>
                    </Box>
                    
                    <TextField
                      label="Offset X"
                      type="number"
                      value={activeLayer.shadow.offsetX}
                      onChange={e => updateActiveLayer({ 
                        shadow: { ...activeLayer.shadow, offsetX: Number(e.target.value) } 
                      })}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    
                    <TextField
                      label="Offset Y"
                      type="number"
                      value={activeLayer.shadow.offsetY}
                      onChange={e => updateActiveLayer({ 
                        shadow: { ...activeLayer.shadow, offsetY: Number(e.target.value) } 
                      })}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    
                    <TextField
                      label="Blur"
                      type="number"
                      value={activeLayer.shadow.blur}
                      onChange={e => updateActiveLayer({ 
                        shadow: { ...activeLayer.shadow, blur: Number(e.target.value) } 
                      })}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  </Box>
                )}
              </Box>

              {/* Stroke Controls */}
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={activeLayer.stroke.enabled}
                      onChange={e => updateActiveLayer({ 
                        stroke: { ...activeLayer.stroke, enabled: e.target.checked } 
                      })}
                    />
                  }
                  label="Enable Stroke"
                />
                
                {activeLayer.stroke.enabled && (
                  <Box display="flex" gap={2} alignItems="center" mt={2} flexWrap="wrap">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BorderStyleIcon sx={{ color: 'text.secondary' }} />
                      <input
                        type="color"
                        value={activeLayer.stroke.color}
                        onChange={e => updateActiveLayer({ 
                          stroke: { ...activeLayer.stroke, color: e.target.value } 
                        })}
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
                      <Typography variant="body2">Stroke Color</Typography>
                    </Box>
                    
                    <TextField
                      label="Stroke Width"
                      type="number"
                      value={activeLayer.stroke.width}
                      onChange={e => updateActiveLayer({ 
                        stroke: { ...activeLayer.stroke, width: Number(e.target.value) } 
                      })}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        ) : (
        /* Mobile Layout */
        <>
          {/* Current Text Layer Info */}
          {textLayers.length > 0 && activeLayerId && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.contrastText' }}>
              <Typography variant="subtitle2" gutterBottom>
                Editing Layer: {textLayers.find(layer => layer.id === activeLayerId)?.text.substring(0, 20) || 'Text Layer'}
                {textLayers.find(layer => layer.id === activeLayerId)?.text.length > 20 ? '...' : ''}
              </Typography>
              <Typography variant="caption">
                Layer {textLayers.findIndex(layer => layer.id === activeLayerId) + 1} of {textLayers.length}
              </Typography>
            </Box>
          )}

          {/* Row 1: Font and Weight */}
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
            <FontSelector
              value={activeLayer?.font || 'Inter'}
              onChange={font => activeLayer && onUpdateTextLayer(activeLayer.id, { font })}
              sx={{ minWidth: 160, flex: 1 }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Weight</InputLabel>
              <Select
                value={activeLayer?.weight || 400}
                label="Weight"
                onChange={e => activeLayer && onUpdateTextLayer(activeLayer.id, { weight: e.target.value as number })}
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
            <TextField
              label="Size"
              type="number"
              value={activeLayer?.size || 24}
              onChange={e => activeLayer && onUpdateTextLayer(activeLayer.id, { size: Math.max(8, Math.min(200, Number(e.target.value))) })}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
                inputProps: { 
                  min: 8, 
                  max: 200,
                  step: 1
                }
              }}
              sx={{ width: 120 }}
            />

            {/* Circular Text Color Picker */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon sx={{ color: 'text.secondary' }} />
              <input
                type="color"
                value={activeLayer?.color || '#000000'}
                onChange={e => activeLayer && onUpdateTextLayer(activeLayer.id, { color: e.target.value })}
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

            {/* Opacity Slider */}
            <Box sx={{ minWidth: 120, flex: 1 }}>
              <Typography variant="body2" gutterBottom>Opacity</Typography>
              <Slider
                value={activeLayer?.opacity || 100}
                onChange={(e, newValue) => activeLayer && onUpdateTextLayer(activeLayer.id, { opacity: newValue as number })}
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
            </Box>
          </Box>

          {/* Row 3: Alignment and Text Formatting */}
          <Box display="flex" gap={1} alignItems="center" mb={2} flexWrap="wrap">
            <Typography variant="body2" sx={{ mr: 1 }}>Align:</Typography>
            <IconButton
              color={activeLayer?.align === "left" ? "primary" : "default"}
              onClick={() => activeLayer && onUpdateTextLayer(activeLayer.id, { align: "left" })}
              title="Align Left"
            >
              <FormatAlignLeftIcon />
            </IconButton>
            <IconButton
              color={activeLayer?.align === "center" ? "primary" : "default"}
              onClick={() => activeLayer && onUpdateTextLayer(activeLayer.id, { align: "center" })}
              title="Align Center"
            >
              <FormatAlignCenterIcon />
            </IconButton>
            <IconButton
              color={activeLayer?.align === "right" ? "primary" : "default"}
              onClick={() => activeLayer && onUpdateTextLayer(activeLayer.id, { align: "right" })}
              title="Align Right"
            >
              <FormatAlignRightIcon />
            </IconButton>
            
            {/* Text Formatting for Mobile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <Typography variant="body2">Format:</Typography>
              <IconButton
                color={activeLayer?.bold ? "primary" : "default"}
                onClick={() => activeLayer && onUpdateTextLayer(activeLayer.id, { bold: !activeLayer.bold })}
                title="Bold"
              >
                <FormatBoldIcon />
              </IconButton>
              <IconButton
                color={activeLayer?.italic ? "primary" : "default"}
                onClick={() => activeLayer && onUpdateTextLayer(activeLayer.id, { italic: !activeLayer.italic })}
                title="Italic"
              >
                <FormatItalicIcon />
              </IconButton>
              <IconButton
                color={activeLayer?.underline ? "primary" : "default"}
                onClick={() => activeLayer && onUpdateTextLayer(activeLayer.id, { underline: !activeLayer.underline })}
                title="Underline"
              >
                <FormatUnderlinedIcon />
              </IconButton>
              <IconButton
                color={activeLayer?.strikethrough ? "primary" : "default"}
                onClick={() => activeLayer && onUpdateTextLayer(activeLayer.id, { strikethrough: !activeLayer.strikethrough })}
                title="Strikethrough"
              >
                <StrikethroughSIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Row 4: Typography Controls */}
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
            {/* Line Height Slider */}
            <Box sx={{ minWidth: 150, flexGrow: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <FormatLineSpacingIcon sx={{ color: 'text.secondary' }} />
                <Typography variant="body2">Line Height</Typography>
              </Box>
              <Slider
                value={activeLayer?.lineHeight || 1.2}
                onChange={(e, newValue) => activeLayer && onUpdateTextLayer(activeLayer.id, { lineHeight: newValue as number })}
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
                value={activeLayer?.letterSpacing || 0}
                onChange={(e, newValue) => activeLayer && onUpdateTextLayer(activeLayer.id, { letterSpacing: newValue as number })}
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
                value={activeLayer?.wordSpacing || 0}
                onChange={(e, newValue) => activeLayer && onUpdateTextLayer(activeLayer.id, { wordSpacing: newValue as number })}
                min={-10}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                sx={{ width: '100%' }}
              />
            </Box>
          </Box>
          
          {/* Row 5: Canvas Settings */}
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
              value={canvasSize.width}
              onChange={e => onCanvasSizeChange({ width: Number(e.target.value), height: canvasSize.height })}
              InputProps={{
                inputProps: { 
                  min: 100
                }
              }}
              sx={{ width: 100 }}
            />
            <TextField
              label="Height"
              type="number"
              value={canvasSize.height}
              onChange={e => onCanvasSizeChange({ width: canvasSize.width, height: Number(e.target.value) })}
              InputProps={{
                inputProps: { 
                  min: 100
                }
              }}
              sx={{ width: 100 }}
            />
          </Box>

          {/* Advanced Text Effects */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>Text Effects</Typography>
            
            {/* Shadow Controls */}
            <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={activeLayer?.shadow?.enabled || false}
                    onChange={e => activeLayer && onUpdateTextLayer(activeLayer.id, {
                      shadow: { ...activeLayer.shadow, enabled: e.target.checked }
                    })}
                  />
                }
                label="Text Shadow"
              />
              
              {activeLayer?.shadow?.enabled && (
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" gap={2} alignItems="center" mb={1}>
                    <input
                      type="color"
                      value={activeLayer?.shadow?.color || '#000000'}
                      onChange={e => activeLayer && onUpdateTextLayer(activeLayer.id, {
                        shadow: { ...activeLayer.shadow, color: e.target.value }
                      })}
                      style={{
                        width: 30,
                        height: 30,
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    />
                    <Typography variant="body2">Shadow Color</Typography>
                  </Box>
                  
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Box sx={{ minWidth: 100, flex: 1 }}>
                      <Typography variant="body2">Offset X</Typography>
                      <Slider
                        value={activeLayer?.shadow?.offsetX || 2}
                        onChange={(e, newValue) => activeLayer && onUpdateTextLayer(activeLayer.id, {
                          shadow: { ...activeLayer.shadow, offsetX: newValue as number }
                        })}
                        min={-20}
                        max={20}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <Box sx={{ minWidth: 100, flex: 1 }}>
                      <Typography variant="body2">Offset Y</Typography>
                      <Slider
                        value={activeLayer?.shadow?.offsetY || 2}
                        onChange={(e, newValue) => activeLayer && onUpdateTextLayer(activeLayer.id, {
                          shadow: { ...activeLayer.shadow, offsetY: newValue as number }
                        })}
                        min={-20}
                        max={20}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <Box sx={{ minWidth: 100, flex: 1 }}>
                      <Typography variant="body2">Blur</Typography>
                      <Slider
                        value={activeLayer?.shadow?.blur || 4}
                        onChange={(e, newValue) => activeLayer && onUpdateTextLayer(activeLayer.id, {
                          shadow: { ...activeLayer.shadow, blur: newValue as number }
                        })}
                        min={0}
                        max={20}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Stroke Controls */}
            <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={activeLayer?.stroke?.enabled || false}
                    onChange={e => activeLayer && onUpdateTextLayer(activeLayer.id, {
                      stroke: { ...activeLayer.stroke, enabled: e.target.checked }
                    })}
                  />
                }
                label="Text Stroke"
              />
              
              {activeLayer?.stroke?.enabled && (
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" gap={2} alignItems="center" mb={1}>
                    <input
                      type="color"
                      value={activeLayer?.stroke?.color || '#000000'}
                      onChange={e => activeLayer && onUpdateTextLayer(activeLayer.id, {
                        stroke: { ...activeLayer.stroke, color: e.target.value }
                      })}
                      style={{
                        width: 30,
                        height: 30,
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    />
                    <Typography variant="body2">Stroke Color</Typography>
                  </Box>
                  
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="body2">Stroke Width</Typography>
                    <Slider
                      value={activeLayer?.stroke?.width || 1}
                      onChange={(e, newValue) => activeLayer && onUpdateTextLayer(activeLayer.id, {
                        stroke: { ...activeLayer.stroke, width: newValue as number }
                      })}
                      min={0}
                      max={10}
                      step={0.5}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
      
      {/* Text input for active layer */}
      {activeLayer && (
        <TextField
          label="Enter your text"
          multiline
          fullWidth
          minRows={2}
          maxRows={6}
          value={activeLayer.text}
          onChange={e => onUpdateTextLayer(activeLayer.id, { text: e.target.value })}
          sx={{ 
            fontFamily: activeLayer.font, 
            mb: 2,
            '& .MuiInputBase-root': {
              minHeight: 'auto',
            },
            '& .MuiInputBase-input': {
              minHeight: '2.4em',
              overflow: 'hidden',
              resize: 'none',
            }
          }}
        />
      )}
      
      {/* Add New Text Layer Button */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={onAddTextLayer}
          startIcon={<TextFieldsIcon />}
          fullWidth
          sx={{ py: 1.5 }}
        >
          Add New Text Layer
        </Button>
      </Box>
      
      {/* Layer Management */}
      {textLayers.length > 1 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Text Layers</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {textLayers.map((layer, index) => (
              <Box
                key={layer.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  border: '1px solid',
                  borderColor: layer.id === activeLayerId ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  backgroundColor: layer.id === activeLayerId ? 'primary.light' : 'background.paper',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectTextLayer(layer.id)}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    flex: 1, 
                    color: layer.id === activeLayerId ? 'primary.contrastText' : 'text.primary',
                    fontWeight: layer.id === activeLayerId ? 'bold' : 'normal'
                  }}
                >
                  {layer.text.substring(0, 30)}{layer.text.length > 30 ? '...' : ''}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTextLayer(layer.id);
                  }}
                  sx={{ 
                    color: layer.id === activeLayerId ? 'primary.contrastText' : 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      {/* Save button */}
      <Box sx={{ textAlign: "right" }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onSave}
          sx={{ py: 1.5, px: 4 }}
        >
          Save Image
        </Button>
      </Box>
    </Paper>
  );
}
