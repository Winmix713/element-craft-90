import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useInspector } from './InspectorContext';
import { EditTab } from './tabs/EditTab';
import { CodeTab } from './tabs/CodeTab';
import { PromptTab } from './tabs/PromptTab';
import { toast } from 'sonner';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

const PropertyInspectorContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const { state, undo, canUndo, resetState, generatedCode } = useInspector();

  const handleExportJSON = useCallback(() => {
    try {
      const json = JSON.stringify(state, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inspector-config-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Configuration exported');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export configuration');
    }
  }, [state]);

  const handleImportJSON = useCallback(() => {
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
        } catch (error) {
          console.error('Import failed:', error);
          toast.error('Invalid configuration file');
        }
      }
    };
    input.click();
  }, []);

  const handleCopyTailwind = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(state.tailwindClasses);
      toast.success('Tailwind classes copied');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy to clipboard');
    }
  }, [state.tailwindClasses]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success('Code copied');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy to clipboard');
    }
  }, [generatedCode]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'PROMPT':
        return <PromptTab />;
      case 'CODE':
        return <CodeTab />;
      default:
        return <EditTab />;
    }
  }, [activeTab]);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[600px] flex flex-col">
      {/* Header - Drag Handle */}
      <div className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 rounded-t-2xl flex-shrink-0 cursor-move inspector-drag-handle">
        <div className="flex items-center gap-2">
          <h3 className="text-xs uppercase font-medium text-muted-foreground">{state.elementTag}</h3>
          <div className="flex border border-border rounded-md overflow-hidden">
            <TabButton
              isActive={activeTab === 'EDIT'}
              onClick={() => setActiveTab('EDIT')}
              label="EDIT"
            />
            <TabButton
              isActive={activeTab === 'PROMPT'}
              onClick={() => setActiveTab('PROMPT')}
              label="PROMPT"
              hasBorder
            />
            <TabButton
              isActive={activeTab === 'CODE'}
              onClick={() => setActiveTab('CODE')}
              label="CODE"
              hasBorder
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={undo}
            disabled={!canUndo}
            title="Undo last change"
            aria-label="Undo"
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
            aria-label="Save"
          >
            <Save className="w-3 h-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" aria-label="More options">
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
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={onClose}
              aria-label="Close inspector"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {tabContent}
      </div>
    </div>
  );
};

// Memoized tab button component to prevent unnecessary re-renders
const TabButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  label: string;
  hasBorder?: boolean;
}> = React.memo(({ isActive, onClick, label, hasBorder }) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 text-[8px] font-medium transition-colors cursor-pointer ${
      isActive
        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
        : 'bg-card text-muted-foreground hover:bg-secondary'
    } ${hasBorder ? 'border-l border-border' : ''}`}
    role="tab"
    aria-selected={isActive}
  >
    {label}
  </button>
));

TabButton.displayName = 'TabButton';

export const PropertyInspector: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('inspector-position');
      if (saved) {
        setPosition(JSON.parse(saved));
      } else {
        // Default position: right side of screen
        setPosition({ x: Math.max(window.innerWidth - 360, 20), y: 50 });
      }
    } catch (error) {
      console.error('Failed to load inspector position:', error);
      setPosition({ x: Math.max(window.innerWidth - 360, 20), y: 50 });
    }
  }, []);

  const handleDrag = useCallback((_: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    try {
      localStorage.setItem('inspector-position', JSON.stringify(newPosition));
    } catch (error) {
      console.error('Failed to save inspector position:', error);
    }
  }, []);

  if (!isClient) return null;

  return (
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
  );
};

export default PropertyInspector;
