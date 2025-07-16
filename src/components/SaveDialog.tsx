import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Link, Box, Typography } from "@mui/material";
import html2canvas from "html2canvas";

export default function SaveDialog({ open, onClose, previewRef, state }: any) {
  const handleSave = async (type: "png" | "jpg") => {
    if (!previewRef.current) return;
    
    try {
      // Get the actual canvas size from state
      const { width, height } = state.canvasSize;
      
      // Create a temporary container for export with exact dimensions
      const exportContainer = document.createElement('div');
      exportContainer.style.width = `${width}px`;
      exportContainer.style.height = `${height}px`;
      exportContainer.style.backgroundColor = state.transparentBackground ? 'transparent' : state.bgColor;
      exportContainer.style.display = 'flex';
      exportContainer.style.alignItems = 'center';
      exportContainer.style.justifyContent = 'center';
      exportContainer.style.position = 'absolute';
      exportContainer.style.top = '-9999px';
      exportContainer.style.left = '-9999px';
      exportContainer.style.overflow = 'hidden';
      exportContainer.style.fontFamily = state.font;
      exportContainer.style.boxSizing = 'border-box';
      
      // Create text container
      const textContainer = document.createElement('div');
      textContainer.style.width = '100%';
      textContainer.style.height = '100%';
      textContainer.style.display = 'flex';
      textContainer.style.alignItems = 'center';
      textContainer.style.justifyContent = state.align === 'center' ? 'center' : 
                                           state.align === 'right' ? 'flex-end' : 'flex-start';
      textContainer.style.padding = '16px'; // 2 * 8px (theme spacing)
      textContainer.style.boxSizing = 'border-box';
      
      // Create text element with proper scaling
      const textElement = document.createElement('div');
      textElement.style.fontFamily = state.font;
      textElement.style.fontSize = `${state.size}px`;
      textElement.style.fontWeight = state.bold ? 'bold' : state.weight.toString();
      textElement.style.color = state.textColor;
      textElement.style.textAlign = state.align;
      textElement.style.lineHeight = state.lineHeight.toString();
      textElement.style.letterSpacing = `${state.letterSpacing}px`;
      textElement.style.wordSpacing = `${state.wordSpacing}px`;
      textElement.style.fontStyle = state.italic ? 'italic' : 'normal';
      textElement.style.maxWidth = '90%';
      textElement.style.wordBreak = 'break-word';
      textElement.style.whiteSpace = 'pre-wrap';
      textElement.style.boxSizing = 'border-box';
      
      // Handle text decoration with proper thickness
      const decorations = [];
      if (state.underline) decorations.push('underline');
      if (state.strikethrough) decorations.push('line-through');
      textElement.style.textDecoration = decorations.join(' ') || 'none';
      
      // Set text decoration thickness to match preview
      if (decorations.length > 0) {
        textElement.style.textDecorationThickness = '2px';
        textElement.style.textUnderlineOffset = '2px';
      }
      
      textElement.textContent = state.text || 'Enter your text';
      
      // Assemble the export structure
      textContainer.appendChild(textElement);
      exportContainer.appendChild(textContainer);
      document.body.appendChild(exportContainer);
      
      // Create canvas with exact dimensions
      const canvas = await html2canvas(exportContainer, {
        backgroundColor: state.transparentBackground ? null : state.bgColor,
        width: width,
        height: height,
        scale: 2, // High DPI for quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure the cloned element has the exact same styles
          const clonedContainer = clonedDoc.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.border = 'none';
            clonedContainer.style.margin = '0';
            clonedContainer.style.padding = '0';
          }
        }
      });
      
      // Clean up
      document.body.removeChild(exportContainer);
      
      // Create download link
      const dataURL = type === "png" ? 
        canvas.toDataURL("image/png") : 
        canvas.toDataURL("image/jpeg", 0.95);
      
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `snaptext.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onClose();
    } catch (error) {
      console.error('Error saving image:', error);
      // Fallback to original method if new method fails
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: state.transparentBackground ? null : state.bgColor,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const dataURL = type === "png" ? 
        canvas.toDataURL("image/png") : 
        canvas.toDataURL("image/jpeg", 0.95);
      
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `snaptext.${type}`;
      link.click();
      
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 1 }}>
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start',  // Changed from 'center' to 'flex-start'
    gap: 1.5,
    flexWrap: 'wrap'
  }}>
    <Typography variant="h5" component="span">
      Save Image
    </Typography>
    <Link
      href="https://arniloy.framer.website" 
      target="_blank" 
      rel="noopener noreferrer"
      sx={{ textDecoration: 'none' }}
    >
      <Box sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        fontSize: '0.75rem',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'primary.dark',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }
      }}>
        Made with ❤️ by Arifin Rahman Niloy
      </Box>
    </Link>
  </Box>
</DialogTitle>
      <DialogContent>
        Choose a format to export your text as an image.
        {state.transparentBackground && (
          <div style={{ marginTop: "8px", fontSize: "0.875rem", color: "#666" }}>
            Note: JPG format doesn't support transparency. Choose PNG for transparent background.
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSave("png")} variant="contained" color="primary">
          Save as PNG
        </Button>
        <Button
          onClick={() => handleSave("jpg")}
          variant="outlined"
          color="primary"
          disabled={state.transparentBackground}
        >
          Save as JPG
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}