import React, { useState, useEffect } from "react";
import WebFont from "webfontloader";
import { Select, MenuItem, TextField, InputLabel, FormControl, CircularProgress } from "@mui/material";

// TODO: Replace with your actual Google Fonts API key
const apiKey = "AIzaSyD6UsY0l_2k6pAPE3dRYaZ0sbOBB4_Ax9I";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  const [fonts, setFonts] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Google Fonts list
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
    )
      .then((res) => res.json())
      .then((data) => {
        setFonts(data.items.map((font: any) => font.family));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load the selected font dynamically
  useEffect(() => {
    if (value) {
      WebFont.load({
        google: { families: [value] },
      });
    }
  }, [value]);

  const filtered = fonts.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormControl sx={{ minWidth: 180 }}>
      <InputLabel>Font</InputLabel>
      {loading ? (
        <Select value={value} label="Font" disabled>
          <MenuItem>
            <CircularProgress size={20} />
          </MenuItem>
        </Select>
      ) : (
        <Select
          value={value}
          label="Font"
          onChange={(e) => onChange(e.target.value as string)}
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
        >
          <MenuItem disableRipple>
            <TextField
              placeholder="Search font"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ width: "100%" }}
              autoFocus
            />
          </MenuItem>
          {filtered.map((font) => (
            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default FontSelector;
