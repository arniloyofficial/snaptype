import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Divider,
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import {
  TextFields,
  Palette,
  AspectRatio,
  FormatColorFill,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatLineSpacing,
  SpaceBar,
  Save,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import FontPopup from "./FontPopup";
import CanvasPopup from "./CanvasPopup";
import ColorPopup from "./ColorPopup";
import FormattingPopup from "./FormattingPopup";
import TypographyPopup from "./TypographyPopup";

interface SidebarProps {
  state: any;
  setState: (state: any) => void;
  onSave: () => void;
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ state, setState, onSave, onCanvasSizeChange }) => {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopupOpen = (popupType: string, element: HTMLElement) => {
    setActivePopup(popupType);
    setAnchorEl(element);
  };

  const handlePopupClose = () => {
    setActivePopup(null);
    setAnchorEl(null);
  };

  const toolSections = [
    {
      id: 'font',
      title: 'Font',
      icon: <TextFields />,
      component: FontPopup,
    },
    {
      id: 'canvas',
      title: 'Canvas',
      icon: <AspectRatio />,
      component: CanvasPopup,
    },
    {
      id: 'colors',
      title: 'Colors',
      icon: <Palette />,
      component: ColorPopup,
    },
    {
      id: 'formatting',
      title: 'Formatting',
      icon: <FormatBold />,
      component: FormattingPopup,
    },
    {
      id: 'typography',
      title: 'Typography',
      icon: <FormatLineSpacing />,
      component: TypographyPopup,
    },
  ];

  return (
    <Paper
      elevation={8}
      sx={{
        width: 300,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        ml: 2, // Left margin
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 16px rgba(0,0,0,0.08)',
        border: 'none',
        // Remove the maxHeight constraint that was causing issues
        overflow: 'hidden', // Prevent content overflow
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography variant="h6" gutterBottom>
          Create Snaptext
        </Typography>
        
        {/* Text Input */}
        <TextField
          label="Enter your text"
          multiline
          fullWidth
          minRows={2}
          maxRows={6}
          value={state.text}
          onChange={(e) => setState({ ...state, text: e.target.value })}
          sx={{ 
            fontFamily: state.font,
            '& .MuiInputBase-root': {
              minHeight: 'auto',
            },
            '& .MuiInputBase-input': {
              minHeight: '1.2em',
              overflow: 'hidden',
              resize: 'none',
            }
          }}
        />
      </Box>

      {/* Tool Sections - Scrollable */}
      <Box sx={{ 
        flex: 1, 
        p: 1, 
        overflowY: 'auto', // Allow scrolling if content exceeds height
        overflowX: 'hidden',
      }}>
        {toolSections.map((section) => (
          <Box key={section.id} sx={{ mb: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={(e) => handlePopupOpen(section.id, e.currentTarget)}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  {section.icon}
                  <ListItemText primary={section.title} />
                </Box>
                <ExpandMore
                  sx={{
                    transform: activePopup === section.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </ListItemButton>
            </ListItem>
            
            {/* Popover for each section */}
            <Popover
              open={activePopup === section.id}
              anchorEl={anchorEl}
              onClose={handlePopupClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  p: 2,
                  minWidth: 320,
                  maxWidth: 400,
                  ml: 1,
                  zIndex: 1300, // Ensure popover appears above other content
                },
              }}
            >
              <section.component
                state={state}
                setState={setState}
                onCanvasSizeChange={onCanvasSizeChange}
                onClose={handlePopupClose}
              />
            </Popover>
          </Box>
        ))}
      </Box>

      {/* Save Button */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onSave}
          startIcon={<Save />}
          sx={{ borderRadius: 2 }}
        >
          Save Image
        </Button>
      </Box>
    </Paper>
  );
};

export default Sidebar;