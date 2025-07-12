import React, { useState, useEffect } from "react";
import WebFont from "webfontloader";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
const apiUrl = import.meta.env.VITE_GOOGLE_FONTS_API_URL;

interface FontSelectorProps {
  value: string;
  onChange: (font: string, availableWeights?: number[]) => void;
}

// Font weights mapping for Google Fonts
const getFontWeights = async (fontFamily: string): Promise<number[]> => {
  try {
    if (!apiKey || !apiUrl) {
      console.error('Google Fonts API key or URL not configured');
      return [100, 200, 300, 400, 500, 600, 700, 800, 900];
    }
    
    const response = await fetch(`${apiUrl}?key=${apiKey}&family=${fontFamily.replace(/\s+/g, '+')}`);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const font = data.items.find((f: any) => f.family === fontFamily);
      if (font && font.variants) {
        // Filter out italic variants and convert to numbers
        const weights = font.variants
          .filter((variant: string) => /^\d+$/.test(variant))
          .map((variant: string) => Number(variant))
          .sort((a: number, b: number) => a - b);
        return weights.length > 0 ? weights : [400];
      }
    }
  } catch (error) {
    console.error('Error fetching font weights:', error);
  }
  
  // Default weights if API fails
  return [100, 200, 300, 400, 500, 600, 700, 800, 900];
};

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  const [fonts, setFonts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiKey || !apiUrl) {
      console.error('Google Fonts API key or URL not configured');
      setLoading(false);
      return;
    }
    
    fetch(`${apiUrl}?key=${apiKey}&sort=popularity`)
      .then((res) => res.json())
      .then((data) => {
        const families = data.items.map((font: any) => font.family);
        setFonts(families);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching fonts:', error);
        setLoading(false);
      });
  }, []);

  // Load selected font and get its weights
  useEffect(() => {
    if (value) {
      WebFont.load({
        google: { families: [value] },
      });
    }
  }, [value]);

  const handleFontChange = async (newFont: string | null) => {
    if (newFont) {
      // Get available weights for the new font
      const availableWeights = await getFontWeights(newFont);
      onChange(newFont, availableWeights);
    }
  };

  return (
    <Autocomplete
      options={fonts}
      loading={loading}
      value={value}
      onChange={(e, newValue) => handleFontChange(newValue)}
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
