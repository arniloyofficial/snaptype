import { useState } from "react";

export default function useCanvasInteraction() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectElement = (id: string | null) => {
    setSelectedId(id);
  };

  return { selectedId, selectElement };
}
