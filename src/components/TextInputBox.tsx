import React from "react";
import { TextField } from "@mui/material";

type TextInputBoxProps = {
  value: string;
  onChange: (text: string) => void;
};

export default function TextInputBox({ value, onChange }: TextInputBoxProps) {
  return (
    <TextField
      label="Your Text"
      variant="outlined"
      fullWidth
      sx={{ mt: 2, mb: 2 }}
      multiline
      minRows={2}
      maxRows={4}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}
