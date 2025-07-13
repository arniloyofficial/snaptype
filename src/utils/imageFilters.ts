/**
 * Image Filters Utility
 * Provides functions for applying various image filters and effects
 */

export interface ImageFilterOptions {
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  grayscale: number;
  sepia: number;
  opacity: number;
}

/**
 * Generates CSS filter string based on filter options
 */
export const generateFilterString = (filters: ImageFilterOptions): string => {
  const filterParts: string[] = [];

  if (filters.blur > 0) {
    filterParts.push(`blur(${filters.blur}px)`);
  }

  if (filters.brightness !== 100) {
    filterParts.push(`brightness(${filters.brightness}%)`);
  }

  if (filters.contrast !== 100) {
    filterParts.push(`contrast(${filters.contrast}%)`);
  }

  if (filters.saturation !== 100) {
    filterParts.push(`saturate(${filters.saturation}%)`);
  }

  if (filters.hue !== 0) {
    filterParts.push(`hue-rotate(${filters.hue}deg)`);
  }

  if (filters.grayscale > 0) {
    filterParts.push(`grayscale(${filters.grayscale}%)`);
  }

  if (filters.sepia > 0) {
    filterParts.push(`sepia(${filters.sepia}%)`);
  }

  return filterParts.join(' ');
};

/**
 * Applies filters to a canvas element
 */
export const applyFiltersToCanvas = (
  canvas: HTMLCanvasElement,
  filters: ImageFilterOptions
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Apply filters using CSS filters on the canvas
  const filterString = generateFilterString(filters);
  canvas.style.filter = filterString;
  canvas.style.opacity = (filters.opacity / 100).toString();
};

/**
 * Applies filters to an image element
 */
export const applyFiltersToImage = (
  image: HTMLImageElement,
  filters: ImageFilterOptions
): void => {
  const filterString = generateFilterString(filters);
  image.style.filter = filterString;
  image.style.opacity = (filters.opacity / 100).toString();
};

/**
 * Creates a processed image with filters applied
 */
export const createFilteredImage = (
  imageUrl: string,
  filters: ImageFilterOptions
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      applyFiltersToImage(img, filters);
      resolve(img);
    };
    
    img.onerror = (error) => {
      reject(error);
    };
    
    img.src = imageUrl;
  });
};

/**
 * Converts an image file to a data URL
 */
export const imageFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Resizes an image while maintaining aspect ratio
 */
export const resizeImage = (
  imageUrl: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * Predefined filter presets
 */
export const filterPresets = {
  none: {
    blur: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
  },
  vintage: {
    blur: 0,
    brightness: 110,
    contrast: 90,
    saturation: 80,
    hue: 10,
    grayscale: 0,
    sepia: 30,
    opacity: 100,
  },
  blackAndWhite: {
    blur: 0,
    brightness: 100,
    contrast: 110,
    saturation: 0,
    hue: 0,
    grayscale: 100,
    sepia: 0,
    opacity: 100,
  },
  warm: {
    blur: 0,
    brightness: 105,
    contrast: 95,
    saturation: 110,
    hue: 15,
    grayscale: 0,
    sepia: 10,
    opacity: 100,
  },
  cool: {
    blur: 0,
    brightness: 100,
    contrast: 105,
    saturation: 110,
    hue: -15,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
  },
  dramatic: {
    blur: 0,
    brightness: 90,
    contrast: 150,
    saturation: 120,
    hue: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
  },
  soft: {
    blur: 1,
    brightness: 110,
    contrast: 85,
    saturation: 90,
    hue: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 95,
  },
  faded: {
    blur: 0,
    brightness: 120,
    contrast: 70,
    saturation: 70,
    hue: 0,
    grayscale: 20,
    sepia: 0,
    opacity: 90,
  },
};

/**
 * Applies a preset filter to the given filter options
 */
export const applyFilterPreset = (
  presetName: keyof typeof filterPresets
): ImageFilterOptions => {
  return { ...filterPresets[presetName] };
};

/**
 * Blends two images together
 */
export const blendImages = (
  baseImageUrl: string,
  overlayImageUrl: string,
  blendMode: 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' = 'multiply',
  opacity: number = 1
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    const baseImg = new Image();
    const overlayImg = new Image();
    
    let imagesLoaded = 0;
    
    const checkImagesLoaded = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        // Set canvas size to base image
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        
        // Draw base image
        ctx.drawImage(baseImg, 0, 0);
        
        // Set blend mode and opacity
        ctx.globalCompositeOperation = blendMode;
        ctx.globalAlpha = opacity;
        
        // Draw overlay image
        ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      }
    };
    
    baseImg.onload = checkImagesLoaded;
    overlayImg.onload = checkImagesLoaded;
    
    baseImg.onerror = overlayImg.onerror = () => {
      reject(new Error('Failed to load images'));
    };
    
    baseImg.src = baseImageUrl;
    overlayImg.src = overlayImageUrl;
  });
};

/**
 * Validates if a file is a valid image
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Gets image dimensions from a file
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};
