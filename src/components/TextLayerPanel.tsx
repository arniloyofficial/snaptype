import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Slider,
  TextField,
  Collapse,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  DragIndicator,
  Visibility,
  VisibilityOff,
  Delete,
  ContentCopy,
  ExpandMore,
  ExpandLess,
  Add,
  TextFields,
  FormatSize,
  Palette,
  Opacity,
  RotateRight,
  Shadow,
  BorderOuter,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TextLayer } from '../App';

interface TextLayerPanelProps {
  textLayers: TextLayer[];
  activeLayerId: string | null;
  onSelectTextLayer: (layerId: string) => void;
  onUpdateTextLayer: (layerId: string, updates: Partial<TextLayer>) => void;
  onDeleteTextLayer: (layerId: string) => void;
  onDuplicateTextLayer: (layerId: string) => void;
  onReorderLayers: (startIndex: number, endIndex: number) => void;
}

export default function TextLayerPanel({
  textLayers,
  activeLayerId,
  onSelectTextLayer,
  onUpdateTextLayer,
  onDeleteTextLayer,
  onDuplicateTextLayer,
  onReorderLayers,
}: TextLayerPanelProps) {
  const theme = useTheme();
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

  const toggleLayerExpansion = (layerId: string) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId);
    } else {
      newExpanded.add(layerId);
    }
    setExpandedLayers(newExpanded);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    
    onReorderLayers(startIndex, endIndex);
  };

  const getLayerPreview = (layer: TextLayer) => {
    const preview = layer.text.substring(0, 30);
    return preview.length < layer.text.length ? preview + '...' : preview;
  };

  const renderLayerControls = (layer: TextLayer) => {
    const isExpanded = expandedLayers.has(layer.id);
    
    return (
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, pt: 1, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
          {/* Basic Text Properties */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
            <TextFields sx={{ mr: 1, fontSize: 16 }} />
            Text Properties
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              label="Font Size"
              type="number"
              size="small"
              value={layer.size}
              onChange={(e) => onUpdateTextLayer(layer.id, { size: Number(e.target.value) })}
              InputProps={{
                endAdornment: <Typography variant="caption">px</Typography>,
              }}
            />
            <TextField
              label="Font Weight"
              type="number"
              size="small"
              value={layer.weight}
              onChange={(e) => onUpdateTextLayer(layer.id, { weight: Number(e.target.value) })}
              inputProps={{ min: 100, max: 900, step: 100 }}
            />
          </Box>

          {/* Color Controls */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Palette sx={{ mr: 1, fontSize: 16 }} />
                Text Color
              </Typography>
              <input
                type="color"
                value={layer.color}
                onChange={(e) => onUpdateTextLayer(layer.id, { color: e.target.value })}
                style={{
                  width: '100%',
                  height: 40,
                  border: 'none',
                  borderRadius: theme.shape.borderRadius,
                  cursor: 'pointer',
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Opacity sx={{ mr: 1, fontSize: 16 }} />
                Opacity
              </Typography>
              <Slider
                value={layer.opacity}
                onChange={(_, value) => onUpdateTextLayer(layer.id, { opacity: value as number })}
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
            </Box>
          </Box>

          {/* Position & Transform */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
            <RotateRight sx={{ mr: 1, fontSize: 16 }} />
            Position & Transform
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              label="X Position"
              type="number"
              size="small"
              value={Math.round(layer.x)}
              onChange={(e) => onUpdateTextLayer(layer.id, { x: Number(e.target.value) })}
            />
            <TextField
              label="Y Position"
              type="number"
              size="small"
              value={Math.round(layer.y)}
              onChange={(e) => onUpdateTextLayer(layer.id, { y: Number(e.target.value) })}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Rotation: {layer.rotation}°
            </Typography>
            <Slider
              value={layer.rotation}
              onChange={(_, value) => onUpdateTextLayer(layer.id, { rotation: value as number })}
              min={-180}
              max={180}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}°`}
            />
          </Box>

          {/* Typography Controls */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
            <FormatSize sx={{ mr: 1, fontSize: 16 }} />
            Typography
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Line Height</Typography>
              <Slider
                value={layer.lineHeight}
                onChange={(_, value) => onUpdateTextLayer(layer.id, { lineHeight: value as number })}
                min={0.5}
                max={3}
                step={0.1}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Letter Spacing</Typography>
              <Slider
                value={layer.letterSpacing}
                onChange={(_, value) => onUpdateTextLayer(layer.id, { letterSpacing: value as number })}
                min={-5}
                max={20}
                step={0.5}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}px`}
              />
            </Box>
          </Box>

          {/* Shadow Controls */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
            <Shadow sx={{ mr: 1, fontSize: 16 }} />
            Shadow
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={layer.shadow.enabled}
                onChange={(e) => onUpdateTextLayer(layer.id, { 
                  shadow: { ...layer.shadow, enabled: e.target.checked } 
                })}
                color="primary"
              />
            }
            label="Enable Shadow"
            sx={{ mb: 1 }}
          />

          {layer.shadow.enabled && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Shadow Color</Typography>
                <input
                  type="color"
                  value={layer.shadow.color}
                  onChange={(e) => onUpdateTextLayer(layer.id, { 
                    shadow: { ...layer.shadow, color: e.target.value } 
                  })}
                  style={{
                    width: '100%',
                    height: 32,
                    border: 'none',
                    borderRadius: theme.shape.borderRadius,
                    cursor: 'pointer',
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Shadow Blur</Typography>
                <Slider
                  value={layer.shadow.blur}
                  onChange={(_, value) => onUpdateTextLayer(layer.id, { 
                    shadow: { ...layer.shadow, blur: value as number } 
                  })}
                  min={0}
                  max={20}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                />
              </Box>
            </Box>
          )}

          {layer.shadow.enabled && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Offset X</Typography>
                <Slider
                  value={layer.shadow.offsetX}
                  onChange={(_, value) => onUpdateTextLayer(layer.id, { 
                    shadow: { ...layer.shadow, offsetX: value as number } 
                  })}
                  min={-20}
                  max={20}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Offset Y</Typography>
                <Slider
                  value={layer.shadow.offsetY}
                  onChange={(_, value) => onUpdateTextLayer(layer.id, { 
                    shadow: { ...layer.shadow, offsetY: value as number } 
                  })}
                  min={-20}
                  max={20}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                />
              </Box>
            </Box>
          )}

          {/* Stroke Controls */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
            <BorderOuter sx={{ mr: 1, fontSize: 16 }} />
            Stroke
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={layer.stroke.enabled}
                onChange={(e) => onUpdateTextLayer(layer.id, { 
                  stroke: { ...layer.stroke, enabled: e.target.checked } 
                })}
                color="primary"
              />
            }
            label="Enable Stroke"
            sx={{ mb: 1 }}
          />

          {layer.stroke.enabled && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Stroke Color</Typography>
                <input
                  type="color"
                  value={layer.stroke.color}
                  onChange={(e) => onUpdateTextLayer(layer.id, { 
                    stroke: { ...layer.stroke, color: e.target.value } 
                  })}
                  style={{
                    width: '100%',
                    height: 32,
                    border: 'none',
                    borderRadius: theme.shape.borderRadius,
                    cursor: 'pointer',
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Stroke Width</Typography>
                <Slider
                  value={layer.stroke.width}
                  onChange={(_, value) => onUpdateTextLayer(layer.id, { 
                    stroke: { ...layer.stroke, width: value as number } 
                  })}
                  min={1}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        Text Layers ({textLayers.length})
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Drag layers to reorder them. Top layers appear in front.
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="text-layers">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ 
                maxHeight: '60vh',
                overflow: 'auto',
                '& .MuiListItem-root': {
                  borderRadius: 2,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }
              }}
            >
              {textLayers.map((layer, index) => (
                <Draggable key={layer.id} draggableId={layer.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                      }}
                    >
                      <ListItem
                        sx={{
                          bgcolor: activeLayerId === layer.id ? 
                            alpha(theme.palette.primary.main, 0.1) : 
                            'background.paper',
                          border: activeLayerId === layer.id ? 
                            `2px solid ${theme.palette.primary.main}` : 
                            '1px solid',
                          borderColor: activeLayerId === layer.id ? 
                            'primary.main' : 'divider',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                          cursor: 'pointer',
                          flexDirection: 'column',
                          alignItems: 'stretch',
                        }}
                        onClick={() => onSelectTextLayer(layer.id)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box
                            {...provided.dragHandleProps}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: 'text.secondary',
                              mr: 1,
                              cursor: 'grab',
                              '&:active': { cursor: 'grabbing' },
                            }}
                          >
                            <DragIndicator />
                          </Box>

                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  Layer {index + 1}
                                </Typography>
                                <Chip
                                  label={layer.font}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                {getLayerPreview(layer)}
                              </Typography>
                            }
                          />

                          <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Tooltip title="Toggle visibility">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateTextLayer(layer.id, { 
                                      opacity: layer.opacity > 0 ? 0 : 100 
                                    });
                                  }}
                                >
                                  {layer.opacity > 0 ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Duplicate layer">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicateTextLayer(layer.id);
                                  }}
                                >
                                  <ContentCopy />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Delete layer">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteTextLayer(layer.id);
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title={expandedLayers.has(layer.id) ? "Collapse" : "Expand"}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLayerExpansion(layer.id);
                                  }}
                                >
                                  {expandedLayers.has(layer.id) ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </ListItemSecondaryAction>
                        </Box>

                        {renderLayerControls(layer)}
                      </ListItem>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      {textLayers.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
          }}
        >
          <TextFields sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
          <Typography variant="body1" sx={{ mb: 1 }}>
            No text layers yet
          </Typography>
          <Typography variant="body2">
            Add your first text layer to get started
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
