import { useState } from 'react';
import {
  RotateCcw, MousePointer2, Save, MoreHorizontal, X, ChevronDown, ChevronLeft,
  Laptop, UnfoldHorizontal, UnfoldVertical, Scan, Square, Eye, Image, Move,
  Zap, RotateCw, Maximize, WandSparkles, Sparkles, Paperclip, Figma, Send, CodeXml
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

export const PropertyInspector = () => {
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
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
  const [promptText, setPromptText] = useState('');
  const [codeText, setCodeText] = useState('<h2 class="text-[18px] md:text-[20px] font-semibold tracking-tight pr-2 pb-3 pl-2">Layers</h2>');

  return (
    <div className="bg-card border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs uppercase font-medium text-muted-foreground">h2</h3>
          <div className="flex border border-border rounded-md overflow-hidden">
            <button 
              onClick={() => setActiveTab('EDIT')}
              className={`px-2 py-1 text-[8px] font-medium transition-colors cursor-pointer ${
                activeTab === 'EDIT' 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              }`}
            >
              EDIT
            </button>
            <button 
              onClick={() => setActiveTab('PROMPT')}
              className={`px-2 py-1 text-[8px] font-medium transition-colors border-l border-border cursor-pointer ${
                activeTab === 'PROMPT' 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              }`}
            >
              PROMPT
            </button>
            <button 
              onClick={() => setActiveTab('CODE')}
              className={`px-2 py-1 text-[8px] font-medium transition-colors border-l border-border cursor-pointer ${
                activeTab === 'CODE' 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              }`}
            >
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
        {activeTab === 'PROMPT' ? (
          <form className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Describe what you want to change:
              </label>
              <div className="relative">
                <Textarea
                  placeholder="Adapt to dark mode, add details, make adaptive, change text to..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full resize-none min-h-[100px] max-h-[200px] overflow-y-auto text-xs hover:bg-secondary/50 pb-[40px] rounded-2xl"
                />
                <div className="absolute bottom-[16px] left-[9px] z-10 flex gap-1">
                  <button 
                    type="button"
                    className="flex p-2 py-1 gap-2 items-center text-[10px] rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 shadow-sm"
                    title="Open Prompt Builder"
                  >
                    <WandSparkles className="h-3 w-3" />
                  </button>
                  <button 
                    type="button"
                    className="flex items-center rounded-lg bg-card border border-border hover:border-primary/50 shadow-sm p-2 py-1 gap-2 text-[10px] flex-shrink-0 hover:bg-secondary"
                    title="Select AI Model"
                  >
                    <Sparkles className="h-3 w-3" />
                    GPT-5
                    <ChevronDown className="h-3 w-3 ml-0.5" />
                  </button>
                  <button 
                    type="button"
                    className="flex p-2 py-1 gap-2 items-center text-[10px] rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 shadow-sm"
                    title="Attach Files (Max 2)"
                  >
                    <Paperclip className="h-3 w-3" />
                  </button>
                  <button 
                    type="button"
                    className="flex p-2 py-1 items-center text-[10px] rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 shadow-sm"
                    title="Import from Figma"
                  >
                    <Figma className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div>Selected: <span className="font-medium font-mono text-xs uppercase text-foreground">h2</span></div>
                <span className="text-[10px]">#aura-emgn5hp8g9knbc3d</span>
              </div>
              <div className="font-mono text-[10px] bg-secondary/50 border border-border rounded-lg px-2 py-2">
                px-2 pb-3 text-[18px] md:text-[20px] font-semibold tracking-tight
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2 mt-2">
                <Button 
                  type="submit" 
                  disabled={!promptText.trim()}
                  className="flex p-2 px-3 gap-2 items-center"
                >
                  <Send className="w-3 h-3" />
                  Apply Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setPromptText('')}
                  className="p-2 px-3"
                >
                  Cancel
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Costs 1 prompt. Don't forget to save changes.
              </p>
            </div>
          </form>
        ) : activeTab === 'CODE' ? (
          <div className="flex flex-col h-full gap-3">
            <Textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              className="flex-1 font-mono text-xs resize-none bg-secondary/50 border-border rounded-lg p-3 min-h-[400px]"
              spellCheck={false}
            />
            <div className="flex items-center justify-between border-t border-border py-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">No changes</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  disabled
                  className="text-[10px] h-7 px-2"
                >
                  Reset
                </Button>
                <Button 
                  disabled
                  className="text-[10px] h-7 px-2"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        ) : (
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
                    valueLabel={perspective === 0 ? "Default" : perspective.toString()}
                  />
                </div>
              </div>
            </PropertySection>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const PropertySection = ({ 
  title, 
  icon, 
  children 
}: { 
  title: string; 
  icon?: React.ReactNode; 
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-medium text-muted-foreground">{title}</label>
      {icon && (
        <button className="text-muted-foreground hover:text-foreground rounded-full p-1">
          {icon}
        </button>
      )}
    </div>
    {children}
  </div>
);

const IconInput = ({ icon }: { icon: React.ReactNode }) => (
  <div className="relative">
    <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none opacity-30">
      {icon}
    </div>
    <Input type="text" className="h-8 text-xs pl-8" />
  </div>
);

const LabeledInput = ({ label, defaultValue }: { label: string; defaultValue?: string }) => (
  <div className="relative">
    <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xs font-light text-foreground pointer-events-none ${!defaultValue ? 'opacity-30' : ''}`}>
      {label}
    </span>
    <Input type="text" defaultValue={defaultValue} className="h-8 text-xs pl-8" />
  </div>
);

const Slider = ({ 
  icon, 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  unit,
  valueLabel
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  valueLabel?: string;
}) => (
  <div className="-space-y-1.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-[10px] text-muted-foreground">
        {valueLabel || `${value}${unit}`}
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer" 
    />
  </div>
);
