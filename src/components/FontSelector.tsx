import React, { useState, useEffect } from "react";
import WebFont from "webfontloader";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";

// TODO: Replace with your actual Google Fonts API key
const apiKey = "AIzaSyD6UsY0l_2k6pAPE3dRYaZ0sbOBB4_Ax9I";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  const [fonts, setFonts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
    )
      .then((res) => res.json())
      .then((data) => {
        const families = data.items.map((font: any) => font.family);
        setFonts(families);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load selected font
  useEffect(() => {
    if (value) {
      WebFont.load({
        google: { families: [value] },
      });
    }
  }, [value]);

  return (
    <Autocomplete
      options={fonts}
      loading={loading}
      value={value}
      onChange={(e, newValue) => {
        if (newValue) onChange(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Font"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      getOptionLabel={(option) => option}
      renderOption={(props, option) => (
        <li {...props} style={{ fontFamily: option }}>
          <Typography variant="body2" fontFamily={option}>
            {option}
          </Typography>
        </li>
      )}
      sx={{ minWidth: 200 }}
    />
  );
};

export default FontSelector;
