import { RotateCcw, MousePointer2, Save, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

interface InspectorHeaderProps {
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
  elementTag: string;
  onClose: () => void;
  onReset: () => void;
  onSave: () => void;
}

export const InspectorHeader = ({
  activeTab,
  onTabChange,
  elementTag,
  onClose,
  onReset,
  onSave,
}: InspectorHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 rounded-t-2xl flex-shrink-0 cursor-grab active:cursor-grabbing select-none drag-handle">
      <div className="flex items-center gap-2">
        <h3 className="text-xs uppercase font-medium text-muted-foreground">{elementTag}</h3>
        <div className="flex border border-border rounded-md overflow-hidden">
          {(['EDIT', 'PROMPT', 'CODE'] as TabMode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-2 py-1 text-[8px] font-medium transition-colors cursor-pointer ${
                tab !== 'EDIT' ? 'border-l border-border' : ''
              } ${
                activeTab === tab
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onReset}>
          <RotateCcw className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
          <MousePointer2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onSave}>
          <Save className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
          <MoreHorizontal className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
