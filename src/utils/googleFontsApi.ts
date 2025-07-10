import axios from "axios";

const API_KEY = "AIzaSyD6UsY0l_2k6pAPE3dRYaZ0sbOBB4_Ax9I";

export async function fetchGoogleFontsList(): Promise<{ family: string, variants: string[] }[]> {
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`;
  const res = await axios.get(url);
  return res.data.items.map((f: any) => ({
    family: f.family,
    variants: f.variants
  }));
}
