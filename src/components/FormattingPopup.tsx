import React from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  TextFields,
  Refresh,
} from "@mui/icons-material";

interface FormattingPopupProps {
  state: any;
  setState: (state: any) => void;
  onClose?: () => void;
}

const FormattingPopup: React.FC<FormattingPopupProps> = ({ state, setState, onClose }) => {
  const handleStyleToggle = (style: string) => {
    setState({ ...state, [style]: !state[style] });
  };

  const handleAlignmentChange = (alignment: string) => {
    setState({ ...state, align: alignment });
  };

  const handleWeightChange = (weight: number) => {
    setState({ ...state, weight, bold: weight >= 600 });
  };

  const resetFormatting = () => {
    setState({
      ...state,
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      align: 'center',
      weight: 400,
    });
  };

  const fontWeights = [
    { value: 100, label: 'Thin' },
    { value: 200, label: 'Extra Light' },
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'Semi Bold' },
    { value: 700, label: 'Bold' },
    { value: 800, label: 'Extra Bold' },
    { value: 900, label: 'Black' },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormatBold />
        Formatting
      </Typography>

      {/* Font Weight Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Font Weight
        </Typography>
        <Grid container spacing={1}>
          {fontWeights.map((weight) => (
            <Grid item xs={4} key={weight.value}>
              <Paper
                elevation={state.weight === weight.value ? 3 : 1}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: state.weight === weight.value ? '2px solid' : '1px solid #ccc',
                  borderColor: state.weight === weight.value ? 'primary.main' : '#ccc',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  transition: 'all 0.2s ease',
                }}
                onClick={() => handleWeightChange(weight.value)}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: weight.value,
                    fontSize: '0.7rem',
                    lineHeight: 1,
                  }}
                >
                  {weight.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Text Style Toggles */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Text Style
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Tooltip title="Bold">
              <ToggleButton
                value="bold"
                selected={state.bold}
                onChange={() => handleStyleToggle('bold')}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                <FormatBold />
              </ToggleButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Italic">
              <ToggleButton
                value="italic"
                selected={state.italic}
                onChange={() => handleStyleToggle('italic')}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                <FormatItalic />
              </ToggleButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Underline">
              <ToggleButton
                value="underline"
                selected={state.underline}
                onChange={() => handleStyleToggle('underline')}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                <FormatUnderlined />
              </ToggleButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Strikethrough">
              <ToggleButton
                value="strikethrough"
                selected={state.strikethrough}
                onChange={() => handleStyleToggle('strikethrough')}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                <StrikethroughS />
              </ToggleButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Text Alignment */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Text Alignment
        </Typography>
        <ToggleButtonGroup
          value={state.align}
          exclusive
          onChange={(e, value) => value && handleAlignmentChange(value)}
          fullWidth
          sx={{ 
            '& .MuiToggleButton-root': {
              borderRadius: 2,
            }
          }}
        >
          <ToggleButton value="left">
            <FormatAlignLeft />
          </ToggleButton>
          <ToggleButton value="center">
            <FormatAlignCenter />
          </ToggleButton>
          <ToggleButton value="right">
            <FormatAlignRight />
          </ToggleButton>
          <ToggleButton value="justify">
            <FormatAlignJustify />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Preview */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Preview
        </Typography>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            textAlign: state.align,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            minHeight: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: state.align === 'center' ? 'center' : 
                           state.align === 'right' ? 'flex-end' : 'flex-start',
          }}
        >
          <Typography
            sx={{
              fontWeight: state.weight,
              fontStyle: state.italic ? 'italic' : 'normal',
              textDecoration: [
                state.underline ? 'underline' : '',
                state.strikethrough ? 'line-through' : ''
              ].filter(Boolean).join(' ') || 'none',
              color: state.textColor,
              fontSize: '14px',
            }}
          >
            {state.text || 'Sample text'}
          </Typography>
        </Paper>
      </Box>

      {/* Reset Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton
          onClick={resetFormatting}
          sx={{
            backgroundColor: 'action.hover',
            '&:hover': {
              backgroundColor: 'action.selected',
            },
          }}
        >
          <Refresh />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FormattingPopup;