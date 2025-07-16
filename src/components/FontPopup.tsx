import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Slider,
  CircularProgress,
} from "@mui/material";
import FontSelector from "./FontSelector";

interface FontPopupProps {
  state: any;
  setState: (state: any) => void;
  onClose: () => void;
}

// Font weights mapping for Google Fonts
const getFontWeights = async (fontFamily: string) => {
  try {
    const response = await fetch(`https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`);
    const cssText = await response.text();
    
    // Parse the CSS to extract available weights
    const weights = [];
    const weightMatches = cssText.match(/font-weight:\s*(\d+)/g);
    
    if (weightMatches) {
      const uniqueWeights = new Set();
      weightMatches.forEach(match => {
        const weight = parseInt(match.match(/\d+/)[0]);
        uniqueWeights.add(weight);
      });
      weights.push(...Array.from(uniqueWeights).sort((a, b) => a - b));
    }
    
    return weights.length > 0 ? weights : [100, 200, 300, 400, 500, 600, 700, 800, 900];
  } catch (error) {
    console.error('Error fetching font weights:', error);
    return [100, 200, 300, 400, 500, 600, 700, 800, 900];
  }
};

const FontPopup: React.FC<FontPopupProps> = ({ state, setState, onClose }) => {
  const [availableWeights, setAvailableWeights] = useState<number[]>([400]);
  const [isLoadingWeights, setIsLoadingWeights] = useState(false);

  // Fetch available weights when font changes
  useEffect(() => {
    const fetchWeights = async () => {
      if (!state.font) return;
      
      setIsLoadingWeights(true);
      try {
        const weights = await getFontWeights(state.font);
        setAvailableWeights(weights);
        
        // If current weight is not available, set to closest available weight
        if (!weights.includes(state.weight)) {
          const closestWeight = weights.reduce((prev, curr) => 
            Math.abs(curr - state.weight) < Math.abs(prev - state.weight) ? curr : prev
          );
          setState({ ...state, weight: closestWeight });
        }
      } catch (error) {
        console.error('Error fetching weights:', error);
        setAvailableWeights([100, 200, 300, 400, 500, 600, 700, 800, 900]);
      } finally {
        setIsLoadingWeights(false);
      }
    };
    
    fetchWeights();
  }, [state.font, setState]);

  const handleSizeChange = (newSize: number) => {
    setState({ ...state, size: Math.max(0, Math.min(1000, newSize)) });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Font Settings
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Font Family */}
        <FontSelector
          value={state.font}
          onChange={(font) => setState({ ...state, font })}
          fullWidth
        />

        {/* Font Weight */}
        <FormControl fullWidth>
          <InputLabel>Font Weight</InputLabel>
          <Select
            value={state.weight}
            label="Font Weight"
            onChange={(e) => setState({ ...state, weight: e.target.value })}
            disabled={isLoadingWeights}
          >
            {availableWeights.map((weight) => (
              <MenuItem key={weight} value={weight}>
                {weight} - {weight <= 300 ? 'Light' : weight <= 500 ? 'Regular' : 'Bold'}
              </MenuItem>
            ))}
          </Select>
          {isLoadingWeights && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <CircularProgress size={20} />
            </Box>
          )}
        </FormControl>

        {/* Font Size */}
        <TextField
          label="Font Size"
          type="number"
          value={state.size}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          InputProps={{
            endAdornment: <InputAdornment position="end">px</InputAdornment>,
            inputProps: { 
              min: 0, 
              max: 1000,
              step: 1
            }
          }}
          fullWidth
        />

        {/* Font Size Slider */}
        <Box>
          <Typography variant="body2" gutterBottom>
            Font Size: {state.size}px
          </Typography>
          <Slider
            value={state.size}
            onChange={(e, newValue) => handleSizeChange(newValue as number)}
            min={12}
            max={200}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FontPopup;