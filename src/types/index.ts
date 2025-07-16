export type ElementType = "text" | "image";

export interface Element {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;

  // For text:
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  textAlign?: "left" | "center" | "right" | "justify";

  // For image:
  src?: string;
}

export interface GradientStop {
  color: string;
  position: number; // percentage 0-100
}

export interface GradientBackground {
  type: "linear" | "radial" | "conic";
  angle: number; // for linear/conic
  position: { x: number; y: number }; // for radial/conic
  stops: GradientStop[];
}
