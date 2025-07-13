import { useState, useCallback } from 'react';
import { TextLayer } from '../App';

export function useTextLayers() {
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  const createNewLayer = useCallback((): TextLayer => {
    const id = `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      text: "New Text Layer",
      font: "Google Sans",
      weight: 400,
      size: 36,
      color: "#000000",
      align: "center",
      lineHeight: 1.2,
      letterSpacing: 0,
      wordSpacing: 0,
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      opacity: 100,
      shadow: {
        enabled: false,
        color: "#000000",
        offsetX: 2,
        offsetY: 2,
        blur: 4,
      },
      stroke: {
        enabled: false,
        color: "#000000",
        width: 1,
      },
    };
  }, []);

  const addTextLayer = useCallback(() => {
    const newLayer = createNewLayer();
    setTextLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
    return newLayer;
  }, [createNewLayer]);

  const updateTextLayer = useCallback((layerId: string, updates: Partial<TextLayer>) => {
    setTextLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, ...updates }
          : layer
      )
    );
  }, []);

  const deleteTextLayer = useCallback((layerId: string) => {
    setTextLayers(prev => {
      const newLayers = prev.filter(layer => layer.id !== layerId);
      // If the deleted layer was active, select the last remaining layer
      if (activeLayerId === layerId) {
        const lastLayer = newLayers[newLayers.length - 1];
        setActiveLayerId(lastLayer ? lastLayer.id : null);
      }
      return newLayers;
    });
  }, [activeLayerId]);

  const selectTextLayer = useCallback((layerId: string | null) => {
    setActiveLayerId(layerId);
  }, []);

  const duplicateTextLayer = useCallback((layerId: string) => {
    const layerToDuplicate = textLayers.find(layer => layer.id === layerId);
    if (!layerToDuplicate) return;

    const duplicatedLayer: TextLayer = {
      ...layerToDuplicate,
      id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: `${layerToDuplicate.text} Copy`,
      x: layerToDuplicate.x + 20,
      y: layerToDuplicate.y + 20,
    };

    setTextLayers(prev => [...prev, duplicatedLayer]);
    setActiveLayerId(duplicatedLayer.id);
    return duplicatedLayer;
  }, [textLayers]);

  const reorderTextLayers = useCallback((fromIndex: number, toIndex: number) => {
    setTextLayers(prev => {
      const newLayers = [...prev];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      return newLayers;
    });
  }, []);

  const getActiveLayer = useCallback(() => {
    return textLayers.find(layer => layer.id === activeLayerId) || null;
  }, [textLayers, activeLayerId]);

  const moveLayerUp = useCallback((layerId: string) => {
    const currentIndex = textLayers.findIndex(layer => layer.id === layerId);
    if (currentIndex < textLayers.length - 1) {
      reorderTextLayers(currentIndex, currentIndex + 1);
    }
  }, [textLayers, reorderTextLayers]);

  const moveLayerDown = useCallback((layerId: string) => {
    const currentIndex = textLayers.findIndex(layer => layer.id === layerId);
    if (currentIndex > 0) {
      reorderTextLayers(currentIndex, currentIndex - 1);
    }
  }, [textLayers, reorderTextLayers]);

  const moveLayerToFront = useCallback((layerId: string) => {
    const currentIndex = textLayers.findIndex(layer => layer.id === layerId);
    if (currentIndex !== -1 && currentIndex < textLayers.length - 1) {
      reorderTextLayers(currentIndex, textLayers.length - 1);
    }
  }, [textLayers, reorderTextLayers]);

  const moveLayerToBack = useCallback((layerId: string) => {
    const currentIndex = textLayers.findIndex(layer => layer.id === layerId);
    if (currentIndex > 0) {
      reorderTextLayers(currentIndex, 0);
    }
  }, [textLayers, reorderTextLayers]);

  return {
    textLayers,
    activeLayerId,
    addTextLayer,
    updateTextLayer,
    deleteTextLayer,
    selectTextLayer,
    duplicateTextLayer,
    reorderTextLayers,
    getActiveLayer,
    moveLayerUp,
    moveLayerDown,
    moveLayerToFront,
    moveLayerToBack,
  };
}
