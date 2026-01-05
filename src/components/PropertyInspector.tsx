// src/components/PropertyInspector.tsx
// Property Inspector - Self-contained version with all sections inline

import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  RotateCcw, Save, MoreHorizontal, X, 
  Laptop, Download, Upload, Layers, Settings,
  Type, Palette, Layout, Code2, Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import Draggable from 'react-draggable';
import Editor from '@monaco-editor/react';

// ============================================================================
// TYPES
// ============================================================================

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';
type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface InspectorState {
  tag: string;
  elementId: string;
  link: string;
  textContent: string;
  
  appearance: {
    backgroundColor: string;
  };
  
  typography: {
    textColor: string;
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
  };
  
  border: {
    color: string;
    width: string;
    style: string;
    radius: number;
  };
  
  effects: {
    opacity: number;
    blur: number;
    brightness: number;
    contrast: number;
    saturation: number;
  };
  
  padding: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  
  margin: {
    x: string;
    y: string;
  };
  
  size: {
    width: string;
    height: string;
  };
  
  transforms: {
    translateX: number;
    translateY: number;
    rotate: number;
    scale: number;
  };
  
  transforms3D: {
    rotateX: number;
    rotateY: number;
    perspective: number;
  };
}

// ============================================================================
// DEFAULT STATE
// ============================================================================

const DEFAULT_STATE: InspectorState = {
  tag: 'div',
  elementId: '',
  link: '',
  textContent: '',
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
    width: '0',
    style: 'solid',
    radius: 8
  },
  effects: {
    opacity: 100,
    blur: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100
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
    height: 'auto'
  },
  transforms: {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 100
  },
  transforms3D: {
    rotateX: 0,
    rotateY: 0,
    perspective: 0
  }
};

// ============================================================================
// COLOR PICKER COMPONENT
// ============================================================================

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker = memo<ColorPickerProps>(({ color, onChange, label }) => (
  <div className="space-y-1">
    <Label className="text-[10px] text-muted-foreground">{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full h-8 rounded-md border border-border flex items-center gap-2 px-2 hover:bg-secondary/50 transition-colors"
        >
          <div 
            className="w-5 h-5 rounded border border-border/50"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-mono text-muted-foreground">{color}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <HexColorPicker color={color} onChange={onChange} />
        <Input
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 h-7 text-xs font-mono"
        />
      </PopoverContent>
    </Popover>
  </div>
));

ColorPicker.displayName = 'ColorPicker';

// ============================================================================
// SLIDER ROW COMPONENT
// ============================================================================

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const SliderRow = memo<SliderRowProps>(({ 
  label, value, onChange, min = 0, max = 100, step = 1, unit = '' 
}) => (
  <div className="space-y-1">
    <div className="flex justify-between">
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <span className="text-[10px] text-muted-foreground font-mono">{value}{unit}</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={([v]) => onChange(v)}
      min={min}
      max={max}
      step={step}
      className="w-full"
    />
  </div>
));

SliderRow.displayName = 'SliderRow';

// ============================================================================
// BREAKPOINT SELECTOR
// ============================================================================

interface BreakpointSelectorProps {
  current: Breakpoint;
  onChange: (breakpoint: Breakpoint) => void;
}

const BreakpointSelector = memo<BreakpointSelectorProps>(({ current, onChange }) => {
  const breakpoints: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex border border-border rounded-md overflow-hidden h-6">
        {breakpoints.map(bp => (
          <button
            key={bp}
            onClick={() => onChange(bp)}
            className={`px-2 text-[9px] transition-colors ${
              current === bp
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-secondary'
            } ${bp !== 'base' ? 'border-l border-border' : ''}`}
          >
            {bp.toUpperCase()}
          </button>
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
        <Laptop className="w-3 h-3" />
      </span>
    </div>
  );
});

BreakpointSelector.displayName = 'BreakpointSelector';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PropertyInspector = memo(() => {
  const [state, setState] = useState<InspectorState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('base');
  const [promptText, setPromptText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['typography', 'appearance']);
  
  const { toast } = useToast();

  // Load saved position from localStorage
  const savedPosition = useMemo(() => {
    try {
      const saved = localStorage.getItem('propertyInspectorPosition');
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    } catch {
      return { x: 0, y: 0 };
    }
  }, []);

  const handleDragStop = useCallback((_e: any, data: { x: number; y: number }) => {
    localStorage.setItem('propertyInspectorPosition', JSON.stringify({ x: data.x, y: data.y }));
  }, []);

  // State update handlers
  const updateState = useCallback(<K extends keyof InspectorState>(
    key: K,
    value: InspectorState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedState = useCallback(<
    K extends keyof InspectorState
  >(
    parentKey: K,
    nestedKey: string,
    value: any
  ) => {
    setState(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as object),
        [nestedKey]: value
      }
    }));
  }, []);

  // Action handlers
  const handleReset = useCallback(() => {
    setState(DEFAULT_STATE);
    toast({ title: "Reset Complete", description: "All properties reset to defaults." });
  }, [toast]);

  const handleSave = useCallback(() => {
    toast({ title: "Saved!", description: "Changes saved successfully." });
  }, [toast]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `inspector-config-${Date.now()}.json`);
    link.click();
    toast({ title: "Exported!", description: "Configuration exported." });
  }, [state, toast]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            setState(imported);
            toast({ title: "Imported!", description: "Configuration imported." });
          } catch {
            toast({ title: "Error", description: "Failed to import.", variant: "destructive" });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [toast]);

  // AI Prompt handler
  const handleAiSubmit = useCallback(async () => {
    if (!promptText.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-prompt`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: promptText,
            currentState: state 
          })
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment.');
        }
        throw new Error('AI request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setAiResponse(prev => prev + chunk);
        }
      }
    } catch (error: any) {
      toast({
        title: "AI Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsAiLoading(false);
    }
  }, [promptText, state, toast]);

  // Generate code from state
  const generatedCode = useMemo(() => {
    const classes = [];
    
    // Typography
    if (state.typography.fontFamily !== 'sans-serif') {
      classes.push(`font-${state.typography.fontFamily}`);
    }
    classes.push(`text-[${state.typography.fontSize}px]`);
    classes.push(`font-[${state.typography.fontWeight}]`);
    classes.push(`leading-[${state.typography.lineHeight}]`);
    classes.push(`text-${state.typography.textAlign}`);
    
    // Spacing
    classes.push(`pt-[${state.padding.top}px]`);
    classes.push(`pr-[${state.padding.right}px]`);
    classes.push(`pb-[${state.padding.bottom}px]`);
    classes.push(`pl-[${state.padding.left}px]`);
    
    // Border
    if (state.border.radius > 0) {
      classes.push(`rounded-[${state.border.radius}px]`);
    }
    if (state.border.width !== '0') {
      classes.push(`border-[${state.border.width}px]`);
      classes.push(`border-${state.border.style}`);
    }
    
    // Effects
    if (state.effects.opacity !== 100) {
      classes.push(`opacity-${state.effects.opacity}`);
    }
    if (state.effects.blur > 0) {
      classes.push(`blur-[${state.effects.blur}px]`);
    }
    
    // Transforms
    const transforms = [];
    if (state.transforms.translateX !== 0) transforms.push(`translateX(${state.transforms.translateX}px)`);
    if (state.transforms.translateY !== 0) transforms.push(`translateY(${state.transforms.translateY}px)`);
    if (state.transforms.rotate !== 0) transforms.push(`rotate(${state.transforms.rotate}deg)`);
    if (state.transforms.scale !== 100) transforms.push(`scale(${state.transforms.scale / 100})`);
    
    const inlineStyles: Record<string, string> = {
      backgroundColor: state.appearance.backgroundColor,
      color: state.typography.textColor,
    };
    
    if (state.border.width !== '0') {
      inlineStyles.borderColor = state.border.color;
    }
    
    if (transforms.length > 0) {
      inlineStyles.transform = transforms.join(' ');
    }

    const styleString = Object.entries(inlineStyles)
      .map(([k, v]) => `${k}: "${v}"`)
      .join(', ');

    return `<${state.tag}
  className="${classes.join(' ')}"
  style={{ ${styleString} }}
>
  ${state.textContent || 'Content here'}
</${state.tag}>`;
  }, [state]);

  return (
    <Draggable
      handle=".drag-handle"
      defaultPosition={savedPosition}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div className="bg-card border border-border rounded-2xl shadow-lg w-80 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <header className="drag-handle cursor-move flex items-center justify-between border-b border-border py-2 px-3 bg-secondary/50 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-medium text-muted-foreground bg-primary/20 px-1.5 py-0.5 rounded">
              {state.tag}
            </span>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabMode)}>
              <TabsList className="h-6">
                <TabsTrigger value="EDIT" className="text-[9px] px-2 h-5">
                  <Palette className="w-3 h-3 mr-1" />
                  EDIT
                </TabsTrigger>
                <TabsTrigger value="PROMPT" className="text-[9px] px-2 h-5">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI
                </TabsTrigger>
                <TabsTrigger value="CODE" className="text-[9px] px-2 h-5">
                  <Code2 className="w-3 h-3 mr-1" />
                  CODE
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleReset} title="Reset">
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleSave} title="Save">
              <Save className="w-3 h-3" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="w-3 h-3 mr-2" />Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImport}>
                  <Upload className="w-3 h-3 mr-2" />Import
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Layers className="w-3 h-3 mr-2" />Templates
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-3 h-3 mr-2" />Preferences
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <div className="p-3 overflow-y-auto flex-1">
          {/* EDIT Tab */}
          {activeTab === 'EDIT' && (
            <div className="space-y-2">
              <BreakpointSelector current={currentBreakpoint} onChange={setCurrentBreakpoint} />
              
              <Accordion 
                type="multiple" 
                value={expandedSections}
                onValueChange={setExpandedSections}
                className="space-y-1"
              >
                {/* Typography Section */}
                <AccordionItem value="typography" className="border border-border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <Type className="w-3 h-3" />
                      Typography
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 py-2 space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Text Content</Label>
                      <Input
                        value={state.textContent}
                        onChange={(e) => updateState('textContent', e.target.value)}
                        placeholder="Enter text..."
                        className="h-7 text-xs"
                      />
                    </div>
                    
                    <ColorPicker
                      label="Text Color"
                      color={state.typography.textColor}
                      onChange={(c) => updateNestedState('typography', 'textColor', c)}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Font Family</Label>
                        <Select
                          value={state.typography.fontFamily}
                          onValueChange={(v) => updateNestedState('typography', 'fontFamily', v)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sans-serif">Sans Serif</SelectItem>
                            <SelectItem value="serif">Serif</SelectItem>
                            <SelectItem value="mono">Monospace</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Weight</Label>
                        <Select
                          value={state.typography.fontWeight}
                          onValueChange={(v) => updateNestedState('typography', 'fontWeight', v)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="300">Light</SelectItem>
                            <SelectItem value="400">Regular</SelectItem>
                            <SelectItem value="500">Medium</SelectItem>
                            <SelectItem value="600">Semibold</SelectItem>
                            <SelectItem value="700">Bold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <SliderRow
                      label="Font Size"
                      value={parseInt(state.typography.fontSize) || 16}
                      onChange={(v) => updateNestedState('typography', 'fontSize', v.toString())}
                      min={8}
                      max={72}
                      unit="px"
                    />
                    
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Text Align</Label>
                      <div className="flex border border-border rounded-md overflow-hidden">
                        {['left', 'center', 'right', 'justify'].map(align => (
                          <button
                            key={align}
                            onClick={() => updateNestedState('typography', 'textAlign', align)}
                            className={`flex-1 py-1.5 text-[9px] capitalize transition-colors ${
                              state.typography.textAlign === align
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card hover:bg-secondary'
                            }`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Appearance Section */}
                <AccordionItem value="appearance" className="border border-border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <Palette className="w-3 h-3" />
                      Appearance
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 py-2 space-y-3">
                    <ColorPicker
                      label="Background Color"
                      color={state.appearance.backgroundColor}
                      onChange={(c) => updateNestedState('appearance', 'backgroundColor', c)}
                    />
                    
                    <ColorPicker
                      label="Border Color"
                      color={state.border.color}
                      onChange={(c) => updateNestedState('border', 'color', c)}
                    />
                    
                    <SliderRow
                      label="Border Radius"
                      value={state.border.radius}
                      onChange={(v) => updateNestedState('border', 'radius', v)}
                      max={50}
                      unit="px"
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Border Width</Label>
                        <Select
                          value={state.border.width}
                          onValueChange={(v) => updateNestedState('border', 'width', v)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            <SelectItem value="1">1px</SelectItem>
                            <SelectItem value="2">2px</SelectItem>
                            <SelectItem value="4">4px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Border Style</Label>
                        <Select
                          value={state.border.style}
                          onValueChange={(v) => updateNestedState('border', 'style', v)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="dashed">Dashed</SelectItem>
                            <SelectItem value="dotted">Dotted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <SliderRow
                      label="Opacity"
                      value={state.effects.opacity}
                      onChange={(v) => updateNestedState('effects', 'opacity', v)}
                      unit="%"
                    />
                    
                    <SliderRow
                      label="Blur"
                      value={state.effects.blur}
                      onChange={(v) => updateNestedState('effects', 'blur', v)}
                      max={20}
                      unit="px"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Layout Section */}
                <AccordionItem value="layout" className="border border-border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <Layout className="w-3 h-3" />
                      Layout & Spacing
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 py-2 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                        <div key={side} className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground capitalize">Padding {side}</Label>
                          <Input
                            value={state.padding[side]}
                            onChange={(e) => updateNestedState('padding', side, e.target.value)}
                            className="h-7 text-xs"
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Width</Label>
                        <Input
                          value={state.size.width}
                          onChange={(e) => updateNestedState('size', 'width', e.target.value)}
                          className="h-7 text-xs"
                          placeholder="auto"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Height</Label>
                        <Input
                          value={state.size.height}
                          onChange={(e) => updateNestedState('size', 'height', e.target.value)}
                          className="h-7 text-xs"
                          placeholder="auto"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Transforms Section */}
                <AccordionItem value="transforms" className="border border-border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-3 h-3" />
                      Transforms
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 py-2 space-y-3">
                    <SliderRow
                      label="Translate X"
                      value={state.transforms.translateX}
                      onChange={(v) => updateNestedState('transforms', 'translateX', v)}
                      min={-100}
                      max={100}
                      unit="px"
                    />
                    <SliderRow
                      label="Translate Y"
                      value={state.transforms.translateY}
                      onChange={(v) => updateNestedState('transforms', 'translateY', v)}
                      min={-100}
                      max={100}
                      unit="px"
                    />
                    <SliderRow
                      label="Rotate"
                      value={state.transforms.rotate}
                      onChange={(v) => updateNestedState('transforms', 'rotate', v)}
                      min={-180}
                      max={180}
                      unit="°"
                    />
                    <SliderRow
                      label="Scale"
                      value={state.transforms.scale}
                      onChange={(v) => updateNestedState('transforms', 'scale', v)}
                      min={50}
                      max={150}
                      unit="%"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* 3D Transforms */}
                <AccordionItem value="transforms3d" className="border border-border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3 h-3" />
                      3D Transforms
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 py-2 space-y-3">
                    <SliderRow
                      label="Rotate X"
                      value={state.transforms3D.rotateX}
                      onChange={(v) => updateNestedState('transforms3D', 'rotateX', v)}
                      min={-180}
                      max={180}
                      unit="°"
                    />
                    <SliderRow
                      label="Rotate Y"
                      value={state.transforms3D.rotateY}
                      onChange={(v) => updateNestedState('transforms3D', 'rotateY', v)}
                      min={-180}
                      max={180}
                      unit="°"
                    />
                    <SliderRow
                      label="Perspective"
                      value={state.transforms3D.perspective}
                      onChange={(v) => updateNestedState('transforms3D', 'perspective', v)}
                      max={1000}
                      unit="px"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {/* PROMPT Tab */}
          {activeTab === 'PROMPT' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground">Describe your changes</Label>
                <Textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g., Make the background a gradient from blue to purple..."
                  className="min-h-[80px] text-xs resize-none"
                />
                <Button 
                  onClick={handleAiSubmit}
                  disabled={isAiLoading || !promptText.trim()}
                  className="w-full h-8 text-xs"
                >
                  {isAiLoading ? (
                    <>
                      <Sparkles className="w-3 h-3 mr-2 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 mr-2" />
                      Apply with AI
                    </>
                  )}
                </Button>
              </div>
              
              {aiResponse && (
                <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                  <Label className="text-[10px] text-muted-foreground mb-2 block">AI Response</Label>
                  <p className="text-xs text-foreground whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
            </div>
          )}

          {/* CODE Tab */}
          {activeTab === 'CODE' && (
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">Generated Code</Label>
              <div className="rounded-lg overflow-hidden border border-border h-[300px]">
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  value={generatedCode}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 11,
                    lineNumbers: 'off',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    readOnly: true,
                    padding: { top: 8, bottom: 8 }
                  }}
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full h-7 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  toast({ title: "Copied!", description: "Code copied to clipboard." });
                }}
              >
                <Download className="w-3 h-3 mr-2" />
                Copy Code
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="p-2 border-t border-border bg-secondary/20 flex justify-between items-center">
          <span className="text-[9px] text-muted-foreground font-mono">
            #{state.elementId || 'element'}
          </span>
          <Button size="sm" className="h-6 px-3 text-[10px]" onClick={handleSave}>
            Apply Changes
          </Button>
        </footer>
      </div>
    </Draggable>
  );
});

PropertyInspector.displayName = 'PropertyInspector';

export default PropertyInspector;
