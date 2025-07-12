import axios from "axios";

// Use environment variables for API configuration
const GOOGLE_FONTS_API_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
const GOOGLE_FONTS_API_URL = import.meta.env.VITE_GOOGLE_FONTS_API_URL;

export async function fetchGoogleFontsList(): Promise<{ family: string, variants: string[] }[]> {
  if (!GOOGLE_FONTS_API_KEY || !GOOGLE_FONTS_API_URL) {
    throw new Error('Google Fonts API key or URL not configured');
  }
  
  const url = `${GOOGLE_FONTS_API_URL}?key=${GOOGLE_FONTS_API_KEY}`;
  const res = await axios.get(url);
  return res.data.items.map((f: any) => ({
    family: f.family,
    variants: f.variants
  }));
}
