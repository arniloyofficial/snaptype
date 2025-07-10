import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { fetchGoogleFontsList } from "../utils/googleFontsApi";

type FontSelectorProps = {
  value: string;
  onChange: (font: string) => void;
};

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  const [fonts, setFonts] = useState<string[]>([]);

  useEffect(() => {
    fetchGoogleFontsList().then(list => setFonts(list.map(f => f.family)));
  }, []);

  return (
    <Autocomplete
      options={fonts}
      value={value}
      onChange={(_, newValue) => onChange(newValue || "")}
      renderInput={params => <TextField {...params} label="Font Family" variant="outlined" />}
      sx={{ minWidth: 180 }}
      disableClearable
      freeSolo={false}
    />
  );
}
