// Utility for dynamically loading Google Fonts in the app

export function loadGoogleFont(family: string, variant: string = "regular") {
  const fontId = `${family.replace(/\s+/g, "-")}-${variant}`;
  if (document.getElementById(fontId)) return;
  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css?family=${family.replace(/ /g, "+")}:${variant}`;
  document.head.appendChild(link);
}

export const fontWeights = [
  "100", "200", "300", "400", "500", "600", "700", "800", "900"
];
