import React, { useCallback, useMemo, memo } from 'react';
import {
  Type, Droplet, Square, Move, Copy, Check, MousePointer2, Layers,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Eye, EyeOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider'; // Feltételezve, hogy a shadcn slider támogatja a tömböt
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { HexColorPicker } from 'react-colorful';
import { useElement, ElementState } from '@/contexts/ElementContext';
import { cn } from '@/lib/utils';

// --- Sub-components for better performance ---

const PropertySection = ({ title, icon: Icon, children, value }: { title: string; icon: any; children: React.ReactNode; value: string }) => (
  <AccordionItem value={value} className="border-b border-border/50">
    <AccordionTrigger className="py-3 px-4 hover:bg-secondary/20 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-4 py-3 space-y-4 bg-background/50">
      {children}
    </AccordionContent>
  </AccordionItem>
);

const NumberInput = memo(({ label, value, onChange, unit, className, min, max }: any) => (
  <div className={cn("relative group", className)}>
    <label className="text-[9px] font-medium text-muted-foreground uppercase absolute left-2 top-1.5 z-10 pointer-events-none">
      {label}
    </label>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 pl-6 pr-6 text-xs text-right font-mono bg-secondary/30 focus:bg-background transition-colors"
      min={min} max={max}
    />
    <span className="absolute right-2 top-2 text-[9px] text-muted-foreground pointer-events-none">{unit}</span>
  </div>
));

const ColorPickerInput = memo(({ color, onChange, label }: { color: string | null; onChange: (c: string) => void; label: string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="w-full flex items-center justify-between p-1.5 rounded-md border border-input bg-background hover:bg-accent transition-all group">
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded border border-border/50 shadow-sm"
            style={{ backgroundColor: color || 'transparent', backgroundImage: !color ? 'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee)' : undefined, backgroundSize: '6px 6px' }}
          />
          <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">{color?.toUpperCase() || 'NONE'}</span>
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-3 bg-popover/95 backdrop-blur-xl border-border shadow-2xl" align="center">
      <HexColorPicker color={color || '#ffffff'} onChange={onChange} />
      <div className="mt-2 flex gap-2">
         <Input value={color || ''} onChange={e => onChange(e.target.value)} className="h-7 text-xs font-mono" placeholder="#HEX" />
      </div>
    </PopoverContent>
  </Popover>
));

const CodeViewer = ({ element }: { element: ElementState }) => {
  const [copied, setCopied] = React.useState(false);
  
  // Advanced code generation (mock implementation of a utility class generator)
  const code = useMemo(() => {
    const { style } = element;
    const classes = [
      `p-[${style.padding.t}px_${style.padding.r}px_${style.padding.b}px_${style.padding.l}px]`,
      style.background.color ? `bg-[${style.background.color}]` : '',
      `rounded-[${style.border.radius}px]`,
      `font-${style.typography.weight}`,
      style.shadow !== 'none' ? `shadow-${style.shadow}` : '',
    ].filter(Boolean).join(' ');

    return `<${element.type} 
  className="${classes}"
  style={{
    transform: 'rotate(${style.transform.rotate}deg)'
  }}
>
  ${element.content || ''}
</${element.type}>`;
  }, [element]);

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-2">
      <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400 overflow-x-auto">
        {code}
      </pre>
      <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6" onClick={onCopy}>
        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      </Button>
    </div>
  );
};

// --- Main Component ---

export const PropertyInspector = () => {
  const { selection: el, updateElement } = useElement();

  if (!el) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-secondary/5 border-l border-border">
        <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-4 animate-pulse">
          <MousePointer2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold mb-1">No Selection</h3>
        <p className="text-xs text-muted-foreground max-w-[200px]">Click on an element in the canvas to edit its properties.</p>
      </div>
    );
  }

  const updateStyle = (section: keyof typeof el.style, key: string, val: any) => {
    updateElement(el.id, {
      style: {
        [section]: {
          ...el.style[section as keyof typeof el.style], // Type cast fix needed for deep strict typing
          [key]: val
        }
      } as any
    });
  };

  return (
    <div className="w-80 h-full flex flex-col bg-card border-l border-border shadow-2xl z-20">
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Properties</span>
          <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{el.type}</span>
        </div>
        <Input 
          value={el.name} 
          onChange={(e) => updateElement(el.id, { name: e.target.value })}
          className="h-7 text-sm font-semibold border-none hover:bg-secondary/50 px-0 focus-visible:ring-0" 
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-none bg-transparent border-b border-border p-0 h-9">
            <TabsTrigger value="design" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px]">Design</TabsTrigger>
            <TabsTrigger value="code" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px]">Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="m-0">
            <Accordion type="multiple" defaultValue={['layout', 'typography', 'background']} className="w-full">
              
              <PropertySection title="Layout & Spacing" icon={Square} value="layout">
                <div className="grid grid-cols-2 gap-2">
                  <NumberInput label="W" value={el.style.layout.width === 'auto' ? 0 : parseInt(el.style.layout.width)} onChange={(v:number) => updateStyle('layout', 'width', `${v}px`)} unit="px" />
                  <NumberInput label="H" value={el.style.layout.height === 'auto' ? 0 : parseInt(el.style.layout.height)} onChange={(v:number) => updateStyle('layout', 'height', `${v}px`)} unit="px" />
                </div>
                <div className="grid grid-cols-4 gap-1 pt-2">
                  <NumberInput label="L" value={el.style.padding.l} onChange={(v:number) => updateStyle('padding', 'l', v)} className="text-center" />
                  <NumberInput label="T" value={el.style.padding.t} onChange={(v:number) => updateStyle('padding', 't', v)} />
                  <NumberInput label="R" value={el.style.padding.r} onChange={(v:number) => updateStyle('padding', 'r', v)} />
                  <NumberInput label="B" value={el.style.padding.b} onChange={(v:number) => updateStyle('padding', 'b', v)} />
                </div>
              </PropertySection>

              <PropertySection title="Typography" icon={Type} value="typography">
                 <div className="space-y-3">
                   <div className="flex items-center justify-between gap-2 bg-secondary/20 p-1 rounded-md">
                     {[
                       { icon: AlignLeft, v: 'left' }, { icon: AlignCenter, v: 'center' }, 
                       { icon: AlignRight, v: 'right' }, { icon: AlignJustify, v: 'justify' }
                     ].map(opt => (
                       <Button 
                        key={opt.v}
                        variant={el.style.typography.align === opt.v ? 'default' : 'ghost'} 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => updateStyle('typography', 'align', opt.v)}
                       >
                         <opt.icon className="w-3 h-3" />
                       </Button>
                     ))}
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <NumberInput label="Size" value={el.style.typography.size} onChange={(v:number) => updateStyle('typography', 'size', v)} unit="px" />
                      <NumberInput label="Weight" value={parseInt(el.style.typography.weight)} onChange={(v:number) => updateStyle('typography', 'weight', v.toString())} unit="" />
                   </div>
                 </div>
              </PropertySection>

              <PropertySection title="Appearance" icon={Droplet} value="background">
                <ColorPickerInput 
                  label="Background" 
                  color={el.style.background.color} 
                  onChange={(c) => updateStyle('background', 'color', c)} 
                />
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] mb-1.5">
                    <span>Opacity</span>
                    <span>{el.style.background.opacity}%</span>
                  </div>
                  <Slider 
                    value={[el.style.background.opacity]} 
                    max={100} 
                    onValueChange={([v]) => updateStyle('background', 'opacity', v)} 
                    className="w-full"
                  />
                </div>
              </PropertySection>

              <PropertySection title="Transform" icon={Move} value="transform">
                <div className="grid grid-cols-2 gap-2">
                  <NumberInput label="Rotate" value={el.style.transform.rotate} onChange={(v:number) => updateStyle('transform', 'rotate', v)} unit="deg" />
                  <NumberInput label="Scale" value={el.style.transform.scale} onChange={(v:number) => updateStyle('transform', 'scale', v)} unit="%" />
                  <NumberInput label="X" value={el.style.transform.x} onChange={(v:number) => updateStyle('transform', 'x', v)} unit="px" />
                  <NumberInput label="Y" value={el.style.transform.y} onChange={(v:number) => updateStyle('transform', 'y', v)} unit="px" />
                </div>
              </PropertySection>

            </Accordion>
          </TabsContent>
          <TabsContent value="code" className="p-4">
             <CodeViewer element={el} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
