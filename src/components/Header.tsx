import React, { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Link, 
  Box, 
  Typography, 
  Menu, 
  MenuItem, 
  useMediaQuery,
  IconButton,
  Tooltip 
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface HeaderProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  colorPalettes: Record<string, any>;
}

export default function Header({ selectedTheme, onThemeChange, colorPalettes }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (themeKey: string) => {
    onThemeChange(themeKey);
    handleClose();
  };

  return (
    <AppBar position="static" elevation={2} color="primary" sx={{ mb: 3 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src="/logo.svg" 
            alt="Snaptype Logo" 
            style={{ 
              height: '40px', 
              width: 'auto', 
              marginRight: '12px' 
            }} 
          />
        </Box>
        
        {/* Theme Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Tooltip title="Select theme color">
            <Box
              onClick={handleClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '4px 8px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              {/* Color Circle */}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: colorPalettes[selectedTheme].primary,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  mr: isMobile ? 0 : 1,
                  transition: 'all 0.2s ease',
                }}
              />
              
              {/* Text - Hidden on mobile */}
              {!isMobile && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    mr: 0.5
                  }}
                >
                  Select theme
                </Typography>
              )}
              
              {/* Dropdown Arrow */}
              <KeyboardArrowDownIcon 
                sx={{ 
                  color: 'white', 
                  fontSize: '1.2rem',
                  transition: 'transform 0.2s ease',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                }} 
              />
            </Box>
          </Tooltip>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                minWidth: 200,
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            {Object.entries(colorPalettes).map(([key, palette]) => (
              <MenuItem
                key={key}
                onClick={() => handleThemeSelect(key)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.5,
                  px: 2,
                  backgroundColor: selectedTheme === key ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: palette.primary,
                    border: '2px solid rgba(0, 0, 0, 0.1)',
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {palette.name}
                </Typography>
                {selectedTheme === key && (
                  <Typography variant="body2" sx={{ ml: 'auto', color: 'primary.main', fontSize: '0.75rem' }}>
                    ✓
                  </Typography>
                )}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* GitHub Link */}
        <Box>
          <Link
            href="https://github.com/arniloyofficial/snaptype"
            target="_blank"
            rel="noopener"
            color="inherit"
            underline="none"
            sx={{ 
              display: "flex", 
              alignItems: "center",
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <GitHubIcon sx={{ fontSize: '1.5rem' }} />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
