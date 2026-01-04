// PropertyInspector Custom Hooks

import { useState, useMemo, useCallback } from 'react';
import type { InspectorState, Breakpoint } from './types';
import { DEFAULT_INSPECTOR_STATE } from './constants';

// Main state management hook
export const useInspectorState = (initialState?: Partial<InspectorState>) => {
  const [state, setState] = useState<InspectorState>({
    ...DEFAULT_INSPECTOR_STATE,
    ...initialState
  });

  const updateState = useCallback(<K extends keyof InspectorState>(
    key: K, 
    value: InspectorState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedState = useCallback(<K extends keyof InspectorState>(
    key: K,
    nestedKey: string,
    value: string | number | null
  ) => {
    setState(prev => {
      const currentValue = prev[key];
      if (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue)) {
        return {
          ...prev,
          [key]: { 
            ...currentValue, 
            [nestedKey]: value 
          }
        };
      }
      return prev;
    });
  }, []);

  const updateDeepNestedState = useCallback(<K extends keyof InspectorState>(
    key: K,
    nestedKey: string,
    deepKey: string,
    value: string | number
  ) => {
    setState(prev => {
      const nested = prev[key] as unknown;
      if (typeof nested === 'object' && nested !== null && !Array.isArray(nested)) {
        const nestedObj = nested as Record<string, unknown>;
        const deepNested = nestedObj[nestedKey];
        if (typeof deepNested === 'object' && deepNested !== null) {
          return {
            ...prev,
            [key]: {
              ...nestedObj,
              [nestedKey]: {
                ...(deepNested as Record<string, unknown>),
                [deepKey]: value
              }
            }
          };
        }
      }
      return prev;
    });
  }, []);

  const resetState = useCallback(() => {
    setState(DEFAULT_INSPECTOR_STATE);
  }, []);

  const resetTransforms = useCallback(() => {
    setState(prev => ({
      ...prev,
      transforms: DEFAULT_INSPECTOR_STATE.transforms,
      transforms3D: DEFAULT_INSPECTOR_STATE.transforms3D
    }));
  }, []);

  const resetEffects = useCallback(() => {
    setState(prev => ({
      ...prev,
      effects: DEFAULT_INSPECTOR_STATE.effects
    }));
  }, []);

  return {
    state,
    setState,
    updateState,
    updateNestedState,
    updateDeepNestedState,
    resetState,
    resetTransforms,
    resetEffects
  };
};

// Tailwind class generation hook
export const useGeneratedClasses = (state: InspectorState, breakpoint: Breakpoint = 'base') => {
  const prefix = breakpoint === 'base' ? '' : `${breakpoint}:`;
  
  return useMemo(() => {
    const classes: string[] = [];
    
    // Padding
    if (state.padding.l && state.padding.l !== '0') classes.push(`${prefix}pl-${state.padding.l}`);
    if (state.padding.t && state.padding.t !== '0') classes.push(`${prefix}pt-${state.padding.t}`);
    if (state.padding.r && state.padding.r !== '0') classes.push(`${prefix}pr-${state.padding.r}`);
    if (state.padding.b && state.padding.b !== '0') classes.push(`${prefix}pb-${state.padding.b}`);
    
    // Margin
    if (state.margin.x && state.margin.x !== '0') classes.push(`${prefix}mx-${state.margin.x}`);
    if (state.margin.y && state.margin.y !== '0') classes.push(`${prefix}my-${state.margin.y}`);
    
    // Position
    if (state.position.type !== 'static') classes.push(`${prefix}${state.position.type}`);
    if (state.position.zIndex) classes.push(`${prefix}z-${state.position.zIndex}`);
    if (state.position.l) classes.push(`${prefix}left-${state.position.l}`);
    if (state.position.t) classes.push(`${prefix}top-${state.position.t}`);
    if (state.position.r) classes.push(`${prefix}right-${state.position.r}`);
    if (state.position.b) classes.push(`${prefix}bottom-${state.position.b}`);
    
    // Size
    if (state.size.width) classes.push(`${prefix}w-[${state.size.width}]`);
    if (state.size.height) classes.push(`${prefix}h-[${state.size.height}]`);
    if (state.size.maxWidth) classes.push(`${prefix}max-w-[${state.size.maxWidth}]`);
    if (state.size.maxHeight) classes.push(`${prefix}max-h-[${state.size.maxHeight}]`);
    if (state.size.minWidth) classes.push(`${prefix}min-w-[${state.size.minWidth}]`);
    if (state.size.minHeight) classes.push(`${prefix}min-h-[${state.size.minHeight}]`);
    
    // Typography
    if (state.typography.fontFamily !== 'inter') classes.push(`${prefix}font-${state.typography.fontFamily}`);
    if (state.typography.fontWeight !== 'normal') classes.push(`${prefix}font-${state.typography.fontWeight}`);
    if (state.typography.fontSize) classes.push(`${prefix}text-${state.typography.fontSize}`);
    if (state.typography.letterSpacing !== 'normal') classes.push(`${prefix}tracking-${state.typography.letterSpacing}`);
    if (state.typography.lineHeight) classes.push(`${prefix}leading-${state.typography.lineHeight}`);
    if (state.typography.textAlign !== 'left') classes.push(`${prefix}text-${state.typography.textAlign}`);
    
    // Transforms
    if (state.transforms.rotate !== 0) classes.push(`${prefix}rotate-[${state.transforms.rotate}deg]`);
    if (state.transforms.scale !== 100) classes.push(`${prefix}scale-[${state.transforms.scale / 100}]`);
    if (state.transforms.translateX !== 0) classes.push(`${prefix}translate-x-[${state.transforms.translateX}px]`);
    if (state.transforms.translateY !== 0) classes.push(`${prefix}translate-y-[${state.transforms.translateY}px]`);
    if (state.transforms.skewX !== 0) classes.push(`${prefix}skew-x-[${state.transforms.skewX}deg]`);
    if (state.transforms.skewY !== 0) classes.push(`${prefix}skew-y-[${state.transforms.skewY}deg]`);
    
    // Effects
    if (state.effects.opacity !== 100) classes.push(`${prefix}opacity-${state.effects.opacity}`);
    if (state.effects.blur > 0) classes.push(`${prefix}blur-[${state.effects.blur}px]`);
    if (state.effects.backdropBlur > 0) classes.push(`${prefix}backdrop-blur-[${state.effects.backdropBlur}px]`);
    if (state.effects.hueRotate !== 0) classes.push(`${prefix}hue-rotate-[${state.effects.hueRotate}deg]`);
    if (state.effects.saturation !== 100) classes.push(`${prefix}saturate-[${state.effects.saturation / 100}]`);
    if (state.effects.brightness !== 100) classes.push(`${prefix}brightness-[${state.effects.brightness / 100}]`);
    if (state.effects.contrast !== 100) classes.push(`${prefix}contrast-[${state.effects.contrast / 100}]`);
    if (state.effects.grayscale > 0) classes.push(`${prefix}grayscale-[${state.effects.grayscale / 100}]`);
    if (state.effects.invert > 0) classes.push(`${prefix}invert-[${state.effects.invert / 100}]`);
    if (state.effects.sepia > 0) classes.push(`${prefix}sepia-[${state.effects.sepia / 100}]`);
    if (state.effects.shadow !== 'none') classes.push(`${prefix}shadow-${state.effects.shadow}`);
    
    // Border
    if (state.border.radius.all > 0) classes.push(`${prefix}rounded-[${state.border.radius.all}px]`);
    if (state.border.width && state.border.width !== '0') classes.push(`${prefix}border-${state.border.width}`);
    if (state.border.style !== 'solid' && state.border.style !== 'none') classes.push(`${prefix}border-${state.border.style}`);
    
    // Custom Tailwind classes
    classes.push(...state.tailwindClasses);
    
    return classes.filter(Boolean).join(' ');
  }, [state, prefix]);
};

// Inline style generation hook
export const useGeneratedStyles = (state: InspectorState) => {
  return useMemo(() => {
    const styles: Record<string, string> = {};
    
    // Colors (inline styles for custom colors)
    if (state.typography.textColor) styles.color = state.typography.textColor;
    if (state.appearance.backgroundColor) styles.backgroundColor = state.appearance.backgroundColor;
    if (state.border.color) styles.borderColor = state.border.color;
    
    // 3D Transforms
    const transforms3D: string[] = [];
    if (state.transforms3D.rotateX !== 0) transforms3D.push(`rotateX(${state.transforms3D.rotateX}deg)`);
    if (state.transforms3D.rotateY !== 0) transforms3D.push(`rotateY(${state.transforms3D.rotateY}deg)`);
    if (state.transforms3D.rotateZ !== 0) transforms3D.push(`rotateZ(${state.transforms3D.rotateZ}deg)`);
    if (transforms3D.length > 0) styles.transform = transforms3D.join(' ');
    if (state.transforms3D.perspective > 0) styles.perspective = `${state.transforms3D.perspective * 100}px`;
    
    // Blend mode
    if (state.appearance.blendMode !== 'normal') styles.mixBlendMode = state.appearance.blendMode;
    
    // Background image
    if (state.appearance.backgroundImage) styles.backgroundImage = `url(${state.appearance.backgroundImage})`;
    
    // Inline CSS parsing
    if (state.inlineCSS) {
      const cssLines = state.inlineCSS.split(';').filter(Boolean);
      cssLines.forEach(line => {
        const [prop, val] = line.split(':').map(s => s.trim());
        if (prop && val) {
          // Convert CSS prop to camelCase
          const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
          styles[camelProp] = val;
        }
      });
    }
    
    return styles;
  }, [state]);
};

// HTML code generation hook
export const useGeneratedCode = (
  state: InspectorState, 
  generatedClasses: string,
  generatedStyles: Record<string, string>
) => {
  return useMemo(() => {
    const idAttr = state.elementId ? ` id="${state.elementId}"` : '';
    const classAttr = generatedClasses ? ` class="${generatedClasses}"` : '';
    
    const styleStr = Object.entries(generatedStyles)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
      .join('; ');
    const styleAttr = styleStr ? ` style="${styleStr}"` : '';
    
    const hrefAttr = state.link && (state.tag === 'a' || state.tag === 'button') ? ` href="${state.link}"` : '';
    
    const html = `<${state.tag}${idAttr}${classAttr}${styleAttr}${hrefAttr}>\n  ${state.textContent}\n</${state.tag}>`;
    
    return html;
  }, [state, generatedClasses, generatedStyles]);
};

// CSS export hook
export const useExportCSS = (state: InspectorState) => {
  return useMemo(() => {
    const lines: string[] = [];
    const selector = state.elementId ? `#${state.elementId}` : '.element';
    
    lines.push(`${selector} {`);
    
    // Position
    if (state.position.type !== 'static') lines.push(`  position: ${state.position.type};`);
    if (state.position.l) lines.push(`  left: ${state.position.l};`);
    if (state.position.t) lines.push(`  top: ${state.position.t};`);
    if (state.position.r) lines.push(`  right: ${state.position.r};`);
    if (state.position.b) lines.push(`  bottom: ${state.position.b};`);
    if (state.position.zIndex) lines.push(`  z-index: ${state.position.zIndex};`);
    
    // Size
    if (state.size.width) lines.push(`  width: ${state.size.width};`);
    if (state.size.height) lines.push(`  height: ${state.size.height};`);
    
    // Padding
    const padding = `${state.padding.t || 0} ${state.padding.r || 0} ${state.padding.b || 0} ${state.padding.l || 0}`;
    if (padding !== '0 0 0 0') lines.push(`  padding: ${padding.replace(/(\d+)/g, '$1px')};`);
    
    // Margin
    if (state.margin.x !== '0' || state.margin.y !== '0') {
      lines.push(`  margin: ${state.margin.y || 0}px ${state.margin.x || 0}px;`);
    }
    
    // Typography
    if (state.typography.fontSize) lines.push(`  font-size: ${state.typography.fontSize};`);
    if (state.typography.fontWeight !== 'normal') lines.push(`  font-weight: ${state.typography.fontWeight};`);
    if (state.typography.textColor) lines.push(`  color: ${state.typography.textColor};`);
    if (state.typography.textAlign !== 'left') lines.push(`  text-align: ${state.typography.textAlign};`);
    
    // Background
    if (state.appearance.backgroundColor) lines.push(`  background-color: ${state.appearance.backgroundColor};`);
    
    // Border
    if (state.border.radius.all > 0) lines.push(`  border-radius: ${state.border.radius.all}px;`);
    if (state.border.color && state.border.width !== '0') {
      lines.push(`  border: ${state.border.width}px ${state.border.style} ${state.border.color};`);
    }
    
    // Transforms
    const transforms: string[] = [];
    if (state.transforms.translateX !== 0) transforms.push(`translateX(${state.transforms.translateX}px)`);
    if (state.transforms.translateY !== 0) transforms.push(`translateY(${state.transforms.translateY}px)`);
    if (state.transforms.rotate !== 0) transforms.push(`rotate(${state.transforms.rotate}deg)`);
    if (state.transforms.scale !== 100) transforms.push(`scale(${state.transforms.scale / 100})`);
    if (state.transforms.skewX !== 0) transforms.push(`skewX(${state.transforms.skewX}deg)`);
    if (state.transforms.skewY !== 0) transforms.push(`skewY(${state.transforms.skewY}deg)`);
    if (state.transforms3D.rotateX !== 0) transforms.push(`rotateX(${state.transforms3D.rotateX}deg)`);
    if (state.transforms3D.rotateY !== 0) transforms.push(`rotateY(${state.transforms3D.rotateY}deg)`);
    if (state.transforms3D.rotateZ !== 0) transforms.push(`rotateZ(${state.transforms3D.rotateZ}deg)`);
    if (transforms.length > 0) lines.push(`  transform: ${transforms.join(' ')};`);
    if (state.transforms3D.perspective > 0) lines.push(`  perspective: ${state.transforms3D.perspective * 100}px;`);
    
    // Effects
    const filters: string[] = [];
    if (state.effects.blur > 0) filters.push(`blur(${state.effects.blur}px)`);
    if (state.effects.brightness !== 100) filters.push(`brightness(${state.effects.brightness / 100})`);
    if (state.effects.saturation !== 100) filters.push(`saturate(${state.effects.saturation / 100})`);
    if (state.effects.contrast !== 100) filters.push(`contrast(${state.effects.contrast / 100})`);
    if (state.effects.hueRotate !== 0) filters.push(`hue-rotate(${state.effects.hueRotate}deg)`);
    if (state.effects.grayscale > 0) filters.push(`grayscale(${state.effects.grayscale / 100})`);
    if (state.effects.invert > 0) filters.push(`invert(${state.effects.invert / 100})`);
    if (state.effects.sepia > 0) filters.push(`sepia(${state.effects.sepia / 100})`);
    if (filters.length > 0) lines.push(`  filter: ${filters.join(' ')};`);
    
    if (state.effects.backdropBlur > 0) lines.push(`  backdrop-filter: blur(${state.effects.backdropBlur}px);`);
    if (state.effects.opacity !== 100) lines.push(`  opacity: ${state.effects.opacity / 100};`);
    if (state.effects.shadow !== 'none') lines.push(`  /* shadow-${state.effects.shadow} */`);
    
    lines.push('}');
    
    return lines.join('\n');
  }, [state]);
};

// Breakpoint state management
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('base');
  return { breakpoint, setBreakpoint };
};
