import React, { useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import {
  TextFields,
  Palette,
  AspectRatio,
  FormatBold,
  FormatLineSpacing,
  Save,
  Add,
  Close,
} from "@mui/icons-material";
import FontPopup from "./FontPopup";
import CanvasPopup from "./CanvasPopup";
import ColorPopup from "./ColorPopup";
import FormattingPopup from "./FormattingPopup";
import TypographyPopup from "./TypographyPopup";

interface MobileToolbarProps {
  state: any;
  setState: (state: any) => void;
  onSave: () => void;
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
}

const MobileToolbar: React.FC<MobileToolbarProps> = ({ 
  state, 
  setState, 
  onSave, 
  onCanvasSizeChange 
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const renderActiveSection = () => {
    const section = toolSections.find(s => s.id === activeSection);
    if (!section) return null;

    const Component = section.component;
    return (
      <Box sx={{ p: 2 }}>
        <Component
          state={state}
          setState={setState}
          onCanvasSizeChange={onCanvasSizeChange}
          onClose={() => setActiveSection(null)}
        />
      </Box>
    );
  };

  return (
    <>
      {/* Bottom Toolbar */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
        }}
      >
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <Add />
        </IconButton>

        <Box sx={{ display: 'flex', gap: 0.5, overflow: 'auto', flex: 1 }}>
          {toolSections.map((section) => (
            <IconButton
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              sx={{
                minWidth: 48,
                backgroundColor: activeSection === section.id ? 'primary.main' : 'transparent',
                color: activeSection === section.id ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: activeSection === section.id ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              {section.icon}
            </IconButton>
          ))}
        </Box>

        <IconButton
          onClick={onSave}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <Save />
        </IconButton>
      </Paper>

      {/* Expanded Section Panel */}
      {activeSection && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 72,
            left: 8,
            right: 8,
            zIndex: 999,
            borderRadius: 2,
            maxHeight: '50vh',
            overflow: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 1 }}>
            <Typography variant="h6">
              {toolSections.find(s => s.id === activeSection)?.title}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setActiveSection(null)}
            >
              <Close />
            </IconButton>
          </Box>
          {renderActiveSection()}
        </Paper>
      )}

      {/* Main Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px 16px 0 0',
            maxHeight: '80vh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Snaptext Editor
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          {/* Text Input */}
          <TextField
            label="Enter your text"
            multiline
            fullWidth
            minRows={2}
            maxRows={4}
            value={state.text}
            onChange={(e) => setState({ ...state, text: e.target.value })}
            sx={{ 
              mb: 2,
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

          <Divider sx={{ my: 2 }} />

          {/* Tool Sections */}
          <List>
            {toolSections.map((section) => (
              <ListItem key={section.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSectionClick(section.id)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: activeSection === section.id ? 'primary.main' : 'transparent',
                    color: activeSection === section.id ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: activeSection === section.id ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {section.icon}
                  </ListItemIcon>
                  <ListItemText primary={section.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Active Section Content */}
          {activeSection && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              {renderActiveSection()}
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                onSave();
                setDrawerOpen(false);
              }}
              startIcon={<Save />}
              sx={{ borderRadius: 2 }}
            >
              Save Image
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileToolbar;