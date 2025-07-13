import React, { useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
  Typography,
  Alert
} from "@mui/material";
import html2canvas from "html2canvas";
import { BackgroundState, TextLayer } from "../App";

interface SaveDialogProps {
  open: boolean;
  onClose: () => void;
  previewRef: React.RefObject<HTMLDivElement>;
  canvasSize: { width: number; height: number };
  backgroundState: BackgroundState;
  textLayers: TextLayer[];
}

export default function SaveDialog({ 
  open, 
  onClose, 
  previewRef, 
  canvasSize,
  backgroundState,
  textLayers 
}: SaveDialogProps) {
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [quality, setQuality] = useState(0.9);
  const [scale, setScale] = useState(2);
  const [isExporting, setIsExporting] = useState(false);

  const handleSave = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Configure html2canvas options
      const options: any = {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        width: canvasSize.width,
        height: canvasSize.height,
        scrollX: 0,
        scrollY: 0,
        windowWidth: canvasSize.width,
        windowHeight: canvasSize.height,
      };

      // Handle background transparency
      if (backgroundState.type === 'solid' && backgroundState.solidColor === 'transparent') {
        options.backgroundColor = null;
      } else if (backgroundState.type === 'solid') {
        options.backgroundColor = backgroundState.solidColor;
      } else {
        // For gradients, images, and templates, let html2canvas capture the rendered background
        options.backgroundColor = null;
      }

      // Capture the canvas
      const canvas = await html2canvas(previewRef.current, options);
      
      // Convert to desired format
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const dataURL = format === "png" 
        ? canvas.toDataURL(mimeType) 
        : canvas.toDataURL(mimeType, quality);
      
      // Create download link
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `snaptext-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onClose();
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const isTransparentBackground = backgroundState.type === 'solid' && backgroundState.solidColor === 'transparent';
  const hasTextLayers = textLayers.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Image</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
          {/* Format Selection */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Export Format</FormLabel>
            <RadioGroup
              value={format}
              onChange={(e) => setFormat(e.target.value as "png" | "jpg")}
            >
              <FormControlLabel 
                value="png" 
                control={<Radio />} 
                label="PNG (supports transparency)" 
              />
              <FormControlLabel 
                value="jpg" 
                control={<Radio />} 
                label="JPG (smaller file size)"
                disabled={isTransparentBackground}
              />
            </RadioGroup>
          </FormControl>

          {/* Quality Setting (only for JPG) */}
          {format === "jpg" && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Quality: {Math.round(quality * 100)}%
              </Typography>
              <TextField
                type="range"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                inputProps={{
                  min: 0.1,
                  max: 1,
                  step: 0.1,
                }}
                fullWidth
              />
            </Box>
          )}

          {/* Scale Setting */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Export Scale: {scale}x ({canvasSize.width * scale} × {canvasSize.height * scale}px)
            </Typography>
            <TextField
              type="range"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              inputProps={{
                min: 1,
                max: 4,
                step: 0.5,
              }}
              fullWidth
            />
          </Box>

          {/* Warnings and Info */}
          {isTransparentBackground && (
            <Alert severity="info">
              Transparent background detected. JPG format is disabled as it doesn't support transparency.
            </Alert>
          )}
          
          {!hasTextLayers && (
            <Alert severity="warning">
              No text layers found. The exported image will only contain the background.
            </Alert>
          )}

          {/* Export Info */}
          <Box sx={{ 
            bgcolor: 'background.default', 
            p: 2, 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Export Details:</strong><br />
              Format: {format.toUpperCase()}<br />
              Original Size: {canvasSize.width} × {canvasSize.height}px<br />
              Export Size: {canvasSize.width * scale} × {canvasSize.height * scale}px<br />
              Text Layers: {textLayers.length}<br />
              Background: {backgroundState.type}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : `Export as ${format.toUpperCase()}`}
        </Button>
        <Button 
          onClick={onClose} 
          color="secondary"
          disabled={isExporting}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
