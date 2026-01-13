import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface InspectorState {
  elementId: string;
  elementTag: string;
  textContent: string;
  link: string;
  tailwindClasses: string;
  margin: { left: string; top: string; right: string; bottom: string };
  padding: { left: string; top: string; right: string; bottom: string };
  size: { width: string; height: string; maxWidth: string; maxHeight: string };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    letterSpacing: string;
    lineHeight: string;
    textAlign: string;
  };
  background: { color: string; image: string };
  border: { color: string; width: string; radius: string };
  transforms: {
    translateX: number;
    translateY: number;
    rotate: number;
    scale: number;
    skewX: number;
    skewY: number;
  };
  transforms3d: {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    perspective: number;
  };
  opacity: number;
  breakpoint: 'auto' | 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

interface InspectorContextType {
  state: InspectorState;
  updateState: <K extends keyof InspectorState>(key: K, value: InspectorState[K]) => void;
  updateNestedState: <K extends keyof InspectorState>(
    key: K,
    nestedKey: keyof InspectorState[K],
    value: any
  ) => void;
  generatedCode: string;
  generatedTailwind: string;
  resetState: () => void;
  history: InspectorState[];
  undo: () => void;
  canUndo: boolean;
}

const defaultState: InspectorState = {
  elementId: 'aura-emgn5hp8g9knbc3d',
  elementTag: 'h2',
  textContent: 'Layers',
  link: '',
  tailwindClasses: 'px-2 pb-3 text-[18px] md:text-[20px] font-semibold tracking-tight',
  margin: { left: '', top: '', right: '', bottom: '' },
  padding: { left: '2', top: '', right: '2', bottom: '3' },
  size: { width: '', height: '', maxWidth: '', maxHeight: '' },
  typography: {
    fontFamily: 'inter',
    fontSize: '18',
    fontWeight: 'semibold',
    letterSpacing: 'tight',
    lineHeight: 'normal',
    textAlign: 'left',
  },
  background: { color: '', image: '' },
  border: { color: '', width: '', radius: '' },
  transforms: {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 100,
    skewX: 0,
    skewY: 0,
  },
  transforms3d: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 0,
  },
  opacity: 100,
  breakpoint: 'auto',
};

const InspectorContext = createContext<InspectorContextType | null>(null);

export const useInspector = () => {
  const context = useContext(InspectorContext);
  if (!context) {
    throw new Error('useInspector must be used within InspectorProvider');
  }
  return context;
};

const generateTailwindClasses = (state: InspectorState): string => {
  const classes: string[] = [];
  const bp = state.breakpoint === 'auto' || state.breakpoint === 'base' ? '' : `${state.breakpoint}:`;

  // Padding
  if (state.padding.left) classes.push(`${bp}pl-${state.padding.left}`);
  if (state.padding.top) classes.push(`${bp}pt-${state.padding.top}`);
  if (state.padding.right) classes.push(`${bp}pr-${state.padding.right}`);
  if (state.padding.bottom) classes.push(`${bp}pb-${state.padding.bottom}`);

  // Margin
  if (state.margin.left) classes.push(`${bp}ml-${state.margin.left}`);
  if (state.margin.top) classes.push(`${bp}mt-${state.margin.top}`);
  if (state.margin.right) classes.push(`${bp}mr-${state.margin.right}`);
  if (state.margin.bottom) classes.push(`${bp}mb-${state.margin.bottom}`);

  // Size
  if (state.size.width) classes.push(`${bp}w-[${state.size.width}px]`);
  if (state.size.height) classes.push(`${bp}h-[${state.size.height}px]`);

  // Typography
  if (state.typography.fontSize) classes.push(`${bp}text-[${state.typography.fontSize}px]`);
  if (state.typography.fontWeight) classes.push(`${bp}font-${state.typography.fontWeight}`);
  if (state.typography.letterSpacing) classes.push(`${bp}tracking-${state.typography.letterSpacing}`);

  // Transforms
  if (state.transforms.translateX !== 0) classes.push(`${bp}translate-x-[${state.transforms.translateX}px]`);
  if (state.transforms.translateY !== 0) classes.push(`${bp}translate-y-[${state.transforms.translateY}px]`);
  if (state.transforms.rotate !== 0) classes.push(`${bp}rotate-[${state.transforms.rotate}deg]`);
  if (state.transforms.scale !== 100) classes.push(`${bp}scale-[${state.transforms.scale / 100}]`);
  if (state.transforms.skewX !== 0) classes.push(`${bp}skew-x-[${state.transforms.skewX}deg]`);
  if (state.transforms.skewY !== 0) classes.push(`${bp}skew-y-[${state.transforms.skewY}deg]`);

  // 3D Transforms
  if (state.transforms3d.rotateX !== 0) classes.push(`${bp}[transform:rotateX(${state.transforms3d.rotateX}deg)]`);
  if (state.transforms3d.rotateY !== 0) classes.push(`${bp}[transform:rotateY(${state.transforms3d.rotateY}deg)]`);
  if (state.transforms3d.rotateZ !== 0) classes.push(`${bp}[transform:rotateZ(${state.transforms3d.rotateZ}deg)]`);
  if (state.transforms3d.perspective !== 0) classes.push(`${bp}[perspective:${state.transforms3d.perspective * 100}px]`);

  // Opacity
  if (state.opacity !== 100) classes.push(`${bp}opacity-[${state.opacity / 100}]`);

  // Background
  if (state.background.color) classes.push(`${bp}bg-[${state.background.color}]`);

  // Border
  if (state.border.color) classes.push(`${bp}border-[${state.border.color}]`);
  if (state.border.width) classes.push(`${bp}border-[${state.border.width}px]`);
  if (state.border.radius) classes.push(`${bp}rounded-[${state.border.radius}px]`);

  return classes.join(' ');
};

const generateHTMLCode = (state: InspectorState, tailwind: string): string => {
  const tag = state.elementTag;
  const content = state.textContent;
  const link = state.link;

  if (link) {
    return `<a href="${link}">\n  <${tag} class="${tailwind}">${content}</${tag}>\n</a>`;
  }
  return `<${tag} class="${tailwind}">${content}</${tag}>`;
};

export const InspectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<InspectorState>(() => {
    const saved = localStorage.getItem('inspector-state');
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  });
  
  const [history, setHistory] = useState<InspectorState[]>([]);

  // Save state to localStorage with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('inspector-state', JSON.stringify(state));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [state]);

  const updateState = useCallback(<K extends keyof InspectorState>(key: K, value: InspectorState[K]) => {
    setState(prev => {
      setHistory(h => [...h.slice(-19), prev]); // Keep last 20 states
      return { ...prev, [key]: value };
    });
  }, []);

  const updateNestedState = useCallback(<K extends keyof InspectorState>(
    key: K,
    nestedKey: keyof InspectorState[K],
    value: any
  ) => {
    setState(prev => {
      setHistory(h => [...h.slice(-19), prev]);
      return {
        ...prev,
        [key]: {
          ...(prev[key] as object),
          [nestedKey]: value,
        },
      };
    });
  }, []);

  const resetState = useCallback(() => {
    setHistory(h => [...h.slice(-19), state]);
    setState(defaultState);
    localStorage.removeItem('inspector-state');
  }, [state]);

  const undo = useCallback(() => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setState(previousState);
    }
  }, [history]);

  const generatedTailwind = generateTailwindClasses(state);
  const generatedCode = generateHTMLCode(state, state.tailwindClasses || generatedTailwind);

  return (
    <InspectorContext.Provider
      value={{
        state,
        updateState,
        updateNestedState,
        generatedCode,
        generatedTailwind,
        resetState,
        history,
        undo,
        canUndo: history.length > 0,
      }}
    >
      {children}
    </InspectorContext.Provider>
  );
};
