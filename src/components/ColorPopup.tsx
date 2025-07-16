import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import {
  FormatColorText,
  FormatColorFill,
  Palette,
  Refresh,
} from "@mui/icons-material";

interface ColorPopupProps {
  state: any;
  setState: (state: any) => void;
  onClose?: () => void;
}

const ColorPopup: React.FC<ColorPopupProps> = ({ state, setState, onClose }) => {
  const [customTextColor, setCustomTextColor] = useState(state.textColor);
  const [customBgColor, setCustomBgColor] = useState(state.bgColor);

  const predefinedColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000", "#FFC0CB",
    "#A52A2A", "#808080", "#FFD700", "#4B0082", "#DC143C", "#32CD32",
    "#FF4500", "#8A2BE2", "#FF1493", "#00CED1", "#FF6347", "#9370DB",
    "#3CB371", "#FF69B4", "#BA55D3", "#CD853F", "#FFA07A", "#20B2AA",
    "#87CEEB", "#DDA0DD", "#98FB98", "#F0E68C", "#FF7F50", "#6495ED",
  ];

  const handleTextColorChange = (color: string) => {
    setState({ ...state, textColor: color });
    setCustomTextColor(color);
  };

  const handleBgColorChange = (color: string) => {
    setState({ ...state, bgColor: color });
    setCustomBgColor(color);
  };

  const handleTransparentToggle = (checked: boolean) => {
    setState({ 
      ...state, 
      transparentBackground: checked,
      bgColor: checked ? "transparent" : "#FFFFFF"
    });
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleRandomTextColor = () => {
    const randomColor = generateRandomColor();
    handleTextColorChange(randomColor);
  };

  const handleRandomBgColor = () => {
    const randomColor = generateRandomColor();
    handleBgColorChange(randomColor);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Palette />
        Colors
      </Typography>

      {/* Text Color Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FormatColorText />
          <Typography variant="subtitle1">Text Color</Typography>
          <IconButton size="small" onClick={handleRandomTextColor}>
            <Refresh />
          </IconButton>
        </Box>
        
        <TextField
          type="color"
          value={customTextColor}
          onChange={(e) => handleTextColorChange(e.target.value)}
          sx={{ mb: 2, width: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: customTextColor,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
        
        <Grid container spacing={1}>
          {predefinedColors.slice(0, 18).map((color, index) => (
            <Grid item xs={2} key={index}>
              <Paper
                elevation={state.textColor === color ? 3 : 1}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: state.textColor === color ? '2px solid' : '1px solid #ccc',
                  borderColor: state.textColor === color ? 'primary.main' : '#ccc',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
                onClick={() => handleTextColorChange(color)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Background Color Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FormatColorFill />
          <Typography variant="subtitle1">Background Color</Typography>
          <IconButton size="small" onClick={handleRandomBgColor}>
            <Refresh />
          </IconButton>
        </Box>
        
        <FormControlLabel
          control={
            <Switch
              checked={state.transparentBackground}
              onChange={(e) => handleTransparentToggle(e.target.checked)}
            />
          }
          label="Transparent Background"
          sx={{ mb: 2 }}
        />
        
        {!state.transparentBackground && (
          <>
            <TextField
              type="color"
              value={customBgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              sx={{ mb: 2, width: '100%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: customBgColor,
                        border: '1px solid #ccc',
                        borderRadius: 1,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            
            <Grid container spacing={1}>
              {predefinedColors.slice(0, 18).map((color, index) => (
                <Grid item xs={2} key={index}>
                  <Paper
                    elevation={state.bgColor === color ? 3 : 1}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: color,
                      cursor: 'pointer',
                      border: state.bgColor === color ? '2px solid' : '1px solid #ccc',
                      borderColor: state.bgColor === color ? 'primary.main' : '#ccc',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => handleBgColorChange(color)}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            handleTextColorChange("#000000");
            handleBgColorChange("#FFFFFF");
            setState({ ...state, transparentBackground: false });
          }}
        >
          Reset
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            handleTextColorChange("#FFFFFF");
            handleBgColorChange("#000000");
            setState({ ...state, transparentBackground: false });
          }}
        >
          Invert
        </Button>
      </Box>
    </Box>
  );
};

export default ColorPopup;