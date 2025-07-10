import html2canvas from "html2canvas";

export async function exportPreviewAsImage(type: "png" | "jpg") {
  const preview = document.getElementById("preview-panel");
  if (!preview) return;
  const canvas = await html2canvas(preview, { backgroundColor: null });
  const dataURL = type === "png" ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = `exported-text.${type}`;
  a.click();
}
