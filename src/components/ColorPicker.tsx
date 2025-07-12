import React from "react";
import { TextField, Box } from "@mui/material";

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        label="Text Color"
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        sx={{ 
          width: 60, 
          minWidth: 60,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
            '& input[type="color"]': {
              borderRadius: '50%',
              border: '2px solid rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
            }
          }
        }}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
      {/* Subtle border around the color picker circle */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </Box>
  );
}
