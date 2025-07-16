import { useState } from "react";
import { Element } from "../types";

export default function useTextLayers() {
  const [elements, setElements] = useState<Element[]>([]);

  const addElement = (el: Element) => {
    setElements((prev) => [...prev, el]);
  };

  const updateElement = (id: string, data: Partial<Element>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...data } : el))
    );
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  return { elements, addElement, updateElement, removeElement };
}
