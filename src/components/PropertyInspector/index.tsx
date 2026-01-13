import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { RotateCcw, MousePointer2, Save, MoreHorizontal, X, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InspectorProvider, useInspector } from './InspectorContext';
import { EditTab } from './tabs/EditTab';
import { CodeTab } from './tabs/CodeTab';
import { PromptTab } from './tabs/PromptTab';
import { toast } from 'sonner';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

const PropertyInspectorContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const { state, undo, canUndo, resetState, generatedCode } = useInspector();

  const handleExportJSON = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inspector-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Configuration exported');
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const config = JSON.parse(text);
          localStorage.setItem('inspector-state', JSON.stringify(config));
          window.location.reload();
        } catch {
          toast.error('Invalid configuration file');
        }
      }
    };
    input.click();
  };

  const handleCopyTailwind = async () => {
    await navigator.clipboard.writeText(state.tailwindClasses);
    toast.success('Tailwind classes copied');
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    toast.success('Code copied');
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[600px] flex flex-col">
      {/* Header - Drag Handle */}
      <div className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 rounded-t-2xl flex-shrink-0 cursor-move inspector-drag-handle">
        <div className="flex items-center gap-2">
          <h3 className="text-xs uppercase font-medium text-muted-foreground">{state.elementTag}</h3>
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
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" title="Select Mode">
            <MousePointer2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={handleExportJSON}
            title="Save Configuration"
          >
            <Save className="w-3 h-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportJSON}>
                <Download className="w-3 h-3 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportJSON}>
                <Upload className="w-3 h-3 mr-2" />
                Import Configuration
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopyTailwind}>
                Copy as Tailwind
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyCode}>
                Copy as Code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetState} className="text-destructive">
                <Trash2 className="w-3 h-3 mr-2" />
                Reset All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onClose}>
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {activeTab === 'PROMPT' ? (
          <PromptTab />
        ) : activeTab === 'CODE' ? (
          <CodeTab />
        ) : (
          <EditTab />
        )}
      </div>
    </div>
  );
};

export const PropertyInspector: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('inspector-position');
    if (saved) {
      setPosition(JSON.parse(saved));
    } else {
      // Default position: right side of screen
      setPosition({ x: window.innerWidth - 360, y: 50 });
    }
  }, []);

  const handleDrag = (_: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem('inspector-position', JSON.stringify(newPosition));
  };

  if (!isClient) return null;

  return (
    <InspectorProvider>
      <Draggable
        handle=".inspector-drag-handle"
        position={position}
        onStop={handleDrag}
        bounds="parent"
      >
        <div className="fixed z-50">
          <PropertyInspectorContent onClose={onClose} />
        </div>
      </Draggable>
    </InspectorProvider>
  );
};

export default PropertyInspector;
