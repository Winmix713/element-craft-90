import React, { useEffect, useMemo } from 'react';
import { useElement, defaultElementState } from '@/contexts/ElementContext';
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

  // Regisztráljuk az elemet
  useEffect(() => {
    registerElement(id, {
      tag: 'div',
      textContent: tabs.map(t => t.label).join(', '),
      bgColor: '#0a0a0a',
      textColor: '#ffffff',
      padding: { l: '1', t: '1', r: '1', b: '1' },
      borderRadius: { all: 12, t: 12, r: 12, b: 12, l: 12 },
      typography: { font: 'inter', weight: 'medium', tracking: 'normal', size: '14' },
      elementId: id
    });
  }, [id]);

  // Dinamikus stílusok az Inspector beállításai alapján
  const dynamicStyles = useMemo(() => {
    if (!elementState) return {};
    
    const styles: React.CSSProperties = {};
    
    if (elementState.bgColor) styles.backgroundColor = elementState.bgColor;
    if (elementState.textColor) styles.color = elementState.textColor;
    if (elementState.opacity !== 100) styles.opacity = elementState.opacity / 100;
    if (elementState.borderRadius.all > 0) styles.borderRadius = `${elementState.borderRadius.all}px`;
    if (elementState.borderColor) {
      styles.borderColor = elementState.borderColor;
      styles.borderWidth = `${elementState.borderWidth || 1}px`;
      styles.borderStyle = 'solid';
    }
    if (elementState.blur > 0) styles.filter = `blur(${elementState.blur}px)`;
    if (elementState.shadow !== 'none') {
      const shadows: Record<string, string> = {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      };
      styles.boxShadow = shadows[elementState.shadow] || 'none';
    }
    
    // Transform
    const transforms: string[] = [];
    if (elementState.rotate !== 0) transforms.push(`rotate(${elementState.rotate}deg)`);
    if (elementState.scale !== 100) transforms.push(`scale(${elementState.scale / 100})`);
    if (elementState.translateX !== 0) transforms.push(`translateX(${elementState.translateX}px)`);
    if (elementState.translateY !== 0) transforms.push(`translateY(${elementState.translateY}px)`);
    if (elementState.skewX !== 0) transforms.push(`skewX(${elementState.skewX}deg)`);
    if (elementState.skewY !== 0) transforms.push(`skewY(${elementState.skewY}deg)`);
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
        "inline-flex p-1 gap-1 transition-all duration-200 cursor-pointer",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      style={{
        backgroundColor: elementState?.bgColor || '#0a0a0a',
        borderRadius: `${elementState?.borderRadius.all || 12}px`,
        ...dynamicStyles
      }}
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
            color: activeTab === tab.value 
              ? '#000000' 
              : elementState?.textColor || '#a3a3a3',
            fontFamily: elementState?.typography.font === 'mono' ? 'monospace' : 'inherit',
            fontWeight: elementState?.typography.weight === 'bold' ? 700 
              : elementState?.typography.weight === 'semibold' ? 600 
              : elementState?.typography.weight === 'medium' ? 500 : 400,
            fontSize: `${elementState?.typography.size || 14}px`
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
    registerElement(id, {
      tag: 'button',
      textContent: typeof children === 'string' ? children : 'Tab',
      bgColor: active ? '#ffffff' : '#0a0a0a',
      textColor: active ? '#000000' : '#a3a3a3',
      padding: { l: '4', t: '2', r: '4', b: '2' },
      borderRadius: { all: 8, t: 8, r: 8, b: 8, l: 8 },
      typography: { font: 'inter', weight: 'medium', tracking: 'normal', size: '14' },
      elementId: id
    });
  }, [id, active]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(id);
    onClick?.();
  };

  const dynamicStyles = useMemo(() => {
    if (!elementState) return {};
    
    const styles: React.CSSProperties = {
      backgroundColor: elementState.bgColor || (active ? '#ffffff' : '#0a0a0a'),
      color: elementState.textColor || (active ? '#000000' : '#a3a3a3'),
      borderRadius: `${elementState.borderRadius.all || 8}px`,
      opacity: elementState.opacity / 100,
      fontSize: `${elementState.typography.size || 14}px`,
      fontWeight: elementState.typography.weight === 'bold' ? 700 
        : elementState.typography.weight === 'semibold' ? 600 
        : elementState.typography.weight === 'medium' ? 500 : 400,
    };

    if (elementState.shadow !== 'none') {
      const shadows: Record<string, string> = {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      };
      styles.boxShadow = shadows[elementState.shadow];
    }

    const transforms: string[] = [];
    if (elementState.rotate !== 0) transforms.push(`rotate(${elementState.rotate}deg)`);
    if (elementState.scale !== 100) transforms.push(`scale(${elementState.scale / 100})`);
    if (transforms.length > 0) styles.transform = transforms.join(' ');

    return styles;
  }, [elementState, active]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      style={dynamicStyles}
    >
      {elementState?.textContent || children}
    </button>
  );
};
