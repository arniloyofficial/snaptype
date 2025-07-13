import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Collapse,
  IconButton,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Opacity,
  Rotate90DegreesCcw,
  FormatColorText,
  TextFields,
  Shadow,
  BorderColor,
  Palette,
} from '@mui/icons-material';
import { TextLayer } from '../App';

interface LayerControlsProps {
  textLayer: TextLayer;
  onUpdateTextLayer: (layerId: string, updates: Partial<TextLayer>) => void;
  onDeleteTextLayer: (layerId: string) => void;
  onDuplicateTextLayer: (layerId: string) => void;
  isActive: boolean;
  onSelect: () => void;
}

export default function LayerControls({
  textLayer,
  onUpdateTextLayer,
  onDeleteTextLayer,
  onDuplicateTextLayer,
  isActive,
  onSelect,
}: LayerControlsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedSections, setExpandedSections] = useState<{
    transform: boolean;
    shadow: boolean;
    stroke: boolean;
    advanced: boolean;
  }>({
    transform: false,
    shadow: false,
    stroke: false,
    advanced: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSliderChange = (property: keyof TextLayer, value: number | number[]) => {
    onUpdateTextLayer(textLayer.id, { [property]: value });
  };

  const handleNestedChange = (
    parentProperty: 'shadow' | 'stroke',
    childProperty: string,
    value: any
  ) => {
    onUpdateTextLayer(textLayer.id, {
      [parentProperty]: {
        ...textLayer[parentProperty],
        [childProperty]: value,
      },
    });
  };

  const handleTextChange = (value: string) => {
    onUpdateTextLayer(textLayer.id, { text: value });
  };

  const handleColorChange = (property: keyof TextLayer, value: string) => {
    onUpdateTextLayer(textLayer.id, { [property]: value });
  };

  const handleBooleanChange = (property: keyof TextLayer, value: boolean) => {
    onUpdateTextLayer(textLayer.id, { [property]: value });
  };

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    onUpdateTextLayer(textLayer.id, { align: alignment });
  };

  const SectionHeader = ({ 
    title, 
    icon, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    sectionKey: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          py: 1,
          px: 1,
          borderRadius: 1,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        onClick={() => toggleSection(sectionKey)}
      >
        {icon}
        <Typography variant="subtitle2" sx={{ ml: 1, flex: 1 }}>
          {title}
        </Typography>
        {expandedSections[sectionKey] ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Collapse in={expandedSections[sectionKey]}>
        <Box sx={{ pl: 2, pr: 1, pb: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );

  const ColorPicker = ({ 
    label, 
    value, 
    onChange, 
    icon 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    icon?: React.ReactNode;
  }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      {icon}
      <Typography variant="body2" sx={{ minWidth: 80 }}>
        {label}
      </Typography>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 32,
          height: 32,
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: 'transparent',
        }}
      />
      <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
        {value}
      </Typography>
    </Box>
  );

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step = 1, 
    unit = '',
    icon 
  }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    icon?: React.ReactNode;
  }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon}
        <Typography variant="body2" sx={{ minWidth: 80 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
          {value}{unit}
        </Typography>
      </Box>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        size="small"
        sx={{
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16,
          },
        }}
      />
    </Box>
  );

  return (
    <Paper
      elevation={isActive ? 3 : 1}
      sx={{
        p: 2,
        mb: 2,
        border: isActive ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        '&:hover': {
          elevation: 2,
          borderColor: theme.palette.primary.light,
        },
      }}
      onClick={onSelect}
    >
      {/* Layer Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextFields sx={{ mr: 1, color: 'text.secondary' }} />
        <Typography variant="h6" sx={{ flex: 1 }}>
          Text Layer
        </Typography>
        {isActive && (
          <Chip
            label="Active"
            size="small"
            color="primary"
            sx={{ fontSize: '0.75rem' }}
          />
        )}
      </Box>

      {/* Text Input */}
      <TextField
        label="Text Content"
        value={textLayer.text}
        onChange={(e) => handleTextChange(e.target.value)}
        fullWidth
        multiline
        minRows={1}
        maxRows={4}
        sx={{ mb: 2 }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicateTextLayer(textLayer.id);
          }}
        >
          Duplicate
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTextLayer(textLayer.id);
          }}
        >
          Delete
        </Button>
        
        {/* Alignment buttons */}
        <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
          {['left', 'center', 'right'].map((align) => (
            <Button
              key={align}
              size="small"
              variant={textLayer.align === align ? 'contained' : 'outlined'}
              onClick={(e) => {
                e.stopPropagation();
                handleAlignmentChange(align as 'left' | 'center' | 'right');
              }}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              {align[0].toUpperCase()}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Basic Controls */}
      <Box sx={{ mb: 2 }}>
        <ColorPicker
          label="Color"
          value={textLayer.color}
          onChange={(value) => handleColorChange('color', value)}
          icon={<FormatColorText sx={{ color: 'text.secondary' }} />}
        />
        
        <SliderControl
          label="Size"
          value={textLayer.size}
          onChange={(value) => handleSliderChange('size', value)}
          min={8}
          max={200}
          unit="px"
          icon={<TextFields sx={{ color: 'text.secondary' }} />}
        />
        
        <SliderControl
          label="Opacity"
          value={textLayer.opacity}
          onChange={(value) => handleSliderChange('opacity', value)}
          min={0}
          max={100}
          unit="%"
          icon={<Opacity sx={{ color: 'text.secondary' }} />}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Transform Controls */}
      <SectionHeader
        title="Transform"
        icon={<Rotate90DegreesCcw sx={{ color: 'text.secondary' }} />}
        sectionKey="transform"
      >
        <SliderControl
          label="Rotation"
          value={textLayer.rotation}
          onChange={(value) => handleSliderChange('rotation', value)}
          min={-180}
          max={180}
          unit="°"
        />
        
        <SliderControl
          label="Line Height"
          value={textLayer.lineHeight}
          onChange={(value) => handleSliderChange('lineHeight', value)}
          min={0.5}
          max={3}
          step={0.1}
        />
        
        <SliderControl
          label="Letter Spacing"
          value={textLayer.letterSpacing}
          onChange={(value) => handleSliderChange('letterSpacing', value)}
          min={-5}
          max={20}
          step={0.5}
          unit="px"
        />
        
        <SliderControl
          label="Word Spacing"
          value={textLayer.wordSpacing}
          onChange={(value) => handleSliderChange('wordSpacing', value)}
          min={-10}
          max={50}
          unit="px"
        />
      </SectionHeader>

      {/* Shadow Controls */}
      <SectionHeader
        title="Shadow"
        icon={<Shadow sx={{ color: 'text.secondary' }} />}
        sectionKey="shadow"
      >
        <FormControlLabel
          control={
            <Switch
              checked={textLayer.shadow.enabled}
              onChange={(e) => handleNestedChange('shadow', 'enabled', e.target.checked)}
            />
          }
          label="Enable Shadow"
          sx={{ mb: 1 }}
        />
        
        {textLayer.shadow.enabled && (
          <>
            <ColorPicker
              label="Shadow Color"
              value={textLayer.shadow.color}
              onChange={(value) => handleNestedChange('shadow', 'color', value)}
            />
            
            <SliderControl
              label="Offset X"
              value={textLayer.shadow.offsetX}
              onChange={(value) => handleNestedChange('shadow', 'offsetX', value)}
              min={-20}
              max={20}
              unit="px"
            />
            
            <SliderControl
              label="Offset Y"
              value={textLayer.shadow.offsetY}
              onChange={(value) => handleNestedChange('shadow', 'offsetY', value)}
              min={-20}
              max={20}
              unit="px"
            />
            
            <SliderControl
              label="Blur"
              value={textLayer.shadow.blur}
              onChange={(value) => handleNestedChange('shadow', 'blur', value)}
              min={0}
              max={20}
              unit="px"
            />
          </>
        )}
      </SectionHeader>

      {/* Stroke Controls */}
      <SectionHeader
        title="Stroke"
        icon={<BorderColor sx={{ color: 'text.secondary' }} />}
        sectionKey="stroke"
      >
        <FormControlLabel
          control={
            <Switch
              checked={textLayer.stroke.enabled}
              onChange={(e) => handleNestedChange('stroke', 'enabled', e.target.checked)}
            />
          }
          label="Enable Stroke"
          sx={{ mb: 1 }}
        />
        
        {textLayer.stroke.enabled && (
          <>
            <ColorPicker
              label="Stroke Color"
              value={textLayer.stroke.color}
              onChange={(value) => handleNestedChange('stroke', 'color', value)}
            />
            
            <SliderControl
              label="Stroke Width"
              value={textLayer.stroke.width}
              onChange={(value) => handleNestedChange('stroke', 'width', value)}
              min={1}
              max={10}
              unit="px"
            />
          </>
        )}
      </SectionHeader>

      {/* Advanced Controls */}
      <SectionHeader
        title="Advanced"
        icon={<Palette sx={{ color: 'text.secondary' }} />}
        sectionKey="advanced"
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={textLayer.bold}
                onChange={(e) => handleBooleanChange('bold', e.target.checked)}
              />
            }
            label="Bold"
          />
          <FormControlLabel
            control={
              <Switch
                checked={textLayer.italic}
                onChange={(e) => handleBooleanChange('italic', e.target.checked)}
              />
            }
            label="Italic"
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={textLayer.underline}
                onChange={(e) => handleBooleanChange('underline', e.target.checked)}
              />
            }
            label="Underline"
          />
          <FormControlLabel
            control={
              <Switch
                checked={textLayer.strikethrough}
                onChange={(e) => handleBooleanChange('strikethrough', e.target.checked)}
              />
            }
            label="Strikethrough"
          />
        </Box>
        
        <TextField
          label="Font Family"
          value={textLayer.font}
          onChange={(e) => onUpdateTextLayer(textLayer.id, { font: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        
        <SliderControl
          label="Font Weight"
          value={textLayer.weight}
          onChange={(value) => handleSliderChange('weight', value)}
          min={100}
          max={900}
          step={100}
        />
      </SectionHeader>
    </Paper>
  );
}
