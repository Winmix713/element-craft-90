// PropertyInspector Constants

import type { InspectorState, Breakpoint, BreakpointConfig } from './types';

export const CONFIG_VERSION = '1.0.0';

export const DEFAULT_STATE: InspectorState = {
  tag: 'div',
  elementId: '',
  link: '',
  textContent: '',
  tailwindClasses: '',
  inlineCss: '',
  appearance: {
    backgroundColor: '#1a1a2e'
  },
  typography: {
    textColor: '#ffffff',
    fontFamily: 'sans-serif',
    fontWeight: '400',
    fontSize: '16',
    lineHeight: '1.5',
    letterSpacing: '0',
    textAlign: 'left'
  },
  border: {
    color: '#3b82f6',
    ringColor: '#60a5fa',
    width: '0',
    style: 'solid',
    radius: {
      all: 8,
      tl: 8,
      tr: 8,
      br: 8,
      bl: 8
    }
  },
  effects: {
    shadow: 'none',
    opacity: 100,
    blur: 0,
    backdropBlur: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotate: 0,
    grayscale: 0
  },
  padding: {
    top: '16',
    right: '16',
    bottom: '16',
    left: '16'
  },
  margin: {
    x: '0',
    y: '0'
  },
  size: {
    width: 'auto',
    height: 'auto',
    maxWidth: '',
    maxHeight: '',
    minWidth: '',
    minHeight: ''
  },
  position: {
    type: 'relative',
    l: '',
    t: '',
    r: '',
    b: '',
    zIndex: ''
  },
  transforms: {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 100,
    skewX: 0,
    skewY: 0
  },
  transforms3D: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 0
  }
};

export const DEFAULT_OPEN_SECTIONS = ['typography', 'appearance'];

export const BREAKPOINTS: Record<Breakpoint, BreakpointConfig> = {
  base: { label: 'BASE', width: '0px' },
  sm: { label: 'SM', width: '640px' },
  md: { label: 'MD', width: '768px' },
  lg: { label: 'LG', width: '1024px' },
  xl: { label: 'XL', width: '1280px' },
  '2xl': { label: '2XL', width: '1536px' }
};

export const BREAKPOINT_LIST: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];

export const TAG_OPTIONS = [
  { value: 'div', label: 'div' },
  { value: 'section', label: 'section' },
  { value: 'article', label: 'article' },
  { value: 'header', label: 'header' },
  { value: 'footer', label: 'footer' },
  { value: 'main', label: 'main' },
  { value: 'aside', label: 'aside' },
  { value: 'nav', label: 'nav' },
  { value: 'span', label: 'span' },
  { value: 'p', label: 'p' },
  { value: 'h1', label: 'h1' },
  { value: 'h2', label: 'h2' },
  { value: 'h3', label: 'h3' },
  { value: 'button', label: 'button' },
  { value: 'a', label: 'a' }
];

export const FONT_FAMILY_OPTIONS = [
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'poppins', label: 'Poppins' }
];

export const FONT_WEIGHT_OPTIONS = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' }
];

export const SHADOW_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: '2xl', label: '2XL' }
];

export const BORDER_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
  { value: 'none', label: 'None' }
];

export const POSITION_OPTIONS = [
  { value: 'static', label: 'Static' },
  { value: 'relative', label: 'Relative' },
  { value: 'absolute', label: 'Absolute' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'sticky', label: 'Sticky' }
];

export const TEXT_ALIGN_OPTIONS = ['left', 'center', 'right', 'justify'] as const;

export const COLOR_PRESETS = [
  '#000000', '#ffffff', '#f43f5e', '#ec4899', '#d946ef',
  '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9',
  '#14b8a6', '#22c55e', '#84cc16', '#eab308', '#f97316',
  '#ef4444', '#1a1a2e', '#16213e', '#0f3460', '#e94560'
];
