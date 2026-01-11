import { useState } from 'react';
import { PropertyInspector } from '@/components/PropertyInspector';
import { DesignCanvas } from '@/components/canvas/DesignCanvas';
import type { CanvasElement } from '@/types/canvas';

const Index = () => {
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [showInspector, setShowInspector] = useState(true);

  const handleElementSelect = (element: CanvasElement | null) => {
    setSelectedElement(element);
    if (element) {
      setShowInspector(true);
    }
  };

  const handleElementUpdate = (updates: { content?: string; className?: string }) => {
    if (selectedElement) {
      setSelectedElement({
        ...selectedElement,
        ...updates,
      });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[hsl(var(--editor-bg))] relative">
      <DesignCanvas
        onElementSelect={handleElementSelect}
        selectedElement={selectedElement}
      />
      <PropertyInspector
        isVisible={showInspector}
        onClose={() => setShowInspector(false)}
        selectedElement={selectedElement}
        onElementUpdate={handleElementUpdate}
      />
    </div>
  );
};

export default Index;
