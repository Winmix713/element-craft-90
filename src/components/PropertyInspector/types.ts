// PropertyInspector Types - TypeScript strict mode compatible

export type TabMode = 'EDIT' | 'PROMPT' | 'CODE';
export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type EditCategory = 'appearance' | 'layout' | 'typography' | 'advanced';

// Nested state interfaces
export interface PaddingState {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export interface MarginState {
  x: string;
  y: string;
}

export interface SizeState {
  width: string;
  height: string;
  maxWidth: string;
  maxHeight: string;
  minWidth: string;
  minHeight: string;
}

export interface PositionState {
  type: string;
  l: string;
  t: string;
  r: string;
  b: string;
  zIndex: string;
}

export interface AppearanceState {
  backgroundColor: string;
}

export interface TypographyState {
  textColor: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
}

export interface BorderState {
  color: string;
  ringColor: string;
  width: string;
  style: string;
  radius: {
    all: number;
    tl: number;
    tr: number;
    br: number;
    bl: number;
  };
}

export interface EffectsState {
  shadow: string;
  opacity: number;
  blur: number;
  backdropBlur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hueRotate: number;
  grayscale: number;
}

export interface TransformsState {
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  skewX: number;
  skewY: number;
}

export interface Transforms3DState {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  perspective: number;
}

// Main inspector state interface
export interface InspectorState {
  tag: string;
  elementId: string;
  link: string;
  textContent: string;
  tailwindClasses: string;
  inlineCss: string;
  appearance: AppearanceState;
  typography: TypographyState;
  border: BorderState;
  effects: EffectsState;
  padding: PaddingState;
  margin: MarginState;
  size: SizeState;
  position: PositionState;
  transforms: TransformsState;
  transforms3D: Transforms3DState;
}

// Generic update types for type-safe state updates
export type StateUpdater<K extends keyof InspectorState> = (
  key: K,
  value: InspectorState[K]
) => void;

export type NestedStateUpdater = <K extends keyof InspectorState>(
  parentKey: K,
  nestedKey: keyof InspectorState[K],
  value: InspectorState[K][keyof InspectorState[K]]
) => void;

// Export/Import config interface
export interface ExportConfig {
  state: InspectorState;
  version: string;
  timestamp: string;
  breakpoint: Breakpoint;
}

// Props interfaces for components
export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export interface SliderRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface BreakpointSelectorProps {
  current: Breakpoint;
  onChange: (breakpoint: Breakpoint) => void;
}

export interface SectionProps {
  state: InspectorState;
  updateNestedState: <K extends keyof InspectorState>(
    parentKey: K,
    nestedKey: string,
    value: unknown
  ) => void;
  updateState: <K extends keyof InspectorState>(key: K, value: InspectorState[K]) => void;
}

export interface ToolbarProps {
  tag: string;
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
  onReset: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
}

// Breakpoint config
export interface BreakpointConfig {
  label: string;
  width: string;
  icon?: string;
}
