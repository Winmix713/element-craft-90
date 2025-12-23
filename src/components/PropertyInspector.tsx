import React, { useMemo, useCallback, memo } from 'react';
import {
  RotateCcw, MousePointer2, X, ChevronDown,
  Square, Eye, Move, RotateCw, Maximize, 
  Send, Circle, Droplet, Type, Copy, Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { useElement, defaultElementState } from '@/contexts/ElementContext';
import { cn } from '@/lib/utils'; // Feltételezve, hogy létezik a shadcn-féle utility

// --- Types ---
type TabMode = 'EDIT' | 'PROMPT' | 'CODE';
type BorderRadiusTab = 'all' | 't' | 'r' | 'b' | 'l';

interface PanelProps {
  elementData: typeof defaultElementState;
  updateElement: ReturnType<typeof useElement>['updateElement'];
  updateNestedElement: ReturnType<typeof useElement>['updateNestedElement'];
}

// --- Helper Components ---

const LabeledInput = memo(({ label, value, onChange, className }: { 
  label: string; 
  value?: string | number;
  onChange?: (value: string) => void;
  className?: string;
}) => (
  <div className={cn("relative flex-1", className)}>
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground uppercase pointer-events-none">
      {label}
    </span>
    <Input 
      type="text" 
      value={value ?? ''} 
      onChange={(e) => onChange?.(e.target.value)}
      className="h-8 text-xs pl-7 bg-background/50 focus-visible:ring-1" 
    />
  </div>
));

const SliderControl = memo(({ icon, label, value, onChange, min, max, unit }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
}) => (
  <div className="space-y-1.5 py-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase">{label}</span>
      </div>
      <span className="text-[10px] font-mono bg-secondary px-1.5 rounded text-secondary-foreground">
        {value}{unit}
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all" 
    />
  </div>
));

const ColorButton = memo(({ color, onChange, label }: { 
  color: string | null; 
  onChange: (color: string | null) => void; 
  label: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="flex items-center gap-2 px-2 h-8 w-full rounded-md border border-input bg-background hover:bg-accent transition-colors">
        <div 
          className="w-4 h-4 rounded-sm border border-border shadow-sm" 
          style={{ backgroundColor: color || 'transparent', backgroundImage: !color ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : undefined, backgroundSize: '4px 4px', backgroundPosition: '0 0, 2px 2px' }}
        />
        <span className="text-[11px] font-medium truncate">{color || `No ${label}`}</span>
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-3" align="start">
      <HexColorPicker color={color || '#ffffff'} onChange={onChange} />
      <div className="flex gap-2 mt-3">
        <Input 
          className="h-7 text-[10px] font-mono" 
          value={color || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="#hex"
        />
        <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" onClick={() => onChange(null)}>
          Clear
        </Button>
      </div>
    </PopoverContent>
  </Popover>
));

// --- Main Component ---

export const PropertyInspector = () => {
  const { selectedElement, updateElement, updateNestedElement, deselectElement } = useElement();
  const [activeTab, setActiveTab] = React.useState<TabMode>('EDIT');
  const [borderRadiusTab, setBorderRadiusTab] = React.useState<BorderRadiusTab>('all');
  const [isCopied, setIsCopied] = React.useState(false);
  const [promptText, setPromptText] = React.useState('');

  const elementData = selectedElement || defaultElementState;

  // Tailwind Class & Style Logic (JIT kompatibilis)
  const { classes, styles } = useMemo(() => {
    const cls: string[] = [];
    const stl: React.CSSProperties = {};

    // Spacing
    if (elementData.padding.l) cls.push(`pl-[${elementData.padding.l}px]`);
    if (elementData.padding.t) cls.push(`pt-[${elementData.padding.t}px]`);
    if (elementData.padding.r) cls.push(`pr-[${elementData.padding.r}px]`);
    if (elementData.padding.b) cls.push(`pb-[${elementData.padding.b}px]`);
    
    // Typography
    if (elementData.typography.weight !== 'normal') cls.push(`font-${elementData.typography.weight}`);
    if (elementData.typography.size) stl.fontSize = `${elementData.typography.size}px`;
    
    // Effects
    if (elementData.opacity < 100) cls.push(`opacity-[${elementData.opacity / 100}]`);
    if (elementData.blur > 0) cls.push(`blur-[${elementData.blur}px]`);
    if (elementData.shadow !== 'none') cls.push(`shadow-${elementData.shadow}`);
    
    // Border Radius
    const br = elementData.borderRadius;
    if (br.all > 0) cls.push(`rounded-[${br.all}px]`);

    // Colors (Inline style biztosabb a dinamikus színeknél)
    if (elementData.bgColor) stl.backgroundColor = elementData.bgColor;
    if (elementData.textColor) stl.color = elementData.textColor;
    if (elementData.borderColor) {
      stl.borderColor = elementData.borderColor;
      stl.borderWidth = '1px';
      stl.borderStyle = 'solid';
    }

    // Transforms
    if (elementData.rotate || elementData.scale !== 100 || elementData.translateX || elementData.translateY) {
      stl.transform = `
        rotate(${elementData.rotate}deg) 
        scale(${elementData.scale / 100}) 
        translate(${elementData.translateX}px, ${elementData.translateY}px)
      `.trim();
    }

    return { classes: cls.join(' '), styles: stl };
  }, [elementData]);

  const codeText = useMemo(() => {
    const styleString = Object.entries(styles)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${v}`)
      .join('; ');
    
    return `<${elementData.tag} 
  class="${classes}"
  ${styleString ? `style="${styleString}"` : ''}
>
  ${elementData.textContent}
</${elementData.tag}>`;
  }, [elementData, classes, styles]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetTransforms = useCallback(() => {
    updateElement('rotate', 0);
    updateElement('scale', 100);
    updateElement('translateX', 0);
    updateElement('translateY', 0);
  }, [updateElement]);

  if (!selectedElement) {
    return (
      <div className="bg-card border border-border rounded-2xl w-80 h-[600px] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <MousePointer2 className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <h4 className="font-medium text-sm mb-1">Nincs kijelölt elem</h4>
        <p className="text-xs text-muted-foreground">Válassz ki valamit a vásznon a testreszabáshoz.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xl w-80 max-h-[90vh] flex flex-col overflow-hidden transition-all">
      {/* Header */}
      <header className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-bold text-primary/70">Inspector</span>
          <h3 className="text-xs font-mono font-bold truncate w-24">{elementData.tag.toUpperCase()}</h3>
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabMode)} className="w-auto">
          <TabsList className="h-8 bg-background border border-border p-1">
            <TabsTrigger value="EDIT" className="text-[10px] px-2 h-6">EDIT</TabsTrigger>
            <TabsTrigger value="PROMPT" className="text-[10px] px-2 h-6">AI</TabsTrigger>
            <TabsTrigger value="CODE" className="text-[10px] px-2 h-6">CODE</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={deselectElement}>
          <X className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'EDIT' && (
          <Accordion type="multiple" defaultValue={['content', 'colors']} className="px-4 py-2">
            
            {/* Content & Tag */}
            <AccordionItem value="content" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Type className="w-3.5 h-3.5 text-primary" /> Tartalom
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-1">
                <Textarea 
                  value={elementData.textContent} 
                  onChange={(e) => updateElement('textContent', e.target.value)}
                  className="text-xs min-h-[60px] resize-none"
                  placeholder="Elem szövege..."
                />
                <Select value={elementData.tag} onValueChange={(v) => updateElement('tag', v)}>
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['div', 'button', 'h1', 'h2', 'p', 'span', 'a'].map(t => (
                      <SelectItem key={t} value={t} className="text-xs">{t.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* Colors */}
            <AccordionItem value="colors" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Droplet className="w-3.5 h-3.5 text-primary" /> Megjelenés
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground ml-1">Háttér</span>
                    <ColorButton color={elementData.bgColor} onChange={(c) => updateElement('bgColor', c)} label="BG" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground ml-1">Szöveg</span>
                    <ColorButton color={elementData.textColor} onChange={(c) => updateElement('textColor', c)} label="Text" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground ml-1">Keret színe</span>
                  <ColorButton color={elementData.borderColor} onChange={(c) => updateElement('borderColor', c)} label="Border" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Layout (Padding) */}
            <AccordionItem value="layout" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Square className="w-3.5 h-3.5 text-primary" /> Térköz (px)
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1">
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <LabeledInput label="T" value={elementData.padding.t} onChange={(v) => updateNestedElement('padding', 't', v)} />
                  <LabeledInput label="R" value={elementData.padding.r} onChange={(v) => updateNestedElement('padding', 'r', v)} />
                  <LabeledInput label="B" value={elementData.padding.b} onChange={(v) => updateNestedElement('padding', 'b', v)} />
                  <LabeledInput label="L" value={elementData.padding.l} onChange={(v) => updateNestedElement('padding', 'l', v)} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Transforms */}
            <AccordionItem value="transforms" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Move className="w-3.5 h-3.5 text-primary" /> Transzformáció
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-1">
                <SliderControl 
                  icon={<RotateCw className="w-3 h-3" />} 
                  label="Forgatás" 
                  value={elementData.rotate} 
                  onChange={(v) => updateElement('rotate', v)} 
                  min={-180} max={180} unit="°" 
                />
                <SliderControl 
                  icon={<Maximize className="w-3 h-3" />} 
                  label="Skálázás" 
                  value={elementData.scale} 
                  onChange={(v) => updateElement('scale', v)} 
                  min={10} max={200} unit="%" 
                />
                <div className="flex justify-end">
                  <Button variant="link" size="sm" className="h-auto p-0 text-[10px] text-muted-foreground" onClick={resetTransforms}>
                    Visszaállítás
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        )}

        {activeTab === 'PROMPT' && (
          <div className="p-4 space-y-4 animate-in slide-in-from-right-2 duration-200">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-[11px] text-primary-foreground/80 leading-relaxed font-medium">
                Használd a természetes nyelvet az elem módosításához. Az AI frissíti a tulajdonságokat.
              </p>
            </div>
            <Textarea
              placeholder="Pl: Legyen kerekebb, sötétkék háttérrel és fehér vastag betűvel..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="min-h-[150px] text-xs focus-visible:ring-primary"
            />
            <Button className="w-full gap-2 shadow-lg" onClick={() => console.log("AI trigger", promptText)}>
              <Send className="w-3.5 h-3.5" /> Generálás
            </Button>
          </div>
        )}

        {activeTab === 'CODE' && (
          <div className="p-4 space-y-3 animate-in slide-in-from-right-2 duration-200">
            <div className="relative group">
              <pre className="p-4 bg-zinc-950 text-zinc-300 rounded-xl text-[11px] font-mono overflow-x-auto min-h-[300px] border border-white/10">
                {codeText}
              </pre>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={copyToClipboard}
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center italic">
              Tailwind JIT arbitrary values támogatott.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-3 border-t border-border bg-secondary/20 flex items-center justify-between">
        <code className="text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded">
          id: {elementData.elementId?.slice(0, 8) || 'static'}
        </code>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold">
            MÉGSE
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-bold px-4">
            MENTÉS
          </Button>
        </div>
      </footer>
    </div>
  );
};
