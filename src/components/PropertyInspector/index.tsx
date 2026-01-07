// PropertyInspector - Main component with lazy loading and performance optimizations

import React, { lazy, Suspense, useState, useCallback, useMemo, memo } from 'react';
import { Sparkles, Palette, Layout, Type, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import Draggable from 'react-draggable';

import type { TabMode, Breakpoint, EditCategory, ExportConfig } from './types';
import { DEFAULT_OPEN_SECTIONS, CONFIG_VERSION } from './constants';
import { 
  useInspectorState, 
  usePanelPosition,
  useExportConfig,
  useStatePersistence
} from './hooks';
import { SectionSkeleton, CategorySwitch } from './components';
import { InspectorToolbar } from './InspectorToolbar';
import { BreakpointSelector } from './BreakpointSelector';

// Lazy load sections for code splitting
const AppearanceSection = lazy(() => import('./sections/AppearanceSection'));
const LayoutSection = lazy(() => import('./sections/LayoutSection'));
const TypographySection = lazy(() => import('./sections/TypographySection'));
const CodeSection = lazy(() => import('./sections/CodeSection'));

// Category configuration
const CATEGORIES: readonly EditCategory[] = ['appearance', 'layout', 'typography', 'advanced'] as const;

const CATEGORY_ICONS: Record<EditCategory, React.ReactNode> = {
  appearance: <Palette className="w-3 h-3" />,
  layout: <Layout className="w-3 h-3" />,
  typography: <Type className="w-3 h-3" />,
  advanced: <Code2 className="w-3 h-3" />
};

export const PropertyInspector = memo(() => {
  const { 
    state, 
    setState, 
    updateState, 
    updateNestedState, 
    resetState 
  } = useInspectorState();
  
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const [activeCategory, setActiveCategory] = useState<EditCategory>('appearance');
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('base');
  const [expandedSections, setExpandedSections] = useState<string[]>(DEFAULT_OPEN_SECTIONS);
  const [promptText, setPromptText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const { position, updatePosition } = usePanelPosition();
  const { createExportConfig, validateImportConfig } = useExportConfig(state, currentBreakpoint);
  const { toast } = useToast();

  // Persist state to localStorage
  useStatePersistence(state);

  // Handle drag stop
  const handleDragStop = useCallback((_e: unknown, data: { x: number; y: number }) => {
    updatePosition({ x: data.x, y: data.y });
  }, [updatePosition]);

  // Action handlers
  const handleReset = useCallback(() => {
    resetState();
    toast({ title: "Reset Complete", description: "All properties reset to defaults." });
  }, [resetState, toast]);

  const handleSave = useCallback(() => {
    toast({ title: "Saved!", description: "Changes saved successfully." });
  }, [toast]);

  const handleExport = useCallback(() => {
    const config = createExportConfig();
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const filename = `inspector-config-${Date.now()}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    link.click();
    
    toast({ title: "Exported!", description: `Saved as ${filename}` });
  }, [createExportConfig, toast]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const config = JSON.parse(text) as ExportConfig;
        
        if (!validateImportConfig(config)) {
          throw new Error('Invalid configuration format');
        }
        
        setState(config.state);
        toast({ title: "Imported!", description: "Configuration loaded successfully." });
      } catch (error) {
        toast({ 
          title: "Import Failed", 
          description: error instanceof Error ? error.message : "Invalid file format",
          variant: "destructive" 
        });
      }
    };
    input.click();
  }, [setState, validateImportConfig, toast]);

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
    } catch (error) {
      toast({
        title: "AI Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsAiLoading(false);
    }
  }, [promptText, state, toast]);

  // Tab change handler
  const handleTabChange = useCallback((tab: TabMode) => {
    setActiveTab(tab);
  }, []);

  // Category change handler
  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat as EditCategory);
  }, []);

  // Section props memoized
  const sectionProps = useMemo(() => ({
    state,
    updateState,
    updateNestedState
  }), [state, updateState, updateNestedState]);

  return (
    <Draggable
      handle=".drag-handle"
      defaultPosition={position}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div className="bg-card border border-border rounded-2xl shadow-lg w-80 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Toolbar */}
        <InspectorToolbar
          tag={state.tag}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onReset={handleReset}
          onSave={handleSave}
          onExport={handleExport}
          onImport={handleImport}
        />

        {/* Content */}
        <div className="p-3 overflow-y-auto flex-1">
          {/* EDIT Tab */}
          {activeTab === 'EDIT' && (
            <div className="space-y-2">
              <BreakpointSelector 
                current={currentBreakpoint} 
                onChange={setCurrentBreakpoint} 
              />
              
              <CategorySwitch
                categories={CATEGORIES}
                active={activeCategory}
                onChange={handleCategoryChange}
                icons={CATEGORY_ICONS}
              />
              
              <Accordion 
                type="multiple" 
                value={expandedSections}
                onValueChange={setExpandedSections}
                className="space-y-1"
              >
                <Suspense fallback={<SectionSkeleton />}>
                  {activeCategory === 'appearance' && (
                    <AppearanceSection {...sectionProps} />
                  )}
                  {activeCategory === 'layout' && (
                    <LayoutSection {...sectionProps} />
                  )}
                  {activeCategory === 'typography' && (
                    <TypographySection {...sectionProps} />
                  )}
                </Suspense>
              </Accordion>
              
              {activeCategory === 'advanced' && (
                <Suspense fallback={<SectionSkeleton />}>
                  <CodeSection 
                    state={state} 
                    breakpoint={currentBreakpoint}
                    updateState={updateState}
                  />
                </Suspense>
              )}
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
              
              {/* AI Placeholder for future enhancements */}
              <div className="text-[10px] text-muted-foreground text-center py-2 border-t border-border/50 mt-4">
                More AI features coming soon...
              </div>
            </div>
          )}

          {/* CODE Tab */}
          {activeTab === 'CODE' && (
            <Suspense fallback={<SectionSkeleton />}>
              <CodeSection 
                state={state} 
                breakpoint={currentBreakpoint}
                updateState={updateState}
              />
            </Suspense>
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
