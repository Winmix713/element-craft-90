import React, { useState, useCallback, memo } from 'react';
import { useInspector, InspectorState } from '@/components/PropertyInspector/InspectorContext';
import { cn } from '@/lib/utils';

interface CanvasElement {
  id: string;
  tag: keyof JSX.IntrinsicElements;
  content: string;
  className: string;
  link?: string;
}

const defaultElements: CanvasElement[] = [
  {
    id: 'heading-1',
    tag: 'h1',
    content: 'Welcome to the Design Editor',
    className: 'text-4xl font-bold text-foreground mb-6',
  },
  {
    id: 'paragraph-1',
    tag: 'p',
    content: 'Click any element on this canvas to select it and edit its properties in the inspector panel.',
    className: 'text-lg text-muted-foreground mb-8 max-w-2xl',
  },
  {
    id: 'button-primary',
    tag: 'button',
    content: 'Primary Button',
    className: 'px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity',
  },
  {
    id: 'button-secondary',
    tag: 'button',
    content: 'Secondary Button',
    className: 'px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-80 transition-opacity ml-4',
  },
  {
    id: 'card-1',
    tag: 'div',
    content: '',
    className: 'mt-8 p-6 bg-card rounded-xl border border-border shadow-sm',
  },
  {
    id: 'card-title',
    tag: 'h2',
    content: 'Card Title',
    className: 'text-xl font-semibold text-card-foreground mb-2',
  },
  {
    id: 'card-description',
    tag: 'p',
    content: 'This is a sample card component. Select it to modify its styles.',
    className: 'text-muted-foreground',
  },
];

interface CanvasElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onClick: (element: CanvasElement) => void;
  customStyles?: Partial<InspectorState>;
}

const CanvasElementComponent = memo(({ element, isSelected, onClick, customStyles }: CanvasElementProps) => {
  const Tag = element.tag;
  
  // Build inline styles from inspector state
  const buildStyles = (): React.CSSProperties => {
    if (!customStyles) return {};
    
    const styles: React.CSSProperties = {};
    
    if (customStyles.opacity !== undefined && customStyles.opacity !== 100) {
      styles.opacity = customStyles.opacity / 100;
    }
    
    if (customStyles.background?.color) {
      styles.backgroundColor = customStyles.background.color;
    }
    
    if (customStyles.border?.color) {
      styles.borderColor = customStyles.border.color;
    }
    
    if (customStyles.border?.width) {
      styles.borderWidth = `${customStyles.border.width}px`;
      styles.borderStyle = 'solid';
    }
    
    if (customStyles.border?.radius) {
      styles.borderRadius = `${customStyles.border.radius}px`;
    }
    
    if (customStyles.transforms) {
      const { translateX, translateY, rotate, scale, skewX, skewY } = customStyles.transforms;
      const transforms: string[] = [];
      
      if (translateX !== 0) transforms.push(`translateX(${translateX}px)`);
      if (translateY !== 0) transforms.push(`translateY(${translateY}px)`);
      if (rotate !== 0) transforms.push(`rotate(${rotate}deg)`);
      if (scale !== 100) transforms.push(`scale(${scale / 100})`);
      if (skewX !== 0) transforms.push(`skewX(${skewX}deg)`);
      if (skewY !== 0) transforms.push(`skewY(${skewY}deg)`);
      
      if (transforms.length > 0) {
        styles.transform = transforms.join(' ');
      }
    }
    
    if (customStyles.blur && customStyles.blur > 0) {
      styles.filter = `blur(${customStyles.blur}px)`;
    }
    
    return styles;
  };
  
  const displayContent = customStyles?.textContent || element.content;
  
  return (
    <Tag
      className={cn(
        element.className,
        'cursor-pointer transition-all duration-200',
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
      style={buildStyles()}
      onClick={(e) => {
        e.stopPropagation();
        onClick(element);
      }}
    >
      {displayContent}
      {element.id === 'card-1' && (
        <div className="space-y-2">
          {defaultElements
            .filter(el => el.id === 'card-title' || el.id === 'card-description')
            .map(childEl => (
              <CanvasElementComponent
                key={childEl.id}
                element={childEl}
                isSelected={false}
                onClick={onClick}
              />
            ))}
        </div>
      )}
    </Tag>
  );
});

CanvasElementComponent.displayName = 'CanvasElementComponent';

export const DesignCanvas: React.FC = () => {
  const { state, updateState } = useInspector();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const handleElementClick = useCallback((element: CanvasElement) => {
    setSelectedId(element.id);
    
    // Update inspector state with selected element's properties
    updateState('elementId', element.id);
    updateState('elementTag', element.tag);
    updateState('textContent', element.content);
    updateState('tailwindClasses', element.className);
    updateState('link', element.link || '');
  }, [updateState]);
  
  const handleCanvasClick = useCallback(() => {
    setSelectedId(null);
  }, []);
  
  const topLevelElements = defaultElements.filter(
    el => el.id !== 'card-title' && el.id !== 'card-description'
  );
  
  return (
    <div 
      className="flex-1 min-h-screen bg-background p-12 overflow-auto"
      onClick={handleCanvasClick}
    >
      <div className="max-w-4xl mx-auto">
        {/* Grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        
        {/* Canvas content */}
        <div className="relative z-10 space-y-4">
          {topLevelElements.map(element => (
            <CanvasElementComponent
              key={element.id}
              element={element}
              isSelected={selectedId === element.id}
              onClick={handleElementClick}
              customStyles={selectedId === element.id ? state : undefined}
            />
          ))}
        </div>
        
        {/* Selection hint */}
        {!selectedId && (
          <div className="mt-12 text-center text-muted-foreground text-sm">
            <p>Click an element to select it and view its properties</p>
          </div>
        )}
        
        {selectedId && (
          <div className="mt-12 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Selected:</span> {selectedId}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Use the Property Inspector panel to modify this element
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
