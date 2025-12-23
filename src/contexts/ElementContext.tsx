import React, { createContext, useContext, useState, ReactNode } from 'react';

// Elem állapot típusa
export interface ElementState {
  id: string;
  tag: string;
  textContent: string;
  padding: { l: string; t: string; r: string; b: string };
  margin: { x: string; y: string };
  position: { type: string; l: string; t: string; r: string; b: string };
  size: { width: string; height: string; maxW: string; maxH: string };
  spacing: { spaceX: string; spaceY: string; gapX: string; gapY: string };
  alignment: { justify: string; align: string };
  typography: { font: string; weight: string; tracking: string; size: string };
  opacity: number;
  rotate: number;
  scale: number;
  translateX: number;
  translateY: number;
  skewX: number;
  skewY: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  perspective: number;
  bgColor: string | null;
  textColor: string | null;
  borderColor: string | null;
  ringColor: string | null;
  borderRadius: { all: number; t: number; r: number; b: number; l: number };
  borderWidth: number;
  shadow: string;
  blur: number;
  backdropBlur: number;
  hueRotate: number;
  saturation: number;
  brightness: number;
  grayscale: number;
  invert: number;
  inlineCSS: string;
  elementId: string;
}

// Alapértelmezett elem állapot
export const defaultElementState: ElementState = {
  id: '',
  tag: 'div',
  textContent: '',
  padding: { l: '0', t: '0', r: '0', b: '0' },
  margin: { x: '0', y: '0' },
  position: { type: 'relative', l: '', t: '', r: '', b: '' },
  size: { width: '', height: '', maxW: '', maxH: '' },
  spacing: { spaceX: '', spaceY: '', gapX: '', gapY: '' },
  alignment: { justify: 'default', align: 'default' },
  typography: { font: 'inter', weight: 'normal', tracking: 'normal', size: '14' },
  opacity: 100,
  rotate: 0,
  scale: 100,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  perspective: 0,
  bgColor: null,
  textColor: null,
  borderColor: null,
  ringColor: null,
  borderRadius: { all: 0, t: 0, r: 0, b: 0, l: 0 },
  borderWidth: 0,
  shadow: 'none',
  blur: 0,
  backdropBlur: 0,
  hueRotate: 0,
  saturation: 100,
  brightness: 100,
  grayscale: 0,
  invert: 0,
  inlineCSS: '',
  elementId: ''
};

interface ElementContextType {
  selectedElement: ElementState | null;
  setSelectedElement: (element: ElementState | null) => void;
  updateElement: <K extends keyof ElementState>(key: K, value: ElementState[K]) => void;
  updateNestedElement: <K extends keyof ElementState>(key: K, nestedKey: string, value: string | number) => void;
  elements: Map<string, ElementState>;
  registerElement: (id: string, initialState: Partial<ElementState>) => void;
  selectElement: (id: string) => void;
  deselectElement: () => void;
}

const ElementContext = createContext<ElementContextType | undefined>(undefined);

export const ElementProvider = ({ children }: { children: ReactNode }) => {
  const [elements, setElements] = useState<Map<string, ElementState>>(new Map());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const selectedElement = selectedElementId ? elements.get(selectedElementId) || null : null;

  const registerElement = (id: string, initialState: Partial<ElementState>) => {
    setElements(prev => {
      const newMap = new Map(prev);
      if (!newMap.has(id)) {
        newMap.set(id, { ...defaultElementState, ...initialState, id });
      }
      return newMap;
    });
  };

  const selectElement = (id: string) => {
    setSelectedElementId(id);
  };

  const deselectElement = () => {
    setSelectedElementId(null);
  };

  const setSelectedElement = (element: ElementState | null) => {
    if (element) {
      setElements(prev => {
        const newMap = new Map(prev);
        newMap.set(element.id, element);
        return newMap;
      });
    }
  };

  const updateElement = <K extends keyof ElementState>(key: K, value: ElementState[K]) => {
    if (!selectedElementId) return;
    setElements(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(selectedElementId);
      if (current) {
        newMap.set(selectedElementId, { ...current, [key]: value });
      }
      return newMap;
    });
  };

  const updateNestedElement = <K extends keyof ElementState>(
    key: K,
    nestedKey: string,
    value: string | number
  ) => {
    if (!selectedElementId) return;
    setElements(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(selectedElementId);
      if (current) {
        newMap.set(selectedElementId, {
          ...current,
          [key]: { ...(current[key] as Record<string, unknown>), [nestedKey]: value }
        });
      }
      return newMap;
    });
  };

  return (
    <ElementContext.Provider value={{
      selectedElement,
      setSelectedElement,
      updateElement,
      updateNestedElement,
      elements,
      registerElement,
      selectElement,
      deselectElement
    }}>
      {children}
    </ElementContext.Provider>
  );
};

export const useElement = () => {
  const context = useContext(ElementContext);
  if (!context) {
    throw new Error('useElement must be used within an ElementProvider');
  }
  return context;
};
