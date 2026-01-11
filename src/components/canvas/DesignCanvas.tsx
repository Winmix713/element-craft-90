import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CanvasElement } from '@/types/canvas';

interface DesignCanvasProps {
  onElementSelect: (element: CanvasElement | null) => void;
  selectedElement: CanvasElement | null;
}

export const DesignCanvas = ({ onElementSelect, selectedElement }: DesignCanvasProps) => {
  const [elements] = useState<CanvasElement[]>([
    {
      id: 'btn-1',
      type: 'button',
      content: 'Click Me',
      className: 'px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors',
      position: { x: 100, y: 100 },
      selected: false,
    },
  ]);

  const handleElementClick = (element: CanvasElement, e: React.MouseEvent) => {
    e.stopPropagation();
    onElementSelect(element);
  };

  const handleCanvasClick = () => {
    onElementSelect(null);
  };

  return (
    <div 
      className="w-full h-full canvas-grid bg-[hsl(var(--canvas-bg))] relative overflow-auto"
      onClick={handleCanvasClick}
    >
      <div className="min-w-[1200px] min-h-[800px] relative">
        {elements.map((element) => (
          <div
            key={element.id}
            className={cn(
              "absolute cursor-pointer transition-all duration-150",
              selectedElement?.id === element.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            style={{ left: element.position.x, top: element.position.y }}
            onClick={(e) => handleElementClick(element, e)}
          >
            {element.type === 'button' && (
              <Button className={element.className}>
                {element.content}
              </Button>
            )}
          </div>
        ))}

        {elements.length === 1 && !selectedElement && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-muted-foreground/50">
              <p className="text-lg font-medium">Click the button to select it</p>
              <p className="text-sm">Then edit its properties in the inspector</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
