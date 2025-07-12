import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { fetchGoogleFontsList } from "../utils/googleFontsApi";

type StyleSelectorProps = {
  font: string;
  value: string | number;
  onChange: (style: string | number) => void;
};

// Helper function to convert variant string to display name and weight
const parseVariant = (variant: string) => {
  if (variant === "regular") return { display: "Regular", weight: 400 };
  if (variant === "italic") return { display: "Italic", weight: 400 };
  
  const match = variant.match(/^(\d+)(italic)?$/);
  if (match) {
    const weight = parseInt(match[1]);
    const isItalic = match[2] === "italic";
    const weightName = {
      100: "Thin",
      200: "Extra Light",
      300: "Light",
      400: "Regular",
      500: "Medium",
      600: "Semi Bold",
      700: "Bold",
      800: "Extra Bold",
      900: "Black"
    }[weight] || weight.toString();
    
    return { 
      display: isItalic ? `${weightName} Italic` : weightName, 
      weight: weight,
      italic: isItalic
    };
  }
  
  return { display: variant, weight: 400 };
};

export default function StyleSelector({ font, value, onChange }: StyleSelectorProps) {
  const [variants, setVariants] = useState<string[]>(["regular"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchGoogleFontsList().then(list => {
      const found = list.find(f => f.family === font);
      if (found && found.variants) {
        setVariants(found.variants);
        // If current value is not in the new variants, reset to first available variant
        if (!found.variants.includes(value.toString())) {
          const firstVariant = found.variants[0];
          const parsed = parseVariant(firstVariant);
          onChange(parsed.weight);
        }
      } else {
        setVariants(["regular"]);
        onChange(400); // Default to regular weight
      }
      setLoading(false);
    }).catch(() => {
      setVariants(["regular"]);
      onChange(400);
      setLoading(false);
    });
  }, [font, value, onChange]);

  // Convert current value to variant string for display
  const getCurrentVariant = () => {
    if (typeof value === 'number') {
      // Find the variant that matches the current weight
      const matchingVariant = variants.find(v => {
        const parsed = parseVariant(v);
        return parsed.weight === value;
      });
      return matchingVariant || "regular";
    }
    return value.toString();
  };

  const handleChange = (selectedVariant: string) => {
    const parsed = parseVariant(selectedVariant);
    onChange(parsed.weight);
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 140 }}>
      <InputLabel>Style/Weight</InputLabel>
      <Select 
        label="Style/Weight" 
        value={getCurrentVariant()} 
        onChange={e => handleChange(e.target.value)}
        disabled={loading}
      >
        {variants.map(variant => {
          const parsed = parseVariant(variant);
          return (
            <MenuItem key={variant} value={variant}>
              {parsed.display}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
