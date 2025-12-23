import React, { useRef } from 'react';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ElementProvider, useElement, ElementState } from "@/contexts/ElementContext";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { PropertyInspector } from "@/components/PropertyInspector";
import { Button } from "@/components/ui/button";
import { Plus, Undo, Redo, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Canvas Element Wrapper (This makes things interactive) ---
const CanvasElement = ({ data }: { data: ElementState }) => {
  const { selectElement, selectedIds, selection } = useElement();
  const isSelected = selectedIds.includes(data.id);
  const isPrimarySelection = selection?.id === data.id;

  const style: React.CSSProperties = {
    padding: `${data.style.padding.t}px ${data.style.padding.r}px ${data.style.padding.b}px ${data.style.padding.l}px`,
    width: data.style.layout.width,
    height: data.style.layout.height,
    transform: `
      rotate(${data.style.transform.rotate}deg) 
      scale(${data.style.transform.scale / 100}) 
      translate(${data.style.transform.x}px, ${data.style.transform.y}px)
    `,
    backgroundColor: data.style.background.color || undefined,
    opacity: data.style.background.opacity / 100,
    borderRadius: `${data.style.border.radius}px`,
    borderWidth: `${data.style.border.width}px`,
    borderColor: data.style.border.color || 'transparent',
    boxShadow: data.style.shadow !== 'none' ? `var(--shadow-${data.style.shadow})` : undefined,
    // Typography
    fontSize: `${data.style.typography.size}px`,
    fontWeight: data.style.typography.weight,
    textAlign: data.style.typography.align,
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        selectElement(data.id, e.shiftKey);
      }}
      className={cn(
        "relative transition-all duration-200 cursor-pointer group",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isPrimarySelection && "ring-4"
      )}
      style={style}
    >
      {/* Selection Label */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-t font-mono z-50">
          {data.name}
        </div>
      )}
      
      {/* Content Rendering */}
      {data.content || <span className="opacity-20 italic">Empty {data.type}</span>}
    </div>
  );
};

// --- Main Workspace Area ---
const Workspace = () => {
  const { elements, deselectAll, canUndo, canRedo, undo, redo, addElement } = useElement();
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950/50">
      {/* Toolbar */}
      <div className="h-12 border-b border-border bg-background/80 backdrop-blur px-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo}><Undo className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo}><Redo className="w-4 h-4" /></Button>
            <div className="w-px h-4 bg-border mx-2" />
            <Button variant="outline" size="sm" className="gap-2" onClick={() => addElement('div')}>
              <Plus className="w-3.5 h-3.5" /> Add Container
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => addElement('button')}>
              <Plus className="w-3.5 h-3.5" /> Add Button
            </Button>
         </div>
         <div className="text-xs text-muted-foreground font-mono">
            Canvas: 100%
         </div>
      </div>

      {/* Infinite Canvas Simulation */}
      <div 
        ref={canvasRef}
        className="flex-1 overflow-auto p-16 flex items-center justify-center relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-100"
        onClick={() => deselectAll()}
      >
         <div className="w-[800px] min-h-[600px] bg-background border border-border rounded-xl shadow-sm p-8 relative transition-colors duration-500">
            {elements.size === 0 ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 pointer-events-none">
                 <MousePointer2 className="w-12 h-12 mb-2 opacity-50" />
                 <p className="text-sm">Canvas is empty</p>
               </div>
            ) : (
              Array.from(elements.values()).map(el => (
                <CanvasElement key={el.id} data={el} />
              ))
            )}
         </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <ElementProvider>
        <div className="flex h-screen w-full overflow-hidden text-foreground bg-background">
          <ThemeCustomizer />
          <Workspace />
          <PropertyInspector />
        </div>
      </ElementProvider>
    </ThemeProvider>
  );
};

export default Index;
