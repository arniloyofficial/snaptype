import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";

type AlignmentSelectorProps = {
  value: string;
  onChange: (alignment: string) => void;
};

export default function AlignmentSelector({ value, onChange }: AlignmentSelectorProps) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(_, newValue) => onChange(newValue || "center")}
      size="small"
      sx={{ minWidth: 120 }}
    >
      <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
      <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
      <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
    </ToggleButtonGroup>
  );
}
