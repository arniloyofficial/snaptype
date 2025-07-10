import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { fetchGoogleFontsList } from "../utils/googleFontsApi";

type StyleSelectorProps = {
  font: string;
  value: string;
  onChange: (style: string) => void;
};

export default function StyleSelector({ font, value, onChange }: StyleSelectorProps) {
  const [variants, setVariants] = useState<string[]>(["regular"]);

  useEffect(() => {
    fetchGoogleFontsList().then(list => {
      const found = list.find(f => f.family === font);
      setVariants(found ? found.variants : ["regular"]);
    });
  }, [font]);

  return (
    <FormControl variant="outlined" sx={{ minWidth: 140 }}>
      <InputLabel>Style/Weight</InputLabel>
      <Select label="Style/Weight" value={value} onChange={e => onChange(e.target.value)}>
        {variants.map(v => (
          <MenuItem key={v} value={v}>{v}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
