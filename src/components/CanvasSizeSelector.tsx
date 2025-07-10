import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

type CanvasSizeSelectorProps = {
  value: { width: number; height: number };
  onChange: (size: { width: number; height: number }) => void;
};

const sizes = [
  { label: "Small", value: { width: 400, height: 200 } },
  { label: "Medium", value: { width: 800, height: 400 } },
  { label: "Large", value: { width: 1200, height: 600 } }
];

export default function CanvasSizeSelector({ value, onChange }: CanvasSizeSelectorProps) {
  return (
    <FormControl variant="outlined" sx={{ minWidth: 140 }}>
      <InputLabel>Canvas Size</InputLabel>
      <Select
        label="Canvas Size"
        value={sizes.find(s => s.value.width === value.width && s.value.height === value.height)?.label || sizes[1].label}
        onChange={e => {
          const sel = sizes.find(s => s.label === e.target.value);
          if (sel) onChange(sel.value);
        }}
      >
        {sizes.map(s => (
          <MenuItem key={s.label} value={s.label}>{s.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
