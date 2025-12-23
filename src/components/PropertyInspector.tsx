import React, { useState, useEffect, useMemo } from 'react';
import {
  RotateCcw, MousePointer2, Save, MoreHorizontal, X, ChevronDown,
  Laptop, UnfoldHorizontal, UnfoldVertical, Scan, Square, Eye, Image, Move,
  Zap, RotateCw, Maximize, WandSparkles, Sparkles, Paperclip, Figma, Send,
  AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, Layers, Circle,
  Droplet, Sun, Contrast, FlipHorizontal, GripVertical, Hash
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

// Központi állapot típusa
interface ElementState {
  tag: string;
  textContent: string;
  padding: { l: string; t: string; r: string; b: string };
  margin: { x: string; y: string };
  position: { type: string; l: string; t: string; r: string; b: string };
  size: { width: string; height: string; maxW: string; maxH: string };
  spacing: { spaceX: string; spaceY: string; gapX: string; gapY: string };
  alignment: { justify: string; align: string };
  typography: { font: string; weight: string; tracking: string };
  opacity: number;
  rotate: number;
  scale: number;
  translateX: number;
  translateY: number;
  skewX: number;
  skewY: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  perspective: number;
  bgColor: string | null;
  textColor: string | null;
  borderColor: string | null;
  ringColor: string | null;
  borderRadius: { all: number; t: number; r: number; b: number; l: number };
  shadow: string;
  blur: number;
  backdropBlur: number;
  hueRotate: number;
  saturation: number;
  brightness: number;
  grayscale: number;
  invert: number;
  inlineCSS: string;
  elementId: string;
}

export const PropertyInspector = () => {
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const [borderRadiusTab, setBorderRadiusTab] = useState<'all' | 't' | 'r' | 'b' | 'l'>('all');
  const [openAccordions, setOpenAccordions] = useState<string[]>(['text', 'padding', 'transforms']);

  // Központi állapot
  const [elementData, setElementData] = useState<ElementState>({
    tag: 'h2',
    textContent: 'Layers',
    padding: { l: '2', t: '0', r: '2', b: '3' },
    margin: { x: '0', y: '0' },
    position: { type: 'relative', l: '', t: '', r: '', b: '' },
    size: { width: '', height: '', maxW: '', maxH: '' },
    spacing: { spaceX: '', spaceY: '', gapX: '', gapY: '' },
    alignment: { justify: 'default', align: 'default' },
    typography: { font: 'inter', weight: 'semibold', tracking: 'tight' },
    opacity: 100,
    rotate: 0,
    scale: 100,
    translateX: 0,
    translateY: 0,
    skewX: 0,
    skewY: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 0,
    bgColor: null,
    textColor: null,
    borderColor: null,
    ringColor: null,
    borderRadius: { all: 0, t: 0, r: 0, b: 0, l: 0 },
    shadow: 'none',
    blur: 0,
    backdropBlur: 0,
    hueRotate: 0,
    saturation: 100,
    brightness: 100,
    grayscale: 0,
    invert: 0,
    inlineCSS: '',
    elementId: ''
  });

  const [promptText, setPromptText] = useState('');
  const [codeText, setCodeText] = useState('');

  // Tailwind Class generátor
  const generatedClasses = useMemo(() => {
    const classes: string[] = [];
    
    // Padding
    if (elementData.padding.l) classes.push(`pl-${elementData.padding.l}`);
    if (elementData.padding.t) classes.push(`pt-${elementData.padding.t}`);
    if (elementData.padding.r) classes.push(`pr-${elementData.padding.r}`);
    if (elementData.padding.b) classes.push(`pb-${elementData.padding.b}`);
    
    // Margin
    if (elementData.margin.x && elementData.margin.x !== '0') classes.push(`mx-${elementData.margin.x}`);
    if (elementData.margin.y && elementData.margin.y !== '0') classes.push(`my-${elementData.margin.y}`);
    
    // Typography
    if (elementData.typography.font !== 'inter') classes.push(`font-${elementData.typography.font}`);
    if (elementData.typography.weight) classes.push(`font-${elementData.typography.weight}`);
    if (elementData.typography.tracking) classes.push(`tracking-${elementData.typography.tracking}`);
    
    // Transforms
    if (elementData.rotate !== 0) classes.push(`rotate-[${elementData.rotate}deg]`);
    if (elementData.scale !== 100) classes.push(`scale-[${elementData.scale / 100}]`);
    if (elementData.translateX !== 0) classes.push(`translate-x-[${elementData.translateX}px]`);
    if (elementData.translateY !== 0) classes.push(`translate-y-[${elementData.translateY}px]`);
    if (elementData.skewX !== 0) classes.push(`skew-x-[${elementData.skewX}deg]`);
    if (elementData.skewY !== 0) classes.push(`skew-y-[${elementData.skewY}deg]`);
    
    // Effects
    if (elementData.opacity !== 100) classes.push(`opacity-${elementData.opacity}`);
    if (elementData.blur > 0) classes.push(`blur-[${elementData.blur}px]`);
    if (elementData.backdropBlur > 0) classes.push(`backdrop-blur-[${elementData.backdropBlur}px]`);
    if (elementData.hueRotate !== 0) classes.push(`hue-rotate-[${elementData.hueRotate}deg]`);
    if (elementData.saturation !== 100) classes.push(`saturate-[${elementData.saturation / 100}]`);
    if (elementData.brightness !== 100) classes.push(`brightness-[${elementData.brightness / 100}]`);
    if (elementData.grayscale > 0) classes.push(`grayscale-[${elementData.grayscale / 100}]`);
    if (elementData.invert > 0) classes.push(`invert-[${elementData.invert / 100}]`);
    
    // Border
    if (elementData.shadow !== 'none') classes.push(`shadow-${elementData.shadow}`);
    if (elementData.borderRadius.all > 0) classes.push(`rounded-[${elementData.borderRadius.all}px]`);
    
    // Position
    if (elementData.position.type !== 'static') classes.push(elementData.position.type);
    
    // Size
    if (elementData.size.width) classes.push(`w-[${elementData.size.width}]`);
    if (elementData.size.height) classes.push(`h-[${elementData.size.height}]`);
    
    return classes.join(' ');
  }, [elementData]);

  // Inline style generátor
  const generatedStyle = useMemo(() => {
    const styles: string[] = [];
    
    if (elementData.bgColor) styles.push(`background-color: ${elementData.bgColor}`);
    if (elementData.textColor) styles.push(`color: ${elementData.textColor}`);
    if (elementData.borderColor) styles.push(`border-color: ${elementData.borderColor}`);
    if (elementData.inlineCSS) styles.push(elementData.inlineCSS);
    
    // 3D transforms
    const transforms3D: string[] = [];
    if (elementData.rotateX !== 0) transforms3D.push(`rotateX(${elementData.rotateX}deg)`);
    if (elementData.rotateY !== 0) transforms3D.push(`rotateY(${elementData.rotateY}deg)`);
    if (elementData.rotateZ !== 0) transforms3D.push(`rotateZ(${elementData.rotateZ}deg)`);
    if (elementData.perspective > 0) styles.push(`perspective: ${elementData.perspective * 100}px`);
    if (transforms3D.length > 0) styles.push(`transform: ${transforms3D.join(' ')}`);
    
    return styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
  }, [elementData]);

  // Kód szinkronizálása
  useEffect(() => {
    const classAttr = generatedClasses ? ` class="${generatedClasses}"` : '';
    const idAttr = elementData.elementId ? ` id="${elementData.elementId}"` : '';
    const html = `<${elementData.tag}${idAttr}${classAttr}${generatedStyle}>\n  ${elementData.textContent}\n</${elementData.tag}>`;
    setCodeText(html);
  }, [elementData, generatedClasses, generatedStyle]);

  // Állapot frissítő segédfüggvények
  const updateData = <K extends keyof ElementState>(key: K, value: ElementState[K]) => {
    setElementData(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedData = <K extends keyof ElementState>(
    key: K, 
    nestedKey: string, 
    value: string | number
  ) => {
    setElementData(prev => ({
      ...prev,
      [key]: { ...(prev[key] as Record<string, unknown>), [nestedKey]: value }
    }));
  };

  const resetTransforms = () => {
    setElementData(prev => ({
      ...prev,
      rotate: 0,
      scale: 100,
      translateX: 0,
      translateY: 0,
      skewX: 0,
      skewY: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      perspective: 0
    }));
  };

  const handleApplyPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AI-nak küldve:", promptText);
    // Itt hívnád meg az API-t
    setPromptText('');
  };

  const handleSaveCode = () => {
    console.log("Kód mentve:", codeText);
    // Itt mentenéd a kódot
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
          <h3 className="text-xs uppercase font-bold text-primary">{elementData.tag}</h3>
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
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MousePointer2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Save className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {activeTab === 'PROMPT' ? (
          <form onSubmit={handleApplyPrompt} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Írd le mit szeretnél változtatni:
              </label>
              <div className="relative">
                <Textarea
                  placeholder="Pl: Legyen kerekebb a sarka és sötétkék a szöveg..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full resize-none min-h-[120px] text-xs rounded-xl pb-12"
                />
                <div className="absolute bottom-3 left-3 z-10 flex gap-1">
                  {[
                    { icon: WandSparkles, title: 'Prompt Builder' },
                    { icon: Sparkles, title: 'AI Model', label: 'GPT-5' },
                    { icon: Paperclip, title: 'Attach Files' },
                    { icon: Figma, title: 'Import from Figma' },
                  ].map(({ icon: Icon, title, label }) => (
                    <button 
                      key={title}
                      type="button"
                      className="flex items-center rounded-lg bg-card border border-border hover:border-primary/50 shadow-sm p-2 py-1 gap-1 text-[10px] hover:bg-secondary"
                      title={title}
                    >
                      <Icon className="h-3 w-3" />
                      {label && <>{label}<ChevronDown className="h-3 w-3" /></>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div>Kiválasztva: <span className="font-medium font-mono text-xs uppercase text-foreground">{elementData.tag}</span></div>
                <span className="text-[10px]">#{elementData.elementId || 'aura-2134'}</span>
              </div>
              <div className="font-mono text-[10px] bg-secondary/50 border border-border rounded-lg px-2 py-2">
                {generatedClasses || 'Nincsenek osztályok'}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={!promptText.trim()} className="flex-1 gap-2">
                <Send className="w-3 h-3" />
                Alkalmazás AI-val
              </Button>
              <Button type="button" variant="outline" onClick={() => setPromptText('')}>
                Mégse
              </Button>
            </div>
          </form>
        ) : activeTab === 'CODE' ? (
          <div className="flex flex-col h-full gap-3">
            <Textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              className="flex-1 font-mono text-[11px] bg-neutral-950 text-green-400 p-3 rounded-lg min-h-[350px] resize-none"
              spellCheck={false}
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {generatedClasses.split(' ').filter(Boolean).length} osztály
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px]">
                  Visszaállítás
                </Button>
                <Button size="sm" className="h-7 text-[10px]" onClick={handleSaveCode}>
                  Kód mentése
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Breakpoint Selector */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex border border-border rounded-md overflow-hidden h-6">
                {['AUTO', '*', 'MD'].map((bp, i) => (
                  <button 
                    key={bp}
                    className={`px-2 text-[9px] transition-all ${
                      bp === 'AUTO' ? 'bg-primary text-primary-foreground' : 
                      bp === 'MD' ? 'bg-accent/20 text-accent-foreground' : 
                      'bg-card text-muted-foreground hover:bg-secondary'
                    } ${i > 0 ? 'border-l border-border' : ''}`}
                  >
                    {bp}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
                <Laptop className="w-3 h-3" />
                <span>Auto Breakpoint</span>
              </span>
            </div>

            <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="space-y-1">
              {/* Text Content */}
              <AccordionItem value="text" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Szöveg tartalom
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <Input 
                    value={elementData.textContent} 
                    onChange={(e) => updateData('textContent', e.target.value)}
                    className="h-8 text-xs"
                    placeholder="Szöveg..."
                  />
                  <Select value={elementData.tag} onValueChange={(v) => updateData('tag', v)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'].map(tag => (
                        <SelectItem key={tag} value={tag}>{tag.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>

              {/* Element ID */}
              <AccordionItem value="element-id" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3 h-3" />
                    <span>Element ID</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <Input 
                    type="text" 
                    placeholder="unique-element-id" 
                    value={elementData.elementId}
                    onChange={(e) => updateData('elementId', e.target.value)}
                    className="h-8 text-xs font-mono" 
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Padding */}
              <AccordionItem value="padding" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Square className="w-3 h-3" />
                    <span>Belső margó (Padding)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput 
                      label="L" 
                      value={elementData.padding.l} 
                      onChange={(v) => updateNestedData('padding', 'l', v)} 
                    />
                    <LabeledInput 
                      label="T" 
                      value={elementData.padding.t} 
                      onChange={(v) => updateNestedData('padding', 't', v)} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput 
                      label="R" 
                      value={elementData.padding.r} 
                      onChange={(v) => updateNestedData('padding', 'r', v)} 
                    />
                    <LabeledInput 
                      label="B" 
                      value={elementData.padding.b} 
                      onChange={(v) => updateNestedData('padding', 'b', v)} 
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Margin */}
              <AccordionItem value="margin" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Scan className="w-3 h-3" />
                    <span>Külső margó (Margin)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput 
                      label="X" 
                      value={elementData.margin.x} 
                      onChange={(v) => updateNestedData('margin', 'x', v)} 
                    />
                    <LabeledInput 
                      label="Y" 
                      value={elementData.margin.y} 
                      onChange={(v) => updateNestedData('margin', 'y', v)} 
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Position */}
              <AccordionItem value="position" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <GripVertical className="w-3 h-3" />
                    <span>Pozíció</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <Select 
                    value={elementData.position.type} 
                    onValueChange={(v) => updateNestedData('position', 'type', v)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['static', 'relative', 'absolute', 'fixed', 'sticky'].map(pos => (
                        <SelectItem key={pos} value={pos}>{pos.charAt(0).toUpperCase() + pos.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="L" value={elementData.position.l} onChange={(v) => updateNestedData('position', 'l', v)} />
                    <LabeledInput label="T" value={elementData.position.t} onChange={(v) => updateNestedData('position', 't', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="R" value={elementData.position.r} onChange={(v) => updateNestedData('position', 'r', v)} />
                    <LabeledInput label="B" value={elementData.position.b} onChange={(v) => updateNestedData('position', 'b', v)} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Size */}
              <AccordionItem value="size" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Méret
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <IconInput 
                      icon={<UnfoldHorizontal className="w-3 h-3" />} 
                      placeholder="Szélesség" 
                      value={elementData.size.width}
                      onChange={(v) => updateNestedData('size', 'width', v)}
                    />
                    <IconInput 
                      icon={<UnfoldVertical className="w-3 h-3" />} 
                      placeholder="Magasság" 
                      value={elementData.size.height}
                      onChange={(v) => updateNestedData('size', 'height', v)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="Max W" value={elementData.size.maxW} onChange={(v) => updateNestedData('size', 'maxW', v)} />
                    <LabeledInput label="Max H" value={elementData.size.maxH} onChange={(v) => updateNestedData('size', 'maxH', v)} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Typography */}
              <AccordionItem value="typography" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Tipográfia
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={elementData.typography.font} onValueChange={(v) => updateNestedData('typography', 'font', v)}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="mono">Mono</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={elementData.typography.weight} onValueChange={(v) => updateNestedData('typography', 'weight', v)}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="semibold">Semibold</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={elementData.typography.tracking} onValueChange={(v) => updateNestedData('typography', 'tracking', v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tighter">Tighter</SelectItem>
                      <SelectItem value="tight">Tight</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                    </SelectContent>
                  </Select>
                  <ColorButton color={elementData.textColor} onChange={(c) => updateData('textColor', c)} label="Szín" />
                </AccordionContent>
              </AccordionItem>

              {/* Background */}
              <AccordionItem value="background" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Háttér
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <ColorButton color={elementData.bgColor} onChange={(c) => updateData('bgColor', c)} label="Szín" />
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
              <AccordionItem value="border" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Keret
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <ColorButton color={elementData.borderColor} onChange={(c) => updateData('borderColor', c)} label="Border" />
                    <ColorButton color={elementData.ringColor} onChange={(c) => updateData('ringColor', c)} label="Ring" />
                  </div>
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
                      onChange={(v) => updateNestedData('borderRadius', borderRadiusTab, v)}
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
                  <Select value={elementData.shadow} onValueChange={(v) => updateData('shadow', v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Árnyék" /></SelectTrigger>
                    <SelectContent>
                      {['none', 'sm', 'md', 'lg', 'xl', '2xl'].map(v => (
                        <SelectItem key={v} value={v}>{v.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <SliderControl icon={<Eye className="w-2.5 h-2.5" />} label="Átlátszatlanság" value={elementData.opacity} onChange={(v) => updateData('opacity', v)} min={0} max={100} unit="%" />
                  <SliderControl icon={<Droplet className="w-2.5 h-2.5" />} label="Blur" value={elementData.blur} onChange={(v) => updateData('blur', v)} min={0} max={100} unit="px" />
                  <SliderControl icon={<Droplet className="w-2.5 h-2.5" />} label="Backdrop Blur" value={elementData.backdropBlur} onChange={(v) => updateData('backdropBlur', v)} min={0} max={100} unit="px" />
                  <SliderControl icon={<Contrast className="w-2.5 h-2.5" />} label="Hue Rotate" value={elementData.hueRotate} onChange={(v) => updateData('hueRotate', v)} min={0} max={360} unit="°" />
                  <SliderControl icon={<Sun className="w-2.5 h-2.5" />} label="Saturation" value={elementData.saturation} onChange={(v) => updateData('saturation', v)} min={0} max={200} unit="%" />
                  <SliderControl icon={<Sun className="w-2.5 h-2.5" />} label="Brightness" value={elementData.brightness} onChange={(v) => updateData('brightness', v)} min={0} max={200} unit="%" />
                  <SliderControl icon={<FlipHorizontal className="w-2.5 h-2.5" />} label="Grayscale" value={elementData.grayscale} onChange={(v) => updateData('grayscale', v)} min={0} max={100} unit="%" />
                  <SliderControl icon={<FlipHorizontal className="w-2.5 h-2.5" />} label="Invert" value={elementData.invert} onChange={(v) => updateData('invert', v)} min={0} max={100} unit="%" />
                </AccordionContent>
              </AccordionItem>

              {/* Transforms */}
              <AccordionItem value="transforms" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Transzformáció
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<Move className="w-2.5 h-2.5" />} label="Translate X" value={elementData.translateX} onChange={(v) => updateData('translateX', v)} min={-200} max={200} unit="px" />
                    <SliderControl icon={<Move className="w-2.5 h-2.5" />} label="Translate Y" value={elementData.translateY} onChange={(v) => updateData('translateY', v)} min={-200} max={200} unit="px" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<Zap className="w-2.5 h-2.5" />} label="Skew X" value={elementData.skewX} onChange={(v) => updateData('skewX', v)} min={-45} max={45} unit="°" />
                    <SliderControl icon={<Zap className="w-2.5 h-2.5" />} label="Skew Y" value={elementData.skewY} onChange={(v) => updateData('skewY', v)} min={-45} max={45} unit="°" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="Forgatás" value={elementData.rotate} onChange={(v) => updateData('rotate', v)} min={-180} max={180} unit="°" />
                    <SliderControl icon={<Maximize className="w-2.5 h-2.5" />} label="Skálázás" value={elementData.scale} onChange={(v) => updateData('scale', v)} min={50} max={200} unit="%" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 3D Transform */}
              <AccordionItem value="3d-transform" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  3D Transzformáció
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="3D Rotate X" value={elementData.rotateX} onChange={(v) => updateData('rotateX', v)} min={-180} max={180} unit="°" />
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="3D Rotate Y" value={elementData.rotateY} onChange={(v) => updateData('rotateY', v)} min={-180} max={180} unit="°" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="3D Rotate Z" value={elementData.rotateZ} onChange={(v) => updateData('rotateZ', v)} min={-180} max={180} unit="°" />
                    <SliderControl 
                      icon={<Maximize className="w-2.5 h-2.5" />} 
                      label="Perspektíva" 
                      value={elementData.perspective} 
                      onChange={(v) => updateData('perspective', v)} 
                      min={0} 
                      max={10} 
                      unit=""
                      valueLabel={elementData.perspective === 0 ? "Nincs" : `${elementData.perspective * 100}px`}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Inline CSS */}
              <AccordionItem value="inline-css" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Inline CSS
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <Textarea
                    placeholder="color: red; font-size: 16px;"
                    value={elementData.inlineCSS}
                    onChange={(e) => updateData('inlineCSS', e.target.value)}
                    rows={2}
                    className="resize-none text-xs font-mono"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-secondary/20 flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground">
          ID: #{elementData.elementId || 'aura-2134'}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={resetTransforms}>
            Visszavonás
          </Button>
          <Button size="sm" className="h-6 px-2 text-[10px]">
            Mentés
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- SEGÉDKOMPONENSEK ---

const IconInput = ({ 
  icon, 
  placeholder,
  value,
  onChange 
}: { 
  icon: React.ReactNode; 
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) => (
  <div className="relative">
    <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none opacity-50">
      {icon}
    </div>
    <Input 
      type="text" 
      placeholder={placeholder} 
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-8 text-xs pl-8" 
    />
  </div>
);

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
