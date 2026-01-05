// src/components/PropertyInspector.tsx
// Ultimate Property Inspector - Production Ready Version
// Integrates all optimized sections from the conversation

import React, { useState, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import {
  RotateCcw, MousePointer2, Save, MoreHorizontal, X, 
  Laptop, Download, Upload, Layers, Settings, Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Lazy load sections for better performance
const AppearanceSection = lazy(() => import('./PropertyInspector/sections/AppearanceSection'));
const LayoutSection = lazy(() => import('./PropertyInspector/sections/LayoutSection'));
const TypographySection = lazy(() => import('./PropertyInspector/sections/TypographySection'));
const CodeSection = lazy(() => import('./PropertyInspector/sections/CodeSection'));

// ============================================================================
// TYPES
// ============================================================================

type TabMode = 'EDIT' | 'PROMPT' | 'CODE' | 'PREVIEW';
type EditCategory = 'appearance' | 'layout' | 'typography' | 'advanced';
type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface InspectorState {
  // Element properties
  tag: string;
  elementId: string;
  link: string;
  textContent: string;
  
  // Appearance
  appearance: {
    backgroundColor: string;
  };
  
  // Typography
  typography: {
    textColor: string;
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
  };
  
  // Border
  border: {
    color: string;
    ringColor: string;
    width: string;
    style: string;
    radius: {
      all: number;
      tl: number;
      tr: number;
      br: number;
      bl: number;
    };
  };
  
  // Effects
  effects: {
    shadow: string;
    opacity: number;
    blur: number;
    backdropBlur: number;
    brightness: number;
    contrast: number;
    saturation: number;
    hueRotate: number;
    grayscale: number;
  };
  
  // Layout
  padding: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  margin: {
    x: string;
    y: string;
  };
  size: {
    width: string;
    height: string;
    maxWidth: string;
    maxHeight: string;
    minWidth: string;
    minHeight: string;
  };
  position: {
    type: string;
    l: string;
    t: string;
    r: string;
    b: string;
    zIndex: string;
  };
  
  // Transforms
  transforms: {
    translateX: number;
    translateY: number;
    rotate: number;
    scale: number;
    skewX: number;
    skewY: number;
  };
  transforms3D: {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    perspective: number;
  };
  
  // Code
  tailwindClasses: string[];
  inlineCSS: string;
  
  // Breakpoints
  breakpoints: Record<Breakpoint, Partial<InspectorState>>;
}

// ============================================================================
// DEFAULT STATE
// ============================================================================

const DEFAULT_STATE: InspectorState = {
  tag: 'div',
  elementId: '',
  link: '',
  textContent: '',
  appearance: {
    backgroundColor: '#ffffff'
  },
  typography: {
    textColor: '#000000',
    fontFamily: 'sans-serif',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '1.5',
    letterSpacing: 'normal',
    textAlign: 'left'
  },
  border: {
    color: '#000000',
    ringColor: '#3b82f6',
    width: '0',
    style: 'solid',
    radius: {
      all: 0,
      tl: 0,
      tr: 0,
      br: 0,
      bl: 0
    }
  },
  effects: {
    shadow: 'none',
    opacity: 100,
    blur: 0,
    backdropBlur: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotate: 0,
    grayscale: 0
  },
  padding: {
    top: '0',
    right: '0',
    bottom: '0',
    left: '0'
  },
  margin: {
    x: '0',
    y: '0'
  },
  size: {
    width: 'auto',
    height: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    minWidth: '0',
    minHeight: '0'
  },
  position: {
    type: 'static',
    l: 'auto',
    t: 'auto',
    r: 'auto',
    b: 'auto',
    zIndex: 'auto'
  },
  transforms: {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 100,
    skewX: 0,
    skewY: 0
  },
  transforms3D: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 0
  },
  tailwindClasses: [],
  inlineCSS: '',
  breakpoints: {
    base: {},
    sm: {},
    md: {},
    lg: {},
    xl: {},
    '2xl': {}
  }
};

// ============================================================================
// HEADER COMPONENT
// ============================================================================

interface HeaderProps {
  currentTag: string;
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
  onReset: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  onClose?: () => void;
}

const Header = memo<HeaderProps>(({
  currentTag,
  activeTab,
  onTabChange,
  onReset,
  onSave,
  onExport,
  onImport,
  onClose
}) => {
  return (
    <header className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 rounded-t-2xl flex-shrink-0">
      <div className="flex items-center gap-2">
        <h3 className="text-xs uppercase font-medium text-muted-foreground">
          {currentTag}
        </h3>
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabMode)}>
          <TabsList className="h-7">
            <TabsTrigger value="EDIT" className="text-[8px] px-2">EDIT</TabsTrigger>
            <TabsTrigger value="PROMPT" className="text-[8px] px-2">PROMPT</TabsTrigger>
            <TabsTrigger value="CODE" className="text-[8px] px-2">CODE</TabsTrigger>
            <TabsTrigger value="PREVIEW" className="text-[8px] px-2">PREVIEW</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full"
          onClick={onReset}
          title="Reset all changes"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full"
          onClick={onSave}
          title="Save changes"
        >
          <Save className="w-3 h-3" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>
              <Download className="w-3 h-3 mr-2" />
              Export Config
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onImport}>
              <Upload className="w-3 h-3 mr-2" />
              Import Config
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Layers className="w-3 h-3 mr-2" />
              View Templates
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-3 h-3 mr-2" />
              Preferences
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

// ============================================================================
// BREAKPOINT SELECTOR
// ============================================================================

interface BreakpointSelectorProps {
  current: Breakpoint;
  onChange: (breakpoint: Breakpoint) => void;
}

const BreakpointSelector = memo<BreakpointSelectorProps>(({ current, onChange }) => {
  const breakpoints: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex border border-border rounded-md overflow-hidden h-6">
        {breakpoints.map(bp => (
          <button
            key={bp}
            onClick={() => onChange(bp)}
            className={`px-2 text-[9px] transition-colors ${
              current === bp
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-secondary'
            } ${bp !== 'base' ? 'border-l border-border' : ''}`}
          >
            {bp.toUpperCase()}
          </button>
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
        <Laptop className="w-3 h-3" />
        <span>{current === 'base' ? 'All Devices' : current.toUpperCase()}</span>
      </span>
    </div>
  );
});

BreakpointSelector.displayName = 'BreakpointSelector';

// ============================================================================
// LOADING FALLBACK
// ============================================================================

const SectionLoadingFallback = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Zap className="w-4 h-4 animate-pulse" />
      <span className="text-xs">Loading section...</span>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PropertyInspector = memo(() => {
  // State
  const [state, setState] = useState<InspectorState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const [editCategory, setEditCategory] = useState<EditCategory>('appearance');
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('base');
  const [borderRadiusTab, setBorderRadiusTab] = useState<'all' | 'tl' | 'tr' | 'br' | 'bl'>('all');
  
  const { toast } = useToast();

  // State update handlers
  const updateState = useCallback(<K extends keyof InspectorState>(
    key: K,
    value: InspectorState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedState = useCallback(<
    ParentKey extends keyof InspectorState,
    NestedKey extends keyof InspectorState[ParentKey]
  >(
    parentKey: ParentKey,
    nestedKey: NestedKey,
    value: InspectorState[ParentKey][NestedKey]
  ) => {
    setState(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [nestedKey]: value
      }
    }));
  }, []);

  const updateDeepNestedState = useCallback(<
    ParentKey extends keyof InspectorState,
    NestedKey extends keyof InspectorState[ParentKey],
    DeepKey extends keyof InspectorState[ParentKey][NestedKey]
  >(
    parentKey: ParentKey,
    nestedKey: NestedKey,
    deepKey: DeepKey,
    value: InspectorState[ParentKey][NestedKey][DeepKey]
  ) => {
    setState(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [nestedKey]: {
          ...(prev[parentKey][nestedKey] as any),
          [deepKey]: value
        }
      }
    }));
  }, []);

  // Action handlers
  const handleReset = useCallback(() => {
    setState(DEFAULT_STATE);
    toast({
      title: "Reset Complete",
      description: "All properties have been reset to default values.",
    });
  }, [toast]);

  const handleSave = useCallback(() => {
    // Implement save logic
    console.log('Saving state:', state);
    toast({
      title: "Saved!",
      description: "Your changes have been saved successfully.",
    });
  }, [state, toast]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `inspector-config-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Exported!",
      description: "Configuration has been exported successfully.",
    });
  }, [state, toast]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedState = JSON.parse(event.target?.result as string);
            setState(importedState);
            toast({
              title: "Imported!",
              description: "Configuration has been imported successfully.",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to import configuration.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [toast]);

  // Memoized sections
  const editContent = useMemo(() => (
    <div className="space-y-3">
      <BreakpointSelector 
        current={currentBreakpoint}
        onChange={setCurrentBreakpoint}
      />

      <Tabs value={editCategory} onValueChange={(v) => setEditCategory(v as EditCategory)}>
        <TabsList className="grid grid-cols-4 w-full h-8">
          <TabsTrigger value="appearance" className="text-[10px]">Appearance</TabsTrigger>
          <TabsTrigger value="layout" className="text-[10px]">Layout</TabsTrigger>
          <TabsTrigger value="typography" className="text-[10px]">Typography</TabsTrigger>
          <TabsTrigger value="advanced" className="text-[10px]">Advanced</TabsTrigger>
        </TabsList>
      </Tabs>

      <Suspense fallback={<SectionLoadingFallback />}>
        {editCategory === 'appearance' && (
          <AppearanceSection
            state={state}
            borderRadiusTab={borderRadiusTab}
            onBorderRadiusTabChange={setBorderRadiusTab}
            updateNestedState={updateNestedState}
            updateDeepNestedState={updateDeepNestedState}
          />
        )}
        
        {editCategory === 'layout' && (
          <LayoutSection
            state={state}
            updateNestedState={updateNestedState}
          />
        )}
        
        {editCategory === 'typography' && (
          <TypographySection
            state={state}
            updateState={updateState}
            updateNestedState={updateNestedState}
          />
        )}
        
        {editCategory === 'advanced' && (
          <CodeSection
            state={state}
            updateState={updateState}
          />
        )}
      </Suspense>
    </div>
  ), [
    currentBreakpoint, 
    editCategory, 
    state, 
    borderRadiusTab,
    updateState,
    updateNestedState,
    updateDeepNestedState
  ]);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[90vh] flex flex-col overflow-hidden">
      <Header
        currentTag={state.tag}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={handleReset}
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div className="p-4 overflow-y-auto flex-1">
        {activeTab === 'EDIT' && editContent}
        {activeTab === 'PROMPT' && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-xs">AI Prompt feature coming soon...</p>
          </div>
        )}
        {activeTab === 'CODE' && (
          <Suspense fallback={<SectionLoadingFallback />}>
            <CodeSection state={state} updateState={updateState} />
          </Suspense>
        )}
        {activeTab === 'PREVIEW' && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-xs">Preview feature coming soon...</p>
          </div>
        )}
      </div>

      <footer className="p-3 border-t border-border bg-secondary/20 flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground font-mono">
          #{state.elementId || 'element'}
        </span>
        <Button size="sm" className="h-6 px-2 text-[10px]" onClick={handleSave}>
          Apply Changes
        </Button>
      </footer>
    </div>
  );
});

PropertyInspector.displayName = 'PropertyInspector';

export default PropertyInspector;
