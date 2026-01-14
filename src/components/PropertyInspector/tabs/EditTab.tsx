import React, { useState, useCallback, useMemo } from 'react';
import {
  Laptop, UnfoldHorizontal, UnfoldVertical, Scan, Square, Eye, Image, Move,
  Zap, RotateCw, Maximize, Smartphone, Monitor, Tablet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useInspector } from '../InspectorContext';
import { ColorPicker } from '../components/ColorPicker';
import { GradientColorPicker } from '../components/GradientColorPicker';
import { Canvas } from '../components/Canvas';
import { Slider } from '../components/Slider';
import { IconInput, LabeledInput } from '../components/IconInput';

const BREAKPOINTS = [
  { value: 'auto', label: 'AUTO', icon: Laptop },
  { value: 'base', label: '*', icon: Smartphone },
  { value: 'sm', label: 'SM', icon: Smartphone },
  { value: 'md', label: 'MD', icon: Tablet },
  { value: 'lg', label: 'LG', icon: Monitor },
  { value: 'xl', label: 'XL', icon: Monitor },
  { value: '2xl', label: '2XL', icon: Monitor },
] as const;

const FONT_FAMILIES = [
  { value: 'inter', label: 'Inter' },
  { value: 'geist', label: 'Geist' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'plus-jakarta', label: 'Plus Jakarta Sans' },
  { value: 'bricolage', label: 'Bricolage Grotesque' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'instrument', label: 'Instrument Serif' },
  { value: 'space-mono', label: 'Space Mono' },
];

const FONT_WEIGHTS = [
  { value: 'thin', label: 'Thin' },
  { value: 'light', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
  { value: 'bold', label: 'Bold' },
  { value: 'extrabold', label: 'Extra Bold' },
];

const LETTER_SPACINGS = [
  { value: 'tighter', label: 'Tighter' },
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
  { value: 'wider', label: 'Wider' },
  { value: 'widest', label: 'Widest' },
];

const INPUT_DEBOUNCE_MS = 100;

// Debounced input hook for better performance
const useDebouncedInput = (value: string, onValueChange: (val: string) => void, delayMs: number = INPUT_DEBOUNCE_MS) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onValueChange(newValue);
    }, delayMs);
  }, [onValueChange, delayMs]);

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return [localValue, handleChange] as const;
};

export const EditTab: React.FC = () => {
  const { state, updateState, updateNestedState } = useInspector();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'family', 'link', 'text', 'tailwind', 'margin', 'padding', 'size',
    'typography', 'appearance', 'background', 'transforms', 'transforms3d'
  ]);

  const handleToggleSection = useCallback((value: string) => {
    setExpandedSections(prev =>
      prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value]
    );
  }, []);

  const breakpointLabel = useMemo(() => {
    return state.breakpoint === 'auto'
      ? 'Auto Breakpoint'
      : `${state.breakpoint.toUpperCase()} Breakpoint`;
  }, [state.breakpoint]);

  return (
    <div className="space-y-3">
      {/* Canvas Preview */}
      <Canvas className="mb-4" />

      {/* Breakpoint Selector */}
      <div className="flex items-center justify-between">
        <div className="flex border border-border rounded-md overflow-hidden h-6">
          {BREAKPOINTS.map((bp) => (
            <button
              key={bp.value}
              onClick={() => updateState('breakpoint', bp.value)}
              className={`px-2 text-[9px] transition-colors ${
                state.breakpoint === bp.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              } ${bp.value !== 'auto' ? 'border-l border-border' : ''}`}
              aria-pressed={state.breakpoint === bp.value}
              title={`Select ${bp.label} breakpoint`}
            >
              {bp.label}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
          <Laptop className="w-3 h-3" />
          <span>{breakpointLabel}</span>
        </span>
      </div>

      <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="space-y-0">
        {/* Family Elements */}
        <AccordionItem value="family" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            Family Elements
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <div className="flex flex-wrap items-center gap-1">
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-1.5 py-0.5">
                div
              </Button>
              <div className="text-muted-foreground text-[10px]">├</div>
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-1.5 py-0.5">
                div
              </Button>
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-1.5 py-0.5">
                div
              </Button>
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-1.5 py-0.5">
                p
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Link */}
        <AccordionItem value="link" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            Link
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <LinkInputField value={state.link} onChange={(v) => updateState('link', v)} />
          </AccordionContent>
        </AccordionItem>

        {/* Text Content */}
        <AccordionItem value="text" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            Text Content
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <TextContentField value={state.textContent} onChange={(v) => updateState('textContent', v)} />
          </AccordionContent>
        </AccordionItem>

        {/* Tailwind Classes */}
        <AccordionItem value="tailwind" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            Tailwind Classes
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <Textarea
              placeholder="Enter Tailwind classes..."
              rows={2}
              className="resize-none text-xs font-mono"
              value={state.tailwindClasses}
              onChange={(e) => updateState('tailwindClasses', e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Margin */}
        <AccordionItem value="margin" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Scan className="w-3 h-3" />
              Margin
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <LabeledInput
                label="L"
                value={state.margin.left}
                onChange={(v) => updateNestedState('margin', 'left', v)}
              />
              <LabeledInput
                label="T"
                value={state.margin.top}
                onChange={(v) => updateNestedState('margin', 'top', v)}
              />
              <LabeledInput
                label="R"
                value={state.margin.right}
                onChange={(v) => updateNestedState('margin', 'right', v)}
              />
              <LabeledInput
                label="B"
                value={state.margin.bottom}
                onChange={(v) => updateNestedState('margin', 'bottom', v)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Padding */}
        <AccordionItem value="padding" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Square className="w-3 h-3" />
              Padding
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <LabeledInput
                label="L"
                value={state.padding.left}
                onChange={(v) => updateNestedState('padding', 'left', v)}
              />
              <LabeledInput
                label="T"
                value={state.padding.top}
                onChange={(v) => updateNestedState('padding', 'top', v)}
              />
              <LabeledInput
                label="R"
                value={state.padding.right}
                onChange={(v) => updateNestedState('padding', 'right', v)}
              />
              <LabeledInput
                label="B"
                value={state.padding.bottom}
                onChange={(v) => updateNestedState('padding', 'bottom', v)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            Size
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <IconInput
                icon={<UnfoldHorizontal className="w-3 h-3" />}
                value={state.size.width}
                onChange={(v) => updateNestedState('size', 'width', v)}
                placeholder="Width"
              />
              <IconInput
                icon={<UnfoldVertical className="w-3 h-3" />}
                value={state.size.height}
                onChange={(v) => updateNestedState('size', 'height', v)}
                placeholder="Height"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Typography */}
        <AccordionItem value="typography" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            Typography
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={state.typography.fontFamily}
                onValueChange={(v) => updateNestedState('typography', 'fontFamily', v)}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Size (px)"
                value={state.typography.fontSize}
                onChange={(e) => updateNestedState('typography', 'fontSize', e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={state.typography.fontWeight}
                onValueChange={(v) => updateNestedState('typography', 'fontWeight', v)}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_WEIGHTS.map((w) => (
                    <SelectItem key={w.value} value={w.value}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={state.typography.letterSpacing}
                onValueChange={(v) => updateNestedState('typography', 'letterSpacing', v)}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LETTER_SPACINGS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Appearance */}
        <AccordionItem value="appearance" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3" />
              Appearance
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <Slider
              icon={<Eye className="w-2.5 h-2.5" />}
              label="Opacity"
              value={state.opacity}
              onChange={(v) => updateState('opacity', v)}
              min={0}
              max={100}
              unit="%"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Background */}
        <AccordionItem value="background" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            Background
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <ColorPicker
                color={state.background.color}
                onChange={(v) => updateNestedState('background', 'color', v)}
                label="Color"
              />
              <button className="h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card opacity-50">
                <div className="w-4 h-4 rounded border border-border bg-muted flex items-center justify-center">
                  <Image className="w-2.5 h-2.5 text-muted-foreground" />
                </div>
                <span className="text-xs truncate">No Image</span>
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Border */}
        <AccordionItem value="border" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            Border
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <ColorPicker
                color={state.border.color}
                onChange={(v) => updateNestedState('border', 'color', v)}
                label="Color"
              />
              <Input
                type="text"
                placeholder="Width (px)"
                value={state.border.width}
                onChange={(e) => updateNestedState('border', 'width', e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <Input
              type="text"
              placeholder="Radius (px)"
              value={state.border.radius}
              onChange={(e) => updateNestedState('border', 'radius', e.target.value)}
              className="h-7 text-xs"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Transforms */}
        <AccordionItem value="transforms" className="border-b-0 border-t border-border pt-2">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            Transforms
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Slider
                icon={<Move className="w-2.5 h-2.5" />}
                label="Translate X"
                value={state.transforms.translateX}
                onChange={(v) => updateNestedState('transforms', 'translateX', v)}
                min={-200}
                max={200}
                unit=""
              />
              <Slider
                icon={<Move className="w-2.5 h-2.5" />}
                label="Translate Y"
                value={state.transforms.translateY}
                onChange={(v) => updateNestedState('transforms', 'translateY', v)}
                min={-200}
                max={200}
                unit=""
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Slider
                icon={<Zap className="w-2.5 h-2.5" />}
                label="Skew X"
                value={state.transforms.skewX}
                onChange={(v) => updateNestedState('transforms', 'skewX', v)}
                min={-45}
                max={45}
                unit="°"
              />
              <Slider
                icon={<Zap className="w-2.5 h-2.5" />}
                label="Skew Y"
                value={state.transforms.skewY}
                onChange={(v) => updateNestedState('transforms', 'skewY', v)}
                min={-45}
                max={45}
                unit="°"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Slider
                icon={<RotateCw className="w-2.5 h-2.5" />}
                label="Rotate"
                value={state.transforms.rotate}
                onChange={(v) => updateNestedState('transforms', 'rotate', v)}
                min={-180}
                max={180}
                unit="°"
              />
              <Slider
                icon={<Maximize className="w-2.5 h-2.5" />}
                label="Scale"
                value={state.transforms.scale}
                onChange={(v) => updateNestedState('transforms', 'scale', v)}
                min={0}
                max={200}
                unit="%"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3D Transform */}
        <AccordionItem value="transforms3d" className="border-b-0 border-t border-border pt-2">
          <AccordionTrigger className="py-2 hover:no-underline text-xs font-medium text-muted-foreground">
            3D Transform
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Slider
                icon={<RotateCw className="w-2.5 h-2.5" />}
                label="3D Rotate X"
                value={state.transforms3d.rotateX}
                onChange={(v) => updateNestedState('transforms3d', 'rotateX', v)}
                min={-180}
                max={180}
                unit="°"
              />
              <Slider
                icon={<RotateCw className="w-2.5 h-2.5" />}
                label="3D Rotate Y"
                value={state.transforms3d.rotateY}
                onChange={(v) => updateNestedState('transforms3d', 'rotateY', v)}
                min={-180}
                max={180}
                unit="°"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Slider
                icon={<RotateCw className="w-2.5 h-2.5" />}
                label="3D Rotate Z"
                value={state.transforms3d.rotateZ}
                onChange={(v) => updateNestedState('transforms3d', 'rotateZ', v)}
                min={-180}
                max={180}
                unit="°"
              />
              <Slider
                icon={<Maximize className="w-2.5 h-2.5" />}
                label="Perspective"
                value={state.transforms3d.perspective}
                onChange={(v) => updateNestedState('transforms3d', 'perspective', v)}
                min={0}
                max={6}
                unit=""
                valueLabel={state.transforms3d.perspective === 0 ? 'Default' : state.transforms3d.perspective.toString()}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// Helper components for debounced inputs
const LinkInputField: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, INPUT_DEBOUNCE_MS);
  }, [onChange]);

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Input
      type="text"
      placeholder="/page or url..."
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
      className="h-8 text-xs"
    />
  );
};

const TextContentField: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, INPUT_DEBOUNCE_MS);
  }, [onChange]);

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Textarea
      placeholder="Enter text content..."
      rows={1}
      className="resize-none text-xs"
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};
