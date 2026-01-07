// PropertyInspector Toolbar - Memoized header with actions

import React, { memo } from 'react';
import {
  RotateCcw, Save, MoreHorizontal, Download, Upload,
  Layers, Settings, Palette, Sparkles, Code2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import type { ToolbarProps } from './types';

export const InspectorToolbar = memo<ToolbarProps>(({
  tag,
  activeTab,
  onTabChange,
  onReset,
  onSave,
  onExport,
  onImport
}) => {
  return (
    <header className="drag-handle cursor-move flex items-center justify-between border-b border-border py-2 px-3 bg-secondary/50 rounded-t-2xl flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-medium text-muted-foreground bg-primary/20 px-1.5 py-0.5 rounded">
          {tag}
        </span>
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as typeof activeTab)}>
          <TabsList className="h-6">
            <TabsTrigger value="EDIT" className="text-[9px] px-2 h-5">
              <Palette className="w-3 h-3 mr-1" />
              EDIT
            </TabsTrigger>
            <TabsTrigger value="PROMPT" className="text-[9px] px-2 h-5">
              <Sparkles className="w-3 h-3 mr-1" />
              AI
            </TabsTrigger>
            <TabsTrigger value="CODE" className="text-[9px] px-2 h-5">
              <Code2 className="w-3 h-3 mr-1" />
              CODE
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex items-center gap-0.5">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5" 
          onClick={onReset} 
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5" 
          onClick={onSave} 
          title="Save"
        >
          <Save className="w-3 h-3" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>
              <Download className="w-3 h-3 mr-2" />
              Export Configuration
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onImport}>
              <Upload className="w-3 h-3 mr-2" />
              Import Configuration
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Layers className="w-3 h-3 mr-2" />
              Templates (coming soon)
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="w-3 h-3 mr-2" />
              Preferences (coming soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});

InspectorToolbar.displayName = 'InspectorToolbar';
