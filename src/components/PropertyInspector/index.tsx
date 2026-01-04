// PropertyInspector - Main Component

import React, { useState, useEffect } from 'react';
import {
  RotateCcw, MousePointer2, Save, X, ChevronDown, Laptop,
  UnfoldHorizontal, UnfoldVertical, Square, Eye, Image, Move,
  Zap, RotateCw, Maximize, WandSparkles, Sparkles, Paperclip, 
  Figma, Send, Circle, Droplet, Sun, Contrast, FlipHorizontal, 
  GripVertical, Hash, Type, Box, Palette, Layers, Link, Code
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

import type { TabMode, Breakpoint, BorderRadiusTab, SectionKey } from './types';
import { 
  DEFAULT_OPEN_SECTIONS, BREAKPOINTS, TAG_OPTIONS, 
  FONT_FAMILY_OPTIONS, FONT_WEIGHT_OPTIONS, LETTER_SPACING_OPTIONS,
  TEXT_ALIGN_OPTIONS, POSITION_OPTIONS, SHADOW_OPTIONS, BORDER_STYLE_OPTIONS 
} from './constants';
import { 
  useInspectorState, useGeneratedClasses, useGeneratedStyles, 
  useGeneratedCode, useExportCSS, useBreakpoint 
} from './hooks';
import { 
  ColorButton, LabeledInput, IconInput, SliderControl, 
  TabSelector, BreakpointSelector, SpacingGrid, StyledSelect 
} from './components';
import { PreviewBox } from './PreviewBox';

export const PropertyInspector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const [borderRadiusTab, setBorderRadiusTab] = useState<BorderRadiusTab>('all');
  const [openSections, setOpenSections] = useState<string[]>(DEFAULT_OPEN_SECTIONS);
  const [promptText, setPromptText] = useState('');
  
  const { breakpoint, setBreakpoint } = useBreakpoint();
  const { 
    state, 
    updateState, 
    updateNestedState, 
    updateDeepNestedState,
    resetTransforms 
  } = useInspectorState();
  
  const generatedClasses = useGeneratedClasses(state, breakpoint);
  const generatedStyles = useGeneratedStyles(state);
  const generatedCode = useGeneratedCode(state, generatedClasses, generatedStyles);
  const exportCSS = useExportCSS(state);
  
  const [codeText, setCodeText] = useState(generatedCode);
  
  useEffect(() => {
    setCodeText(generatedCode);
  }, [generatedCode]);

  const handleApplyPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AI-nak küldve:", promptText);
    setPromptText('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeText);
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[90vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs uppercase font-bold text-primary">{state.tag}</h3>
          <TabSelector 
            value={activeTab} 
            onChange={(v) => setActiveTab(v as TabMode)}
            options={['EDIT', 'PROMPT', 'CODE']}
          />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetTransforms} title="Reset">
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" title="Select">
            <MousePointer2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" title="Save">
            <Save className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" title="Close">
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
                <div>Kiválasztva: <span className="font-medium font-mono text-xs uppercase text-foreground">{state.tag}</span></div>
                <span className="text-[10px]">#{state.elementId || 'element'}</span>
              </div>
              <div className="font-mono text-[10px] bg-secondary/50 border border-border rounded-lg px-2 py-2 break-all">
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
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-7">
                <TabsTrigger value="html" className="text-[10px]">HTML</TabsTrigger>
                <TabsTrigger value="css" className="text-[10px]">CSS</TabsTrigger>
              </TabsList>
            </Tabs>
            <Textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              className="flex-1 font-mono text-[11px] bg-neutral-950 text-green-400 p-3 rounded-lg min-h-[300px] resize-none"
              spellCheck={false}
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {generatedClasses.split(' ').filter(Boolean).length} osztály
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setCodeText(generatedCode)}>
                  Visszaállítás
                </Button>
                <Button size="sm" className="h-7 text-[10px]" onClick={handleCopyCode}>
                  Másolás
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Breakpoint Selector */}
            <div className="flex items-center justify-between mb-3">
              <BreakpointSelector 
                value={breakpoint} 
                onChange={(v) => setBreakpoint(v as Breakpoint)}
                options={BREAKPOINTS}
              />
              <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
                <Laptop className="w-3 h-3" />
                <span>{breakpoint === 'base' ? 'All' : breakpoint.toUpperCase()}</span>
              </span>
            </div>

            <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="space-y-1">
              
              {/* Element Info */}
              <AccordionItem value="element" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Box className="w-3 h-3" />
                    <span>Element</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <Select value={state.tag} onValueChange={(v) => updateState('tag', v)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {TAG_OPTIONS.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <IconInput 
                    icon={<Hash className="w-3 h-3" />}
                    placeholder="element-id"
                    value={state.elementId}
                    onChange={(v) => updateState('elementId', v)}
                  />
                  <IconInput 
                    icon={<Link className="w-3 h-3" />}
                    placeholder="https://..."
                    value={state.link}
                    onChange={(v) => updateState('link', v)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Text Content */}
              <AccordionItem value="text" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Type className="w-3 h-3" />
                    <span>Szöveg tartalom</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <Textarea 
                    value={state.textContent} 
                    onChange={(e) => updateState('textContent', e.target.value)}
                    className="text-xs min-h-[60px] resize-none"
                    placeholder="Szöveg..."
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
                <AccordionContent className="pb-2">
                  <SpacingGrid 
                    values={state.padding}
                    onChange={(key, value) => updateNestedState('padding', key, value)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Margin */}
              <AccordionItem value="margin" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3 h-3" />
                    <span>Külső margó (Margin)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="X" value={state.margin.x} onChange={(v) => updateNestedState('margin', 'x', v)} />
                    <LabeledInput label="Y" value={state.margin.y} onChange={(v) => updateNestedState('margin', 'y', v)} />
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
                  <StyledSelect 
                    value={state.position.type} 
                    onChange={(v) => updateNestedState('position', 'type', v)}
                    options={POSITION_OPTIONS}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="L" value={state.position.l} onChange={(v) => updateNestedState('position', 'l', v)} />
                    <LabeledInput label="T" value={state.position.t} onChange={(v) => updateNestedState('position', 't', v)} />
                    <LabeledInput label="R" value={state.position.r} onChange={(v) => updateNestedState('position', 'r', v)} />
                    <LabeledInput label="B" value={state.position.b} onChange={(v) => updateNestedState('position', 'b', v)} />
                  </div>
                  <LabeledInput label="Z-Index" value={state.position.zIndex} onChange={(v) => updateNestedState('position', 'zIndex', v)} />
                </AccordionContent>
              </AccordionItem>

              {/* Size */}
              <AccordionItem value="size" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Méret
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <IconInput icon={<UnfoldHorizontal className="w-3 h-3" />} placeholder="Szélesség" value={state.size.width} onChange={(v) => updateNestedState('size', 'width', v)} />
                    <IconInput icon={<UnfoldVertical className="w-3 h-3" />} placeholder="Magasság" value={state.size.height} onChange={(v) => updateNestedState('size', 'height', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="Max W" value={state.size.maxWidth} onChange={(v) => updateNestedState('size', 'maxWidth', v)} />
                    <LabeledInput label="Max H" value={state.size.maxHeight} onChange={(v) => updateNestedState('size', 'maxHeight', v)} />
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
                    <StyledSelect value={state.typography.fontFamily} onChange={(v) => updateNestedState('typography', 'fontFamily', v)} options={FONT_FAMILY_OPTIONS} />
                    <StyledSelect value={state.typography.fontWeight} onChange={(v) => updateNestedState('typography', 'fontWeight', v)} options={FONT_WEIGHT_OPTIONS} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="Size" value={state.typography.fontSize} onChange={(v) => updateNestedState('typography', 'fontSize', v)} />
                    <LabeledInput label="Line H" value={state.typography.lineHeight} onChange={(v) => updateNestedState('typography', 'lineHeight', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <StyledSelect value={state.typography.letterSpacing} onChange={(v) => updateNestedState('typography', 'letterSpacing', v)} options={LETTER_SPACING_OPTIONS} />
                    <StyledSelect value={state.typography.textAlign} onChange={(v) => updateNestedState('typography', 'textAlign', v)} options={TEXT_ALIGN_OPTIONS} />
                  </div>
                  <ColorButton color={state.typography.textColor} onChange={(c) => updateNestedState('typography', 'textColor', c)} label="Szöveg szín" />
                </AccordionContent>
              </AccordionItem>

              {/* Appearance */}
              <AccordionItem value="appearance" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3 h-3" />
                    <span>Megjelenés</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <ColorButton color={state.appearance.backgroundColor} onChange={(c) => updateNestedState('appearance', 'backgroundColor', c)} label="Háttér" />
                    <button className="h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card opacity-50">
                      <Image className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs truncate">Kép</span>
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
                    <ColorButton color={state.border.color} onChange={(c) => updateNestedState('border', 'color', c)} label="Border" />
                    <ColorButton color={state.border.ringColor} onChange={(c) => updateNestedState('border', 'ringColor', c)} label="Ring" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="Width" value={state.border.width} onChange={(v) => updateNestedState('border', 'width', v)} />
                    <StyledSelect value={state.border.style} onChange={(v) => updateNestedState('border', 'style', v)} options={BORDER_STYLE_OPTIONS} />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground mb-1.5 block">Lekerekítés</span>
                    <Tabs value={borderRadiusTab} onValueChange={(v) => setBorderRadiusTab(v as BorderRadiusTab)} className="w-full">
                      <TabsList className="grid grid-cols-5 h-7">
                        {(['all', 'tl', 'tr', 'br', 'bl'] as const).map(tab => (
                          <TabsTrigger key={tab} value={tab} className="text-[10px] px-2">{tab.toUpperCase()}</TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                    <SliderControl
                      icon={<Circle className="w-2.5 h-2.5" />}
                      label={`Sugár ${borderRadiusTab.toUpperCase()}`}
                      value={state.border.radius[borderRadiusTab]}
                      onChange={(v) => updateDeepNestedState('border', 'radius', borderRadiusTab, v)}
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
                  <StyledSelect value={state.effects.shadow} onChange={(v) => updateNestedState('effects', 'shadow', v)} options={SHADOW_OPTIONS} />
                  <SliderControl icon={<Eye className="w-2.5 h-2.5" />} label="Átlátszatlanság" value={state.effects.opacity} onChange={(v) => updateNestedState('effects', 'opacity', v)} min={0} max={100} unit="%" />
                  <SliderControl icon={<Droplet className="w-2.5 h-2.5" />} label="Blur" value={state.effects.blur} onChange={(v) => updateNestedState('effects', 'blur', v)} min={0} max={100} unit="px" />
                  <SliderControl icon={<Droplet className="w-2.5 h-2.5" />} label="Backdrop Blur" value={state.effects.backdropBlur} onChange={(v) => updateNestedState('effects', 'backdropBlur', v)} min={0} max={100} unit="px" />
                  <SliderControl icon={<Contrast className="w-2.5 h-2.5" />} label="Hue Rotate" value={state.effects.hueRotate} onChange={(v) => updateNestedState('effects', 'hueRotate', v)} min={0} max={360} unit="°" showGradient gradientColors="linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" />
                  <SliderControl icon={<Sun className="w-2.5 h-2.5" />} label="Saturation" value={state.effects.saturation} onChange={(v) => updateNestedState('effects', 'saturation', v)} min={0} max={200} unit="%" />
                  <SliderControl icon={<Sun className="w-2.5 h-2.5" />} label="Brightness" value={state.effects.brightness} onChange={(v) => updateNestedState('effects', 'brightness', v)} min={0} max={200} unit="%" />
                  <SliderControl icon={<Contrast className="w-2.5 h-2.5" />} label="Contrast" value={state.effects.contrast} onChange={(v) => updateNestedState('effects', 'contrast', v)} min={0} max={200} unit="%" />
                  <SliderControl icon={<FlipHorizontal className="w-2.5 h-2.5" />} label="Grayscale" value={state.effects.grayscale} onChange={(v) => updateNestedState('effects', 'grayscale', v)} min={0} max={100} unit="%" />
                  <SliderControl icon={<FlipHorizontal className="w-2.5 h-2.5" />} label="Invert" value={state.effects.invert} onChange={(v) => updateNestedState('effects', 'invert', v)} min={0} max={100} unit="%" />
                </AccordionContent>
              </AccordionItem>

              {/* Transforms */}
              <AccordionItem value="transforms" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Transzformáció
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<Move className="w-2.5 h-2.5" />} label="Translate X" value={state.transforms.translateX} onChange={(v) => updateNestedState('transforms', 'translateX', v)} min={-200} max={200} unit="px" />
                    <SliderControl icon={<Move className="w-2.5 h-2.5" />} label="Translate Y" value={state.transforms.translateY} onChange={(v) => updateNestedState('transforms', 'translateY', v)} min={-200} max={200} unit="px" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<Zap className="w-2.5 h-2.5" />} label="Skew X" value={state.transforms.skewX} onChange={(v) => updateNestedState('transforms', 'skewX', v)} min={-45} max={45} unit="°" />
                    <SliderControl icon={<Zap className="w-2.5 h-2.5" />} label="Skew Y" value={state.transforms.skewY} onChange={(v) => updateNestedState('transforms', 'skewY', v)} min={-45} max={45} unit="°" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="Forgatás" value={state.transforms.rotate} onChange={(v) => updateNestedState('transforms', 'rotate', v)} min={-180} max={180} unit="°" />
                    <SliderControl icon={<Maximize className="w-2.5 h-2.5" />} label="Skálázás" value={state.transforms.scale} onChange={(v) => updateNestedState('transforms', 'scale', v)} min={50} max={200} unit="%" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 3D Transforms */}
              <AccordionItem value="transforms3d" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  3D Transzformáció
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="Rotate X" value={state.transforms3D.rotateX} onChange={(v) => updateNestedState('transforms3D', 'rotateX', v)} min={-180} max={180} unit="°" />
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="Rotate Y" value={state.transforms3D.rotateY} onChange={(v) => updateNestedState('transforms3D', 'rotateY', v)} min={-180} max={180} unit="°" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="Rotate Z" value={state.transforms3D.rotateZ} onChange={(v) => updateNestedState('transforms3D', 'rotateZ', v)} min={-180} max={180} unit="°" />
                    <SliderControl 
                      icon={<Maximize className="w-2.5 h-2.5" />} 
                      label="Perspektíva" 
                      value={state.transforms3D.perspective} 
                      onChange={(v) => updateNestedState('transforms3D', 'perspective', v)} 
                      min={0} 
                      max={20}
                      unit=""
                      valueLabel={state.transforms3D.perspective === 0 ? "Nincs" : `${state.transforms3D.perspective * 100}px`}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tailwind Classes */}
              <AccordionItem value="tailwind" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Code className="w-3 h-3" />
                    <span>Tailwind osztályok</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <Textarea
                    placeholder="flex items-center gap-2..."
                    value={state.tailwindClasses.join(' ')}
                    onChange={(e) => updateState('tailwindClasses', e.target.value.split(' ').filter(Boolean))}
                    rows={2}
                    className="resize-none text-xs font-mono"
                  />
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
                    value={state.inlineCSS}
                    onChange={(e) => updateState('inlineCSS', e.target.value)}
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
        <span className="text-[10px] text-muted-foreground font-mono">
          #{state.elementId || 'element'}
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

// Re-export types and utilities
export * from './types';
export * from './constants';
export * from './hooks';
export * from './components';
export { PreviewBox } from './PreviewBox';

export default PropertyInspector;
