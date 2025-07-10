import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { exportPreviewAsImage } from "../utils/exportImage";

export default function ExportButton() {
  const [open, setOpen] = useState(false);

  const handleExport = async (type: "png" | "jpg") => {
    setOpen(false);
    await exportPreviewAsImage(type);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Save image
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Choose image format</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleExport("png")}>Save as PNG</Button>
          <Button onClick={() => handleExport("jpg")}>Save as JPG</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
