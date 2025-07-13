import React, { useState, useRef } from "react";
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Slider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Alert,
} from "@mui/material";
import {
  PhotoLibrary,
  Gradient,
  FormatColorFill,
  Image,
  CloudUpload,
  Delete,
} from "@mui/icons-material";
import { BackgroundState } from "../App";

interface BackgroundPanelProps {
  backgroundState: BackgroundState;
  onBackgroundChange: (state: BackgroundState) => void;
  canvasSize: { width: number; height: number };
}

// Background templates
const backgroundTemplates = [
  { id: 'gradient-1', name: 'Sunset', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' },
  { id: 'gradient-2', name: 'Ocean', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient-3', name: 'Forest', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'gradient-4', name: 'Cosmic', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'gradient-5', name: 'Warm', gradient: 'linear-gradient(135deg, #ff8a80 0%, #ff80ab 100%)' },
  { id: 'gradient-6', name: 'Cool', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  { id: 'gradient-7', name: 'Purple', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 'gradient-8', name: 'Fire', gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6e7f 100%)' },
];

const gradientDirections = [
  { value: 'linear-gradient(0deg, var(--color1), var(--color2))', label: 'Top to Bottom' },
  { value: 'linear-gradient(45deg, var(--color1), var(--color2))', label: 'Diagonal ↗' },
  { value: 'linear-gradient(90deg, var(--color1), var(--color2))', label: 'Left to Right' },
  { value: 'linear-gradient(135deg, var(--color1), var(--color2))', label: 'Diagonal ↘' },
  { value: 'linear-gradient(180deg, var(--color1), var(--color2))', label: 'Bottom to Top' },
  { value: 'linear-gradient(225deg, var(--color1), var(--color2))', label: 'Diagonal ↙' },
  { value: 'linear-gradient(270deg, var(--color1), var(--color2))', label: 'Right to Left' },
  { value: 'linear-gradient(315deg, var(--color1), var(--color2))', label: 'Diagonal ↖' },
  { value: 'radial-gradient(circle, var(--color1), var(--color2))', label: 'Radial' },
];

export default function BackgroundPanel({ 
  backgroundState, 
  onBackgroundChange, 
  canvasSize 
}: BackgroundPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleTypeChange = (type: BackgroundState['type']) => {
    onBackgroundChange({ ...backgroundState, type });
  };

  const handleSolidColorChange = (color: string) => {
    onBackgroundChange({ ...backgroundState, solidColor: color });
  };

  const handleGradientColorChange = (index: number, color: string) => {
    const newColors = [...backgroundState.gradientColors];
    newColors[index] = color;
    onBackgroundChange({ ...backgroundState, gradientColors: newColors });
  };

  const handleGradientDirectionChange = (direction: string) => {
    onBackgroundChange({ ...backgroundState, gradientDirection: direction });
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onBackgroundChange({ 
        ...backgroundState, 
        imageUrl: url, 
        imageFile: file,
        type: 'image'
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = backgroundTemplates.find(t => t.id === templateId);
    if (template) {
      onBackgroundChange({ 
        ...backgroundState, 
        type: 'template',
        templateId: templateId
      });
    }
  };

  const handleFilterChange = (filter: keyof BackgroundState, value: number) => {
    onBackgroundChange({ ...backgroundState, [filter]: value });
  };

  const resetFilters = () => {
    onBackgroundChange({
      ...backgroundState,
      blur: 0,
      opacity: 100,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      grayscale: 0,
      sepia: 0,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>
        Background Settings
      </Typography>

      {/* Background Type Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Background Type
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[
            { type: 'solid', icon: <FormatColorFill />, label: 'Solid Color' },
            { type: 'gradient', icon: <Gradient />, label: 'Gradient' },
            { type: 'image', icon: <Image />, label: 'Image' },
            { type: 'template', icon: <PhotoLibrary />, label: 'Template' },
          ].map(({ type, icon, label }) => (
            <Button
              key={type}
              variant={backgroundState.type === type ? 'contained' : 'outlined'}
              startIcon={icon}
              onClick={() => handleTypeChange(type as BackgroundState['type'])}
              size="small"
            >
              {label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Solid Color */}
      {backgroundState.type === 'solid' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Solid Color
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <input
              type="color"
              value={backgroundState.solidColor}
              onChange={(e) => handleSolidColorChange(e.target.value)}
              style={{
                width: 50,
                height: 50,
                border: '2px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '50%',
                cursor: 'pointer',
                padding: 0,
                outline: 'none',
              }}
            />
            <TextField
              label="Hex Color"
              value={backgroundState.solidColor}
              onChange={(e) => handleSolidColorChange(e.target.value)}
              sx={{ width: 120 }}
            />
          </Box>
        </Box>
      )}

      {/* Gradient */}
      {backgroundState.type === 'gradient' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gradient
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Colors
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {backgroundState.gradientColors.map((color, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleGradientColorChange(index, e.target.value)}
                    style={{
                      width: 40,
                      height: 40,
                      border: '2px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                    }}
                  />
                  <Typography variant="body2">Color {index + 1}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Direction</InputLabel>
            <Select
              value={backgroundState.gradientDirection}
              label="Direction"
              onChange={(e) => handleGradientDirectionChange(e.target.value)}
            >
              {gradientDirections.map((dir) => (
                <MenuItem key={dir.value} value={dir.value}>
                  {dir.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Image Upload */}
      {backgroundState.type === 'image' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload Image
          </Typography>
          <Box
            sx={{
              border: `2px dashed ${dragOver ? 'primary.main' : 'grey.300'}`,
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: dragOver ? 'action.hover' : 'transparent',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body1" gutterBottom>
              Drag and drop an image or click to select
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports JPG, PNG, GIF formats
            </Typography>
          </Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          
          {backgroundState.imageUrl && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <img
                src={backgroundState.imageUrl}
                alt="Background preview"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
              <Box>
                <Typography variant="body2">
                  Image uploaded successfully
                </Typography>
                <IconButton
                  onClick={() => onBackgroundChange({ 
                    ...backgroundState, 
                    imageUrl: '', 
                    imageFile: null 
                  })}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Templates */}
      {backgroundState.type === 'template' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Background Templates
          </Typography>
          <Grid container spacing={2}>
            {backgroundTemplates.map((template) => (
              <Grid item xs={6} sm={4} md={3} key={template.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: backgroundState.templateId === template.id ? 
                      '2px solid primary.main' : '1px solid grey.300',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <Box
                    sx={{
                      height: 80,
                      background: template.gradient,
                    }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body2" textAlign="center">
                      {template.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Image Filters */}
      {(backgroundState.type === 'image' || backgroundState.type === 'template') && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Image Filters
            </Typography>
            <Button onClick={resetFilters} size="small" variant="outlined">
              Reset Filters
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {[
              { key: 'blur', label: 'Blur', min: 0, max: 20, step: 1, unit: 'px' },
              { key: 'opacity', label: 'Opacity', min: 0, max: 100, step: 1, unit: '%' },
              { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 1, unit: '%' },
              { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1, unit: '%' },
              { key: 'saturation', label: 'Saturation', min: 0, max: 200, step: 1, unit: '%' },
              { key: 'hue', label: 'Hue', min: -180, max: 180, step: 1, unit: '°' },
              { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1, unit: '%' },
              { key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 1, unit: '%' },
            ].map(({ key, label, min, max, step, unit }) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Typography variant="body2" gutterBottom>
                  {label}: {backgroundState[key as keyof BackgroundState]}{unit}
                </Typography>
                <Slider
                  value={backgroundState[key as keyof BackgroundState] as number}
                  onChange={(_, value) => handleFilterChange(key as keyof BackgroundState, value as number)}
                  min={min}
                  max={max}
                  step={step}
                  valueLabelDisplay="auto"
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
}
