import React, { createContext, useContext, useReducer, useCallback, ReactNode, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Feltételezve, hogy van uuid, ha nincs, használj egy egyszerű random generátort.

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
  type: string; // 'div', 'button', etc.
  name: string; // Layer name
  content?: string;
  style: ElementStyle;
  childrenIds: string[]; // For nested structures
  parentId: string | null;
}

interface EditorHistory {
  past: Map<string, ElementState>[];
  present: Map<string, ElementState>;
  future: Map<string, ElementState>[];
}

interface ElementContextType {
  elements: Map<string, ElementState>;
  selectedIds: string[];
  selection: ElementState | null; // Primary selection
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions
  selectElement: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  updateElement: (id: string, updates: DeepPartial<ElementState>) => void;
  addElement: (type: string, parentId?: string) => void;
  removeElement: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

// Utility type for deep updates
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// --- Defaults ---

const defaultStyle: ElementStyle = {
  padding: { l: 16, t: 16, r: 16, b: 16 },
  margin: { x: 0, y: 0 },
  typography: { font: 'Inter', weight: '400', size: 16, lineHeight: 1.5, letterSpacing: 0, align: 'left' },
  background: { color: null, opacity: 100, blur: 0 },
  border: { color: null, width: 0, radius: 0, style: 'none' },
  layout: { width: 'auto', height: 'auto', display: 'flex', flexDirection: 'column', gap: 8 },
  transform: { rotate: 0, scale: 100, x: 0, y: 0 },
  shadow: 'none'
};

const defaultElement: ElementState = {
  id: '',
  type: 'div',
  name: 'Container',
  style: defaultStyle,
  childrenIds: [],
  parentId: null
};

// --- Reducer ---

type Action = 
  | { type: 'SELECT'; id: string; multi: boolean }
  | { type: 'DESELECT' }
  | { type: 'UPDATE'; id: string; updates: DeepPartial<ElementState> }
  | { type: 'ADD'; element: ElementState }
  | { type: 'REMOVE'; id: string }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const MAX_HISTORY = 50;

const deepMerge = (target: any, source: any): any => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

const isObject = (item: any) => (item && typeof item === 'object' && !Array.isArray(item));

const elementReducer = (state: { history: EditorHistory; selectedIds: string[] }, action: Action) => {
  const { history, selectedIds } = state;
  const { past, present, future } = history;

  switch (action.type) {
    case 'SELECT':
      return {
        ...state,
        selectedIds: action.multi 
          ? (selectedIds.includes(action.id) ? selectedIds.filter(id => id !== action.id) : [...selectedIds, action.id])
          : [action.id]
      };
    
    case 'DESELECT':
      return { ...state, selectedIds: [] };

    case 'UPDATE': {
      const newPresent = new Map(present);
      const currentEl = newPresent.get(action.id);
      if (!currentEl) return state;

      const updatedEl = deepMerge(currentEl, action.updates);
      newPresent.set(action.id, updatedEl);

      return {
        selectedIds,
        history: {
          past: [...past, present].slice(-MAX_HISTORY),
          present: newPresent,
          future: []
        }
      };
    }

    case 'ADD': {
      const newPresent = new Map(present);
      newPresent.set(action.element.id, action.element);
      return {
        selectedIds: [action.element.id],
        history: {
          past: [...past, present].slice(-MAX_HISTORY),
          present: newPresent,
          future: []
        }
      };
    }

    case 'UNDO': {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        ...state,
        history: {
          past: newPast,
          present: previous,
          future: [present, ...future]
        }
      };
    }

    case 'REDO': {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        ...state,
        history: {
          past: [...past, present],
          present: next,
          future: newFuture
        }
      };
    }

    default:
      return state;
  }
};

// --- Context ---

const ElementContext = createContext<ElementContextType | undefined>(undefined);

export const ElementProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(elementReducer, {
    selectedIds: [],
    history: {
      past: [],
      present: new Map(),
      future: []
    }
  });

  const { present } = state.history;

  const actions = useMemo(() => ({
    selectElement: (id: string, multi = false) => dispatch({ type: 'SELECT', id, multi }),
    deselectAll: () => dispatch({ type: 'DESELECT' }),
    updateElement: (id: string, updates: DeepPartial<ElementState>) => dispatch({ type: 'UPDATE', id, updates }),
    addElement: (type: string, parentId?: string) => {
      const id = uuidv4 ? uuidv4() : Math.random().toString(36).substr(2, 9);
      const newElement: ElementState = {
        ...defaultElement,
        id,
        type,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${present.size + 1}`,
        parentId: parentId || null
      };
      dispatch({ type: 'ADD', element: newElement });
    },
    removeElement: (id: string) => dispatch({ type: 'REMOVE', id }),
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' })
  }), [present.size]);

  const selection = state.selectedIds.length === 1 ? present.get(state.selectedIds[0]) || null : null;

  return (
    <ElementContext.Provider value={{
      elements: present,
      selectedIds: state.selectedIds,
      selection,
      canUndo: state.history.past.length > 0,
      canRedo: state.history.future.length > 0,
      ...actions
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
