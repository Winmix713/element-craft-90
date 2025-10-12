import { useState } from 'react';
import {
  RotateCcw, MousePointer2, Save, MoreHorizontal, X, ChevronDown, ChevronLeft,
  Laptop, UnfoldHorizontal, UnfoldVertical, Scan, Square, Eye, Image, Move,
  Zap, RotateCw, Maximize
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const PropertyInspector = () => {
  const [opacity, setOpacity] = useState(100);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(100);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [perspective, setPerspective] = useState(0);

  return (
    <div className="bg-card border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs uppercase font-medium text-muted-foreground">h2</h3>
          <div className="flex border border-border rounded-md overflow-hidden">
            <button className="px-2 py-1 text-[8px] font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground">
              EDIT
            </button>
            <button className="px-2 py-1 text-[8px] font-medium transition-[var(--transition-smooth)] border-l border-border bg-card text-muted-foreground hover:bg-secondary">
              PROMPT
            </button>
            <button className="px-2 py-1 text-[8px] font-medium transition-[var(--transition-smooth)] border-l border-border bg-card text-muted-foreground hover:bg-secondary">
              CODE
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <MousePointer2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <Save className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        <div className="space-y-3">
          {/* Breakpoint Selector */}
          <div className="flex items-center justify-between">
            <div className="flex border border-border rounded-md overflow-hidden h-6">
              <button className="px-2 text-[9px] transition-[var(--transition-smooth)] bg-primary text-primary-foreground">AUTO</button>
              <button className="px-2 text-[9px] transition-[var(--transition-smooth)] bg-card text-muted-foreground border-l border-border hover:bg-secondary">*</button>
              <button className="px-2 text-[9px] transition-[var(--transition-smooth)] bg-accent/20 text-accent-foreground border-l border-border">MD</button>
            </div>
            <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
              <Laptop className="w-3 h-3" />
              <span>Auto Breakpoint</span>
            </span>
          </div>

          {/* Family Elements */}
          <PropertySection title="Family Elements">
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
          </PropertySection>

          {/* Link */}
          <PropertySection title="Link">
            <Input type="text" placeholder="/page or url..." className="h-8 text-xs" />
          </PropertySection>

          {/* Text Content */}
          <PropertySection title="Text Content">
            <Textarea
              placeholder="Enter text content..."
              rows={1}
              className="resize-none text-xs"
              defaultValue="Layers"
            />
          </PropertySection>

          {/* Tailwind Classes */}
          <PropertySection title="Tailwind Classes">
            <Textarea
              placeholder="Enter Tailwind classes..."
              rows={1}
              className="resize-none text-xs opacity-50 cursor-not-allowed"
              disabled
              defaultValue="px-2 pb-3 text-[18px] md:text-[20px] font-semibold tracking-tight"
            />
          </PropertySection>

          {/* Margin */}
          <PropertySection title="Margin" icon={<Scan className="w-3 h-3" />}>
            <div className="grid grid-cols-2 gap-2">
              <IconInput icon={<UnfoldHorizontal className="w-3 h-3" />} />
              <IconInput icon={<UnfoldVertical className="w-3 h-3" />} />
            </div>
          </PropertySection>

          {/* Padding */}
          <PropertySection title="Padding" icon={<Square className="w-3 h-3" />}>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <LabeledInput label="L" defaultValue="2" />
                <LabeledInput label="T" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <LabeledInput label="R" defaultValue="2" />
                <LabeledInput label="B" defaultValue="3" />
              </div>
            </div>
          </PropertySection>

          {/* Size */}
          <PropertySection title="Size">
            <div className="grid grid-cols-2 gap-2">
              <IconInput icon={<UnfoldHorizontal className="w-3 h-3" />} />
              <IconInput icon={<UnfoldVertical className="w-3 h-3" />} />
            </div>
          </PropertySection>

          {/* Typography */}
          <PropertySection title="Typography">
            <div className="grid grid-cols-2 gap-2">
              <Select defaultValue="inter">
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="default">
                <SelectTrigger className="h-7 text-xs opacity-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Select defaultValue="semibold">
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semibold">Semibold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="tight">
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tight">Tight</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PropertySection>

          {/* Appearance */}
          <PropertySection title="Appearance" icon={<Eye className="w-3 h-3" />}>
            <div className="grid grid-cols-2 gap-2">
              <Select defaultValue="opacity">
                <SelectTrigger className="h-7 text-xs opacity-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opacity">Opacity</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="blend">
                <SelectTrigger className="h-7 text-xs opacity-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blend">Blend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PropertySection>

          {/* Background */}
          <PropertySection title="Background">
            <div className="grid grid-cols-2 gap-2">
              <button className="h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card opacity-30">
                <div className="w-4 h-4 rounded-full border border-border bg-muted"></div>
                <span className="text-xs truncate">No Color</span>
              </button>
              <button className="h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card opacity-30">
                <div className="w-4 h-4 rounded border border-border bg-muted flex items-center justify-center">
                  <Image className="w-2.5 h-2.5 text-muted-foreground" />
                </div>
                <span className="text-xs truncate">No Image</span>
              </button>
            </div>
          </PropertySection>

          {/* Transforms */}
          <div className="border-t border-border pt-4 pb-2">
            <PropertySection title="Transforms">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Slider
                    icon={<Move className="w-2.5 h-2.5" />}
                    label="Translate X"
                    value={translateX}
                    onChange={setTranslateX}
                    min={-200}
                    max={200}
                    unit=""
                  />
                  <Slider
                    icon={<Move className="w-2.5 h-2.5" />}
                    label="Translate Y"
                    value={translateY}
                    onChange={setTranslateY}
                    min={-200}
                    max={200}
                    unit=""
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Slider
                    icon={<Zap className="w-2.5 h-2.5" />}
                    label="Skew X"
                    value={skewX}
                    onChange={setSkewX}
                    min={-45}
                    max={45}
                    unit="°"
                  />
                  <Slider
                    icon={<Zap className="w-2.5 h-2.5" />}
                    label="Skew Y"
                    value={skewY}
                    onChange={setSkewY}
                    min={-45}
                    max={45}
                    unit="°"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Slider
                    icon={<RotateCw className="w-2.5 h-2.5" />}
                    label="Rotate"
                    value={rotate}
                    onChange={setRotate}
                    min={-180}
                    max={180}
                    unit="°"
                  />
                  <Slider
                    icon={<Maximize className="w-2.5 h-2.5" />}
                    label="Scale"
                    value={scale}
                    onChange={setScale}
                    min={0}
                    max={200}
                    unit="%"
                  />
                </div>
              </div>
            </PropertySection>
          </div>

          {/* 3D Transform */}
          <div className="border-t border-border pt-4 pb-2">
            <PropertySection title="3D Transform">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Slider
                    icon={<RotateCw className="w-2.5 h-2.5" />}
                    label="3D Rotate X"
                    value={rotateX}
                    onChange={setRotateX}
                    min={-180}
                    max={180}
                    unit="°"
                  />
                  <Slider
                    icon={<RotateCw className="w-2.5 h-2.5" />}
                    label="3D Rotate Y"
                    value={rotateY}
                    onChange={setRotateY}
                    min={-180}
                    max={180}
                    unit="°"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Slider
                    icon={<RotateCw className="w-2.5 h-2.5" />}
                    label="3D Rotate Z"
                    value={rotateZ}
                    onChange={setRotateZ}
                    min={-180}
                    max={180}
                    unit="°"
                  />
                  <Slider
                    icon={<Maximize className="w-2.5 h-2.5" />}
                    label="Perspective"
                    value={perspective}
                    onChange={setPerspective}
                    min={0}
                    max={6}
                    unit=""
                    displayValue="Default"
                  />
                </div>
              </div>
            </PropertySection>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
interface PropertySectionProps {
  title: string;
  icon?: React.ReactNode;
  collapsed?: boolean;
  children?: React.ReactNode;
}

const PropertySection = ({ title, icon, collapsed = false, children }: PropertySectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-muted-foreground">{title}</label>
        {icon && (
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            {icon}
          </Button>
        )}
        {!icon && (
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <ChevronDown className="w-3 h-3" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};

interface IconInputProps {
  icon: React.ReactNode;
  defaultValue?: string;
}

const IconInput = ({ icon, defaultValue }: IconInputProps) => {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none opacity-30">
        {icon}
      </div>
      <Input type="text" defaultValue={defaultValue} className="h-8 text-xs pl-8" />
    </div>
  );
};

interface LabeledInputProps {
  label: string;
  defaultValue?: string;
}

const LabeledInput = ({ label, defaultValue }: LabeledInputProps) => {
  return (
    <div className="relative">
      <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xs font-light text-foreground pointer-events-none ${!defaultValue ? 'opacity-30' : ''}`}>
        {label}
      </span>
      <Input type="text" defaultValue={defaultValue} className="h-8 text-xs pl-8" />
    </div>
  );
};

interface SliderProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  displayValue?: string;
}

const Slider = ({ icon, label, value, onChange, min, max, unit, displayValue }: SliderProps) => {
  return (
    <div className="-space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {icon}
          <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {displayValue || `${value}${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
      />
    </div>
  );
};
