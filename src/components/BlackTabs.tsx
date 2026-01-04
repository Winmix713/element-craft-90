import React, { useEffect, useMemo } from 'react';
import { useElement } from '@/contexts/ElementContext';
import { cn } from '@/lib/utils';

interface BlackTabsProps {
  id: string;
  tabs: { label: string; value: string }[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const BlackTabs = ({ id, tabs, defaultValue, onValueChange }: BlackTabsProps) => {
  const { registerElement, selectElement, selectedElement, elements } = useElement();
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.value);
  
  const elementState = elements.get(id);
  const isSelected = selectedElement?.id === id;

  useEffect(() => {
    registerElement(id, 'div', `Tabs - ${id}`, {
      background: { color: '#0a0a0a', opacity: 100 },
      border: { radius: 12 },
      padding: { l: 4, t: 4, r: 4, b: 4 }
    });
  }, [id, registerElement]);

  const dynamicStyles = useMemo((): React.CSSProperties => {
    if (!elementState) return { backgroundColor: '#0a0a0a', borderRadius: '12px' };
    
    const { style } = elementState;
    const styles: React.CSSProperties = {
      backgroundColor: style.background.color || '#0a0a0a',
      borderRadius: `${style.border.radius}px`,
      opacity: style.background.opacity / 100,
      padding: `${style.padding.t}px ${style.padding.r}px ${style.padding.b}px ${style.padding.l}px`
    };

    if (style.border.color && style.border.width > 0) {
      styles.borderColor = style.border.color;
      styles.borderWidth = `${style.border.width}px`;
      styles.borderStyle = style.border.style;
    }

    if (style.shadow !== 'none') {
      const shadows: Record<string, string> = {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      };
      styles.boxShadow = shadows[style.shadow];
    }

    const transforms: string[] = [];
    if (style.transform.rotate !== 0) transforms.push(`rotate(${style.transform.rotate}deg)`);
    if (style.transform.scale !== 100) transforms.push(`scale(${style.transform.scale / 100})`);
    if (style.transform.x !== 0) transforms.push(`translateX(${style.transform.x}px)`);
    if (style.transform.y !== 0) transforms.push(`translateY(${style.transform.y}px)`);
    if (transforms.length > 0) styles.transform = transforms.join(' ');

    return styles;
  }, [elementState]);

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(id);
  };

  return (
    <div
      onClick={handleContainerClick}
      className={cn(
        "inline-flex gap-1 transition-all duration-200 cursor-pointer",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      style={dynamicStyles}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={(e) => {
            e.stopPropagation();
            handleTabClick(tab.value);
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
            activeTab === tab.value
              ? "bg-white text-black shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-white/10"
          )}
          style={{
            fontSize: elementState ? `${elementState.style.typography.size}px` : '14px',
            fontWeight: elementState?.style.typography.weight || '500'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Egyszerűbb Tab variáns
interface SimpleTabProps {
  id: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const BlackTab = ({ id, children, active, onClick }: SimpleTabProps) => {
  const { registerElement, selectElement, selectedElement, elements } = useElement();
  
  const elementState = elements.get(id);
  const isSelected = selectedElement?.id === id;

  useEffect(() => {
    registerElement(id, 'button', `Tab - ${id}`, {
      background: { color: active ? '#ffffff' : '#0a0a0a', opacity: 100 },
      typography: { font: 'Inter', weight: '500', size: 14 },
      border: { radius: 8 },
      padding: { l: 16, t: 8, r: 16, b: 8 }
    });
  }, [id, active, registerElement]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(id);
    onClick?.();
  };

  const dynamicStyles = useMemo((): React.CSSProperties => {
    if (!elementState) {
      return {
        backgroundColor: active ? '#ffffff' : '#0a0a0a',
        color: active ? '#000000' : '#a3a3a3',
        borderRadius: '8px'
      };
    }

    const { style } = elementState;
    const styles: React.CSSProperties = {
      backgroundColor: style.background.color || (active ? '#ffffff' : '#0a0a0a'),
      color: active ? '#000000' : '#a3a3a3',
      borderRadius: `${style.border.radius}px`,
      opacity: style.background.opacity / 100,
      fontSize: `${style.typography.size}px`,
      fontWeight: style.typography.weight,
      padding: `${style.padding.t}px ${style.padding.r}px ${style.padding.b}px ${style.padding.l}px`
    };

    if (style.shadow !== 'none') {
      const shadows: Record<string, string> = {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      };
      styles.boxShadow = shadows[style.shadow];
    }

    const transforms: string[] = [];
    if (style.transform.rotate !== 0) transforms.push(`rotate(${style.transform.rotate}deg)`);
    if (style.transform.scale !== 100) transforms.push(`scale(${style.transform.scale / 100})`);
    if (transforms.length > 0) styles.transform = transforms.join(' ');

    return styles;
  }, [elementState, active]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "text-sm font-medium transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      style={dynamicStyles}
    >
      {elementState?.content || children}
    </button>
  );
};
