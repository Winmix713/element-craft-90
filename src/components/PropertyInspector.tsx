import React, { useMemo } from 'react';
import {
  RotateCcw, MousePointer2, Save, X, ChevronDown,
  Laptop, UnfoldHorizontal, UnfoldVertical, Scan, Square, Eye, Image, Move,
  Zap, RotateCw, Maximize, WandSparkles, Sparkles, Paperclip, Figma, Send,
  Circle, Droplet, Sun, Contrast, FlipHorizontal, GripVertical, Hash, Type
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

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

export const PropertyInspector = () => {
  const { selectedElement, updateElement, updateNestedElement, deselectElement } = useElement();
  const [activeTab, setActiveTab] = React.useState<TabMode>('EDIT');
  const [borderRadiusTab, setBorderRadiusTab] = React.useState<'all' | 't' | 'r' | 'b' | 'l'>('all');
  const [openAccordions, setOpenAccordions] = React.useState<string[]>(['text', 'colors', 'border', 'transforms']);
  const [promptText, setPromptText] = React.useState('');

  // Ha nincs kiválasztott elem, használjuk a default-ot
  const elementData = selectedElement || defaultElementState;

  // Tailwind Class generátor
  const generatedClasses = useMemo(() => {
    const classes: string[] = [];
    
    if (elementData.padding.l && elementData.padding.l !== '0') classes.push(`pl-${elementData.padding.l}`);
    if (elementData.padding.t && elementData.padding.t !== '0') classes.push(`pt-${elementData.padding.t}`);
    if (elementData.padding.r && elementData.padding.r !== '0') classes.push(`pr-${elementData.padding.r}`);
    if (elementData.padding.b && elementData.padding.b !== '0') classes.push(`pb-${elementData.padding.b}`);
    if (elementData.margin.x && elementData.margin.x !== '0') classes.push(`mx-${elementData.margin.x}`);
    if (elementData.margin.y && elementData.margin.y !== '0') classes.push(`my-${elementData.margin.y}`);
    if (elementData.typography.weight && elementData.typography.weight !== 'normal') classes.push(`font-${elementData.typography.weight}`);
    if (elementData.typography.tracking && elementData.typography.tracking !== 'normal') classes.push(`tracking-${elementData.typography.tracking}`);
    if (elementData.rotate !== 0) classes.push(`rotate-[${elementData.rotate}deg]`);
    if (elementData.scale !== 100) classes.push(`scale-[${elementData.scale / 100}]`);
    if (elementData.opacity !== 100) classes.push(`opacity-${elementData.opacity}`);
    if (elementData.blur > 0) classes.push(`blur-[${elementData.blur}px]`);
    if (elementData.shadow !== 'none') classes.push(`shadow-${elementData.shadow}`);
    if (elementData.borderRadius.all > 0) classes.push(`rounded-[${elementData.borderRadius.all}px]`);
    
    return classes.join(' ');
  }, [elementData]);

  // Inline style generátor
  const generatedStyle = useMemo(() => {
    const styles: string[] = [];
    if (elementData.bgColor) styles.push(`background-color: ${elementData.bgColor}`);
    if (elementData.textColor) styles.push(`color: ${elementData.textColor}`);
    if (elementData.borderColor) styles.push(`border-color: ${elementData.borderColor}`);
    return styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
  }, [elementData]);

  // Kód generálás
  const codeText = useMemo(() => {
    const classAttr = generatedClasses ? ` class="${generatedClasses}"` : '';
    const idAttr = elementData.elementId ? ` id="${elementData.elementId}"` : '';
    return `<${elementData.tag}${idAttr}${classAttr}${generatedStyle}>\n  ${elementData.textContent}\n</${elementData.tag}>`;
  }, [elementData, generatedClasses, generatedStyle]);

  const resetTransforms = () => {
    updateElement('rotate', 0);
    updateElement('scale', 100);
    updateElement('translateX', 0);
    updateElement('translateY', 0);
    updateElement('skewX', 0);
    updateElement('skewY', 0);
  };

  const handleApplyPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AI-nak küldve:", promptText);
    setPromptText('');
  };

  const ColorButton = ({ 
    color, 
    onChange, 
    label 
  }: { 
    color: string | null; 
    onChange: (color: string | null) => void; 
    label: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card hover:bg-secondary transition-colors ${!color ? 'opacity-50' : ''}`}>
          <div 
            className="w-4 h-4 rounded-full border border-border" 
            style={{ backgroundColor: color || 'hsl(var(--muted))' }}
          />
          <span className="text-xs truncate">{color ? label : `No ${label}`}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <HexColorPicker color={color || '#ffffff'} onChange={onChange} />
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 text-xs"
          onClick={() => onChange(null)}
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[90vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs uppercase font-bold text-primary">
            {selectedElement ? elementData.tag : 'Nincs kiválasztva'}
          </h3>
          <div className="flex border border-border rounded-md overflow-hidden bg-background">
            {(['EDIT', 'PROMPT', 'CODE'] as TabMode[]).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-[9px] font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-secondary'
                } ${tab !== 'EDIT' ? 'border-l border-border' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetTransforms} title="Reset Transforms">
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={deselectElement}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {!selectedElement ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <MousePointer2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground">Kattints egy elemre a vásznon a szerkesztéshez</p>
        </div>
      ) : (
        <>
          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1">
            {activeTab === 'PROMPT' ? (
              <form onSubmit={handleApplyPrompt} className="space-y-4">
                <Textarea
                  placeholder="Pl: Legyen kerekebb a sarka és sötétkék a szöveg..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full resize-none min-h-[120px] text-xs rounded-xl"
                />
                <div className="font-mono text-[10px] bg-secondary/50 border border-border rounded-lg px-2 py-2">
                  {generatedClasses || 'Nincsenek osztályok'}
                </div>
                <Button type="submit" disabled={!promptText.trim()} className="w-full gap-2">
                  <Send className="w-3 h-3" />
                  Alkalmazás AI-val
                </Button>
              </form>
            ) : activeTab === 'CODE' ? (
              <div className="flex flex-col h-full gap-3">
                <Textarea
                  value={codeText}
                  readOnly
                  className="flex-1 font-mono text-[11px] bg-neutral-950 text-green-400 p-3 rounded-lg min-h-[350px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {generatedClasses.split(' ').filter(Boolean).length} osztály
                  </span>
                  <Button size="sm" className="h-7 text-[10px]" onClick={() => navigator.clipboard.writeText(codeText)}>
                    Másolás
                  </Button>
                </div>
              </div>
            ) : (
              <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="space-y-1">
                {/* Text Content */}
                <AccordionItem value="text" className="border-none">
                  <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                    <div className="flex items-center gap-1.5">
                      <Type className="w-3 h-3" />
                      <span>Szöveg és Tag</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 space-y-2">
                    <Input 
                      value={elementData.textContent} 
                      onChange={(e) => updateElement('textContent', e.target.value)}
                      className="h-8 text-xs"
                      placeholder="Szöveg tartalom..."
                    />
                    <Select value={elementData.tag} onValueChange={(v) => updateElement('tag', v)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {['div', 'button', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'a'].map(tag => (
                          <SelectItem key={tag} value={tag}>{tag.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                {/* Colors */}
                <AccordionItem value="colors" className="border-none">
                  <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                    Színek
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <ColorButton 
                        color={elementData.bgColor} 
                        onChange={(c) => updateElement('bgColor', c)} 
                        label="Háttér" 
                      />
                      <ColorButton 
                        color={elementData.textColor} 
                        onChange={(c) => updateElement('textColor', c)} 
                        label="Szöveg" 
                      />
                    </div>
                    <ColorButton 
                      color={elementData.borderColor} 
                      onChange={(c) => updateElement('borderColor', c)} 
                      label="Keret" 
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Typography */}
                <AccordionItem value="typography" className="border-none">
                  <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                    Tipográfia
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Select 
                        value={elementData.typography.font} 
                        onValueChange={(v) => updateNestedElement('typography', 'font', v)}
                      >
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="roboto">Roboto</SelectItem>
                          <SelectItem value="mono">Mono</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select 
                        value={elementData.typography.weight} 
                        onValueChange={(v) => updateNestedElement('typography', 'weight', v)}
                      >
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="semibold">Semibold</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <LabeledInput 
                      label="Méret" 
                      value={elementData.typography.size} 
                      onChange={(v) => updateNestedElement('typography', 'size', v)} 
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Padding */}
                <AccordionItem value="padding" className="border-none">
                  <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                    <div className="flex items-center gap-1.5">
                      <Square className="w-3 h-3" />
                      <span>Padding</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <LabeledInput label="L" value={elementData.padding.l} onChange={(v) => updateNestedElement('padding', 'l', v)} />
                      <LabeledInput label="T" value={elementData.padding.t} onChange={(v) => updateNestedElement('padding', 't', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <LabeledInput label="R" value={elementData.padding.r} onChange={(v) => updateNestedElement('padding', 'r', v)} />
                      <LabeledInput label="B" value={elementData.padding.b} onChange={(v) => updateNestedElement('padding', 'b', v)} />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Border */}
                <AccordionItem value="border" className="border-none">
                  <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                    Keret & Lekerekítés
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 space-y-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground mb-1.5 block">Lekerekítés</span>
                      <Tabs value={borderRadiusTab} onValueChange={(v) => setBorderRadiusTab(v as typeof borderRadiusTab)} className="w-full">
                        <TabsList className="grid grid-cols-5 h-7">
                          {['all', 't', 'r', 'b', 'l'].map(tab => (
                            <TabsTrigger key={tab} value={tab} className="text-[10px] px-2">{tab.toUpperCase()}</TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                      <SliderControl
                        icon={<Circle className="w-2.5 h-2.5" />}
                        label={`Sugár ${borderRadiusTab.toUpperCase()}`}
                        value={elementData.borderRadius[borderRadiusTab]}
                        onChange={(v) => updateNestedElement('borderRadius', borderRadiusTab, v)}
                        min={0}
                        max={50}
                        unit="px"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Effects */}
                <AccordionItem value="effects" className="border-none">
                  <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                    Effektek
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 space-y-2">
                    <Select value={elementData.shadow} onValueChange={(v) => updateElement('shadow', v)}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Árnyék" /></SelectTrigger>
                      <SelectContent>
                        {['none', 'sm', 'md', 'lg', 'xl', '2xl'].map(v => (
                          <SelectItem key={v} value={v}>{v.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <SliderControl icon={<Eye className="w-2.5 h-2.5" />} label="Átlátszatlanság" value={elementData.opacity} onChange={(v) => updateElement('opacity', v)} min={0} max={100} unit="%" />
                    <SliderControl icon={<Droplet className="w-2.5 h-2.5" />} label="Blur" value={elementData.blur} onChange={(v) => updateElement('blur', v)} min={0} max={20} unit="px" />
                  </AccordionContent>
                </AccordionItem>

                {/* Transforms */}
                <AccordionItem value="transforms" className="border-none">
                  <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                    Transzformáció
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="Forgatás" value={elementData.rotate} onChange={(v) => updateElement('rotate', v)} min={-180} max={180} unit="°" />
                      <SliderControl icon={<Maximize className="w-2.5 h-2.5" />} label="Skálázás" value={elementData.scale} onChange={(v) => updateElement('scale', v)} min={50} max={200} unit="%" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <SliderControl icon={<Move className="w-2.5 h-2.5" />} label="X" value={elementData.translateX} onChange={(v) => updateElement('translateX', v)} min={-100} max={100} unit="px" />
                      <SliderControl icon={<Move className="w-2.5 h-2.5" />} label="Y" value={elementData.translateY} onChange={(v) => updateElement('translateY', v)} min={-100} max={100} unit="px" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-secondary/20 flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground font-mono">
              #{elementData.elementId || elementData.id}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={resetTransforms}>
                Reset
              </Button>
              <Button size="sm" className="h-6 px-2 text-[10px]">
                Mentés
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper Components
const LabeledInput = ({ 
  label, 
  value,
  onChange 
}: { 
  label: string; 
  value?: string;
  onChange?: (value: string) => void;
}) => (
  <div className="relative">
    <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xs font-light text-foreground pointer-events-none ${!value ? 'opacity-40' : ''}`}>
      {label}
    </span>
    <Input 
      type="text" 
      value={value || ''} 
      onChange={(e) => onChange?.(e.target.value)}
      className="h-8 text-xs pl-10" 
    />
  </div>
);

const SliderControl = ({ 
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
  <div className="-space-y-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 opacity-70">
        {icon}
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-[10px] text-muted-foreground font-mono">
        {valueLabel || `${value}${unit}`}
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
    />
  </div>
);
