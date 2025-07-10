import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type SizeSelectorProps = {
  value: number;
  onChange: (size: number) => void;
};

export default function SizeSelector({ value, onChange }: SizeSelectorProps) {
  const handleUp = () => onChange(value + 1);
  const handleDown = () => onChange(value > 1 ? value - 1 : 1);

  return (
    <TextField
      label="Text Size"
      type="number"
      size="small"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      sx={{ width: 100 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleUp}><ArrowDropUpIcon /></IconButton>
            <IconButton size="small" onClick={handleDown}><ArrowDropDownIcon /></IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
