import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import Editor from '@monaco-editor/react';
import { HexColorPicker } from 'react-colorful';
import {
  RotateCcw, MousePointer2, Save, MoreHorizontal, X, ChevronDown,
  Laptop, Move, RotateCw, Maximize, WandSparkles, Sparkles, 
  Paperclip, Figma, Send, CodeXml
} from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { useToast } from '@/hooks/use-toast';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

interface PropertyInspectorProps {
  onClose?: () => void;
}

export const PropertyInspector = ({ onClose }: PropertyInspectorProps) => {
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const [promptText, setPromptText] = useState('');
  const [codeText, setCodeText] = useState('<h2 class="text-[18px] md:text-[20px] font-semibold tracking-tight pr-2 pb-3 pl-2">Layers</h2>');
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const { toast } = useToast();

  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size] = useState({ width: 380, height: 600 });

  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#e5e5e5');
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(100);
  const [rotate3dX, setRotate3dX] = useState(0);
  const [rotate3dY, setRotate3dY] = useState(0);

  useEffect(() => {
    const savedPosition = localStorage.getItem('propertyInspectorPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  const handleDrag = (_e: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem('propertyInspectorPosition', JSON.stringify(newPosition));
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsStreaming(true);
    setAiResponse('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          selectedElement: 'h2'
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get AI response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              setAiResponse(prev => prev + content);
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      toast({
        title: "AI Response Complete",
        description: "Review the suggestions and apply if needed.",
      });
    } catch (error) {
      console.error('AI prompt error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <Draggable
      handle=".drag-handle"
      position={position}
      onStop={handleDrag}
      bounds="parent"
    >
      <div 
        className="absolute z-20 bg-background border border-border rounded-2xl shadow-xl flex flex-col"
        style={{ width: `${size.width}px`, maxHeight: `${size.height}px` }}
      >
        {/* Header */}
        <div className="drag-handle flex items-center justify-between border-b border-border py-2 px-4 bg-muted rounded-t-2xl flex-shrink-0 cursor-grab active:cursor-grabbing select-none">
          <div className="flex items-center gap-2">
            <h3 className="text-xs uppercase font-medium text-muted-foreground">h2</h3>
            <div className="flex border border-border/50 rounded-md overflow-hidden">
              <button
                onClick={() => setActiveTab('EDIT')}
                className={`px-2 py-1 text-[8px] font-medium transition-colors ${
                  activeTab === 'EDIT'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-accent'
                }`}
              >
                EDIT
              </button>
              <button
                onClick={() => setActiveTab('PROMPT')}
                className={`px-2 py-1 text-[8px] font-medium transition-colors border-l border-border ${
                  activeTab === 'PROMPT'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-accent'
                }`}
              >
                PROMPT
              </button>
              <button
                onClick={() => setActiveTab('CODE')}
                className={`px-2 py-1 text-[8px] font-medium transition-colors border-l border-border ${
                  activeTab === 'CODE'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-accent'
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={onClose}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'PROMPT' && (
            <form onSubmit={handlePromptSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Describe what you want to change:
                </label>
                <div className="relative">
                  <Textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Adapt to dark mode, add details, make adaptive, change text to..."
                    className="w-full resize-none min-h-[100px] max-h-[200px] text-xs pb-[40px] rounded-2xl"
                    disabled={isStreaming}
                  />
                  <div className="absolute bottom-[16px] left-[9px] z-10 flex gap-1">
                    <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[10px]">
                      <WandSparkles className="h-3 w-3" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[10px] gap-1">
                      <Sparkles className="h-3 w-3" />
                      GPT-5
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[10px]">
                      <Paperclip className="h-3 w-3" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[10px]">
                      <Figma className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {aiResponse && (
                <div className="p-3 bg-muted rounded-lg text-xs">
                  <p className="text-muted-foreground whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1 gap-2 h-8 text-xs"
                  disabled={isStreaming || !promptText.trim()}
                >
                  <Send className="w-3 h-3" />
                  {isStreaming ? 'Processing...' : 'Apply Changes'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-8 text-xs"
                  onClick={() => setPromptText('')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'CODE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                  <CodeXml className="h-2.5 w-2.5" />
                  Code Snippets
                </Button>
              </div>
              <div className="border border-border rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  value={codeText}
                  onChange={(value) => setCodeText(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-[10px] text-muted-foreground">No changes</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-[10px]">
                    Reset
                  </Button>
                  <Button size="sm" className="h-7 text-[10px]">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'EDIT' && (
            <Accordion type="multiple" defaultValue={['typography', 'appearance', 'transforms']} className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex border border-border rounded-md overflow-hidden h-6">
                  <button className="px-2 text-[9px] bg-primary text-primary-foreground">AUTO</button>
                  <button className="px-2 text-[9px] bg-background text-muted-foreground border-l border-border">*</button>
                  <button className="px-2 text-[9px] bg-accent text-accent-foreground border-l border-border">MD</button>
                </div>
                <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
                  <Laptop className="w-3 h-3" />
                  Auto Breakpoint
                </span>
              </div>

              <AccordionItem value="typography" className="border-b border-border">
                <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2">
                  Typography
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <select className="w-full h-7 text-xs px-3 py-1 rounded-md border border-border bg-background">
                      <option>Inter</option>
                      <option>Arial</option>
                    </select>
                    <select className="w-full h-7 text-xs px-3 py-1 rounded-md border border-border bg-background">
                      <option>Semibold</option>
                      <option>Bold</option>
                    </select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="appearance" className="border-b border-border">
                <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2">
                  Appearance
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-7 justify-start gap-2 px-2 text-xs">
                          <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: bgColor }}></div>
                          <span className="truncate">Background</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <HexColorPicker color={bgColor} onChange={setBgColor} />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-7 justify-start gap-2 px-2 text-xs">
                          <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: borderColor }}></div>
                          <span className="truncate">Border</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <HexColorPicker color={borderColor} onChange={setBorderColor} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="transforms" className="border-b border-border">
                <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2">
                  Transforms
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Move className="w-2.5 h-2.5" />
                          <span className="text-[10px] font-medium text-muted-foreground">Translate X</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{translateX}</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        value={translateX}
                        onChange={(e) => setTranslateX(Number(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Move className="w-2.5 h-2.5" />
                          <span className="text-[10px] font-medium text-muted-foreground">Translate Y</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{translateY}</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        value={translateY}
                        onChange={(e) => setTranslateY(Number(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <RotateCw className="w-2.5 h-2.5" />
                          <span className="text-[10px] font-medium text-muted-foreground">Rotate</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{rotate}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={rotate}
                        onChange={(e) => setRotate(Number(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Maximize className="w-2.5 h-2.5" />
                          <span className="text-[10px] font-medium text-muted-foreground">Scale</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{scale}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="3d-transforms" className="border-b border-border">
                <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2">
                  3D Transforms
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <RotateCw className="w-2.5 h-2.5" />
                          <span className="text-[10px] font-medium text-muted-foreground">Rotate X</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{rotate3dX}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={rotate3dX}
                        onChange={(e) => setRotate3dX(Number(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <RotateCw className="w-2.5 h-2.5" />
                          <span className="text-[10px] font-medium text-muted-foreground">Rotate Y</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{rotate3dY}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={rotate3dY}
                        onChange={(e) => setRotate3dY(Number(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
    </Draggable>
  );
};
