import React from "react";
import { TextField } from "@mui/material";

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <TextField
      label="Text Color"
      type="color"
      value={value}
      onChange={e => onChange(e.target.value)}
      sx={{ width: 60, minWidth: 60 }}
      variant="outlined"
      InputLabelProps={{ shrink: true }}
    />
  );
}
