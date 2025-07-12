import axios from "axios";

// Use environment variables for API configuration
const GOOGLE_FONTS_API_KEY = process.env.REACT_APP_GOOGLE_FONTS_API_KEY;
const GOOGLE_FONTS_API_URL = process.env.REACT_APP_GOOGLE_FONTS_API_URL;

export async function fetchGoogleFontsList(): Promise<{ family: string, variants: string[] }[]> {
  const url = `${GOOGLE_FONTS_API_URL}?key=${GOOGLE_FONTS_API_KEY}`;
  const res = await axios.get(url);
  return res.data.items.map((f: any) => ({
    family: f.family,
    variants: f.variants
  }));
}
