import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// --- Types & Interfaces ---

export interface ElementStyle {
  padding: { l: number; t: number; r: number; b: number };
  margin: { x: number; y: number };
  typography: { font: string; weight: string; size: number; lineHeight: number; letterSpacing: number; align: 'left' | 'center' | 'right' | 'justify' };
  background: { color: string | null; opacity: number; blur: number };
  border: { color: string | null; width: number; radius: number; style: 'solid' | 'dashed' | 'dotted' | 'none' };
  layout: { width: string; height: string; display: string; flexDirection: 'row' | 'column'; gap: number };
  transform: { rotate: number; scale: number; x: number; y: number };
  shadow: string;
}

export interface ElementState {
  id: string;
  type: string;
  name: string;
  content?: string;
  style: ElementStyle;
}

// Utility type for deep updates
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// --- Defaults ---

export const defaultStyle: ElementStyle = {
  padding: { l: 16, t: 16, r: 16, b: 16 },
  margin: { x: 0, y: 0 },
  typography: { font: 'Inter', weight: '500', size: 14, lineHeight: 1.5, letterSpacing: 0, align: 'left' },
  background: { color: '#0a0a0a', opacity: 100, blur: 0 },
  border: { color: null, width: 0, radius: 12, style: 'none' },
  layout: { width: 'auto', height: 'auto', display: 'flex', flexDirection: 'column', gap: 8 },
  transform: { rotate: 0, scale: 100, x: 0, y: 0 },
  shadow: 'none'
};

export const createDefaultElement = (id: string, type: string, name: string, overrides?: DeepPartial<ElementStyle>): ElementState => ({
  id,
  type,
  name,
  content: '',
  style: overrides ? deepMerge(defaultStyle, overrides) : { ...defaultStyle }
});

// --- Deep Merge Utility ---

const isObject = (item: any): item is Record<string, any> => 
  item && typeof item === 'object' && !Array.isArray(item);

const deepMerge = <T extends Record<string, any>>(target: T, source: DeepPartial<T>): T => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof typeof source];
      if (isObject(sourceValue)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceValue });
        } else {
          (output as any)[key] = deepMerge(target[key as keyof T] as Record<string, any>, sourceValue as Record<string, any>);
        }
      } else if (sourceValue !== undefined) {
        Object.assign(output, { [key]: sourceValue });
      }
    });
  }
  return output;
};

// --- Context ---

interface ElementContextType {
  elements: Map<string, ElementState>;
  selectedElement: ElementState | null;
  registerElement: (id: string, type: string, name: string, styleOverrides?: DeepPartial<ElementStyle>) => void;
  selectElement: (id: string) => void;
  deselectElement: () => void;
  updateElement: (id: string, updates: DeepPartial<ElementState>) => void;
}

const ElementContext = createContext<ElementContextType | undefined>(undefined);

export const ElementProvider = ({ children }: { children: ReactNode }) => {
  const [elements, setElements] = useState<Map<string, ElementState>>(new Map());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const registerElement = useCallback((id: string, type: string, name: string, styleOverrides?: DeepPartial<ElementStyle>) => {
    setElements(prev => {
      if (prev.has(id)) return prev;
      const next = new Map(prev);
      next.set(id, createDefaultElement(id, type, name, styleOverrides));
      return next;
    });
  }, []);

  const selectElement = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const deselectElement = useCallback(() => {
    setSelectedId(null);
  }, []);

  const updateElement = useCallback((id: string, updates: DeepPartial<ElementState>) => {
    setElements(prev => {
      const current = prev.get(id);
      if (!current) return prev;
      
      const next = new Map(prev);
      const updated = deepMerge(current, updates);
      next.set(id, updated);
      return next;
    });
  }, []);

  const selectedElement = selectedId ? elements.get(selectedId) || null : null;

  return (
    <ElementContext.Provider value={{
      elements,
      selectedElement,
      registerElement,
      selectElement,
      deselectElement,
      updateElement
    }}>
      {children}
    </ElementContext.Provider>
  );
};

export const useElement = () => {
  const context = useContext(ElementContext);
  if (!context) throw new Error('useElement must be used within an ElementProvider');
  return context;
};
