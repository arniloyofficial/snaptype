import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import html2canvas from "html2canvas";

export default function SaveDialog({ open, onClose, previewRef, state }: any) {
  const handleSave = async (type: "png" | "jpg") => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: state.bgColor === "transparent" ? null : state.bgColor,
      scale: 2
    });
    const dataURL = type === "png" ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `snaptype.${type}`;
    link.click();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Image</DialogTitle>
      <DialogContent>
        Choose a format to export your text as an image.
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSave("png")} variant="contained" color="primary">
          Save as PNG
        </Button>
        <Button onClick={() => handleSave("jpg")} variant="outlined" color="primary">
          Save as JPG
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
