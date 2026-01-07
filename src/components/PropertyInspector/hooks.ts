// PropertyInspector Hooks - Centralized state management

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { InspectorState, Breakpoint, ExportConfig } from './types';
import { DEFAULT_STATE, CONFIG_VERSION } from './constants';

// Main state management hook
export function useInspectorState(initialState?: Partial<InspectorState>) {
  const [state, setState] = useState<InspectorState>({
    ...DEFAULT_STATE,
    ...initialState
  });

  const updateState = useCallback(<K extends keyof InspectorState>(
    key: K,
    value: InspectorState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedState = useCallback(<K extends keyof InspectorState>(
    parentKey: K,
    nestedKey: string,
    value: unknown
  ) => {
    setState(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as object),
        [nestedKey]: value
      }
    }));
  }, []);

  const updateDeepNestedState = useCallback(<K extends keyof InspectorState>(
    parentKey: K,
    nestedKey: string,
    deepKey: string,
    value: unknown
  ) => {
    setState(prev => {
      const parent = prev[parentKey];
      if (typeof parent !== 'object' || parent === null) return prev;
      const parentObj = parent as unknown as Record<string, unknown>;
      const nested = parentObj[nestedKey];
      if (typeof nested !== 'object' || nested === null) return prev;
      const nestedObj = nested as Record<string, unknown>;
      return {
        ...prev,
        [parentKey]: {
          ...parentObj,
          [nestedKey]: {
            ...nestedObj,
            [deepKey]: value
          }
        }
      };
    });
  }, []);

  const resetState = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    state,
    setState,
    updateState,
    updateNestedState,
    updateDeepNestedState,
    resetState
  };
}

// Generated Tailwind classes hook
export function useGeneratedClasses(
  state: InspectorState,
  breakpoint: Breakpoint
): string {
  return useMemo(() => {
    const prefix = breakpoint === 'base' ? '' : `${breakpoint}:`;
    const classes: string[] = [];

    // Typography
    if (state.typography.fontFamily !== 'sans-serif') {
      classes.push(`${prefix}font-${state.typography.fontFamily}`);
    }
    classes.push(`${prefix}text-[${state.typography.fontSize}px]`);
    classes.push(`${prefix}font-[${state.typography.fontWeight}]`);
    classes.push(`${prefix}leading-[${state.typography.lineHeight}]`);
    classes.push(`${prefix}text-${state.typography.textAlign}`);

    // Spacing
    classes.push(`${prefix}pt-[${state.padding.top}px]`);
    classes.push(`${prefix}pr-[${state.padding.right}px]`);
    classes.push(`${prefix}pb-[${state.padding.bottom}px]`);
    classes.push(`${prefix}pl-[${state.padding.left}px]`);

    // Border
    if (state.border.radius.all > 0) {
      classes.push(`${prefix}rounded-[${state.border.radius.all}px]`);
    }
    if (state.border.width !== '0') {
      classes.push(`${prefix}border-[${state.border.width}px]`);
      classes.push(`${prefix}border-${state.border.style}`);
    }

    // Effects
    if (state.effects.opacity !== 100) {
      classes.push(`${prefix}opacity-${state.effects.opacity}`);
    }
    if (state.effects.blur > 0) {
      classes.push(`${prefix}blur-[${state.effects.blur}px]`);
    }
    if (state.effects.shadow !== 'none') {
      classes.push(`${prefix}shadow-${state.effects.shadow}`);
    }

    // Size
    if (state.size.width !== 'auto') {
      classes.push(`${prefix}w-[${state.size.width}]`);
    }
    if (state.size.height !== 'auto') {
      classes.push(`${prefix}h-[${state.size.height}]`);
    }

    // Position
    if (state.position.type !== 'static') {
      classes.push(`${prefix}${state.position.type}`);
    }

    return classes.join(' ');
  }, [state, breakpoint]);
}

// Generated inline styles hook
export function useGeneratedStyles(state: InspectorState): React.CSSProperties {
  return useMemo(() => {
    const styles: React.CSSProperties = {
      backgroundColor: state.appearance.backgroundColor,
      color: state.typography.textColor
    };

    if (state.border.width !== '0') {
      styles.borderColor = state.border.color;
    }

    // Transforms
    const transforms: string[] = [];
    if (state.transforms.translateX !== 0) {
      transforms.push(`translateX(${state.transforms.translateX}px)`);
    }
    if (state.transforms.translateY !== 0) {
      transforms.push(`translateY(${state.transforms.translateY}px)`);
    }
    if (state.transforms.rotate !== 0) {
      transforms.push(`rotate(${state.transforms.rotate}deg)`);
    }
    if (state.transforms.scale !== 100) {
      transforms.push(`scale(${state.transforms.scale / 100})`);
    }
    if (state.transforms.skewX !== 0) {
      transforms.push(`skewX(${state.transforms.skewX}deg)`);
    }
    if (state.transforms.skewY !== 0) {
      transforms.push(`skewY(${state.transforms.skewY}deg)`);
    }

    // 3D Transforms
    if (state.transforms3D.rotateX !== 0) {
      transforms.push(`rotateX(${state.transforms3D.rotateX}deg)`);
    }
    if (state.transforms3D.rotateY !== 0) {
      transforms.push(`rotateY(${state.transforms3D.rotateY}deg)`);
    }
    if (state.transforms3D.rotateZ !== 0) {
      transforms.push(`rotateZ(${state.transforms3D.rotateZ}deg)`);
    }
    if (state.transforms3D.perspective > 0) {
      styles.perspective = `${state.transforms3D.perspective}px`;
    }

    if (transforms.length > 0) {
      styles.transform = transforms.join(' ');
    }

    // Filters
    const filters: string[] = [];
    if (state.effects.brightness !== 100) {
      filters.push(`brightness(${state.effects.brightness}%)`);
    }
    if (state.effects.contrast !== 100) {
      filters.push(`contrast(${state.effects.contrast}%)`);
    }
    if (state.effects.saturation !== 100) {
      filters.push(`saturate(${state.effects.saturation}%)`);
    }
    if (state.effects.hueRotate !== 0) {
      filters.push(`hue-rotate(${state.effects.hueRotate}deg)`);
    }
    if (state.effects.grayscale > 0) {
      filters.push(`grayscale(${state.effects.grayscale}%)`);
    }
    if (filters.length > 0) {
      styles.filter = filters.join(' ');
    }

    if (state.effects.backdropBlur > 0) {
      styles.backdropFilter = `blur(${state.effects.backdropBlur}px)`;
    }

    return styles;
  }, [state]);
}

// Generated code hook
export function useGeneratedCode(
  state: InspectorState,
  breakpoint: Breakpoint
): string {
  const classes = useGeneratedClasses(state, breakpoint);
  const styles = useGeneratedStyles(state);

  return useMemo(() => {
    const styleString = Object.entries(styles)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}: "${v}"`)
      .join(', ');

    return `<${state.tag}
  className="${classes}"
  style={{ ${styleString} }}
>
  ${state.textContent || 'Content here'}
</${state.tag}>`;
  }, [state.tag, state.textContent, classes, styles]);
}

// LocalStorage persistence hook
export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue];
}

// Panel position hook
export function usePanelPosition() {
  const [position, setPosition] = useLocalStorageState('propertyInspectorPosition', {
    x: 0,
    y: 0
  });

  const updatePosition = useCallback((newPosition: { x: number; y: number }) => {
    setPosition(newPosition);
  }, [setPosition]);

  return { position, updatePosition };
}

// Export configuration hook
export function useExportConfig(state: InspectorState, breakpoint: Breakpoint) {
  const createExportConfig = useCallback((): ExportConfig => ({
    state,
    version: CONFIG_VERSION,
    timestamp: new Date().toISOString(),
    breakpoint
  }), [state, breakpoint]);

  const validateImportConfig = useCallback((config: unknown): config is ExportConfig => {
    if (!config || typeof config !== 'object') return false;
    const c = config as Record<string, unknown>;
    return (
      typeof c.version === 'string' &&
      typeof c.timestamp === 'string' &&
      typeof c.state === 'object' &&
      c.state !== null
    );
  }, []);

  return { createExportConfig, validateImportConfig };
}

// Debounced state persistence
export function useStatePersistence(state: InspectorState, key: string = 'inspectorState') {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to persist state:', error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, key]);
}

// Plugin architecture placeholder
export function usePluginSystem() {
  const registerPlugin = useCallback((plugin: { name: string; init: () => void }) => {
    console.log('Plugin registered:', plugin.name);
    // Future: plugin.init();
  }, []);

  return { registerPlugin, plugins: [] as string[] };
}
