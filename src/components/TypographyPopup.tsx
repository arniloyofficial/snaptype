import React from "react";
import {
  Box,
  Typography,
  Slider,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  FormatLineSpacing,
  SpaceBar,
  KeyboardArrowRight,
} from "@mui/icons-material";

interface TypographyPopupProps {
  state: any;
  setState: (state: any) => void;
  onClose: () => void;
}

const TypographyPopup: React.FC<TypographyPopupProps> = ({ state, setState, onClose }) => {
  const handleLineHeightChange = (value: number) => {
    setState({ ...state, lineHeight: value });
  };

  const handleLetterSpacingChange = (value: number) => {
    setState({ ...state, letterSpacing: value });
  };

  const handleWordSpacingChange = (value: number) => {
    setState({ ...state, wordSpacing: value });
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setState({ ...state, [field]: numValue });
  };

  return (
    <Box sx={{ minWidth: 280 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormatLineSpacing />
        Typography Settings
      </Typography>
      
      <Divider sx={{ mb: 2 }} />

      {/* Line Height */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatLineSpacing sx={{ fontSize: 18 }} />
          Line Height
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={state.lineHeight}
            onChange={(_, value) => handleLineHeightChange(value as number)}
            min={0.5}
            max={3}
            step={0.1}
            valueLabelDisplay="auto"
            sx={{ mb: 1 }}
          />
          <TextField
            size="small"
            type="number"
            value={state.lineHeight}
            onChange={(e) => handleInputChange('lineHeight', e.target.value)}
            inputProps={{
              min: 0.5,
              max: 3,
              step: 0.1,
            }}
            sx={{ width: 100 }}
          />
        </Box>
      </Box>

      {/* Letter Spacing */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyboardArrowRight sx={{ fontSize: 18 }} />
          Letter Spacing
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={state.letterSpacing}
            onChange={(_, value) => handleLetterSpacingChange(value as number)}
            min={-5}
            max={20}
            step={0.5}
            valueLabelDisplay="auto"
            sx={{ mb: 1 }}
          />
          <TextField
            size="small"
            type="number"
            value={state.letterSpacing}
            onChange={(e) => handleInputChange('letterSpacing', e.target.value)}
            inputProps={{
              min: -5,
              max: 20,
              step: 0.5,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            sx={{ width: 100 }}
          />
        </Box>
      </Box>

      {/* Word Spacing */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpaceBar sx={{ fontSize: 18 }} />
          Word Spacing
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={state.wordSpacing}
            onChange={(_, value) => handleWordSpacingChange(value as number)}
            min={-10}
            max={50}
            step={1}
            valueLabelDisplay="auto"
            sx={{ mb: 1 }}
          />
          <TextField
            size="small"
            type="number"
            value={state.wordSpacing}
            onChange={(e) => handleInputChange('wordSpacing', e.target.value)}
            inputProps={{
              min: -10,
              max: 50,
              step: 1,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            sx={{ width: 100 }}
          />
        </Box>
      </Box>

      {/* Preview Text */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Preview:
        </Typography>
        <Typography
          sx={{
            fontFamily: state.font,
            fontSize: Math.min(state.size * 0.5, 16),
            fontWeight: state.weight,
            lineHeight: state.lineHeight,
            letterSpacing: `${state.letterSpacing}px`,
            wordSpacing: `${state.wordSpacing}px`,
            color: state.textColor,
            textAlign: 'center',
            fontStyle: state.italic ? 'italic' : 'normal',
            textDecoration: [
              state.underline ? 'underline' : '',
              state.strikethrough ? 'line-through' : ''
            ].filter(Boolean).join(' ') || 'none',
          }}
        >
          {state.text || 'Sample text preview'}
        </Typography>
      </Box>
    </Box>
  );
};

export default TypographyPopup;