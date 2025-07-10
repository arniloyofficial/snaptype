import React from "react";
import { TextField } from "@mui/material";

type BgColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export default function BgColorPicker({ value, onChange }: BgColorPickerProps) {
  return (
    <TextField
      label="BG Color"
      type="color"
      value={value === "transparent" ? "#ffffff" : value}
      onChange={e => onChange(e.target.value)}
      sx={{ width: 60, minWidth: 60 }}
      variant="outlined"
      InputLabelProps={{ shrink: true }}
    />
  );
}
