// Style Presets - Placeholder for preset system

import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

// Placeholder presets - to be expanded
const PRESETS: Preset[] = [
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple styling' },
  { id: 'glassmorphism', name: 'Glass', description: 'Frosted glass effect' },
  { id: 'neumorphism', name: 'Neumorphic', description: 'Soft UI shadows' },
  { id: 'brutalist', name: 'Brutalist', description: 'Bold, raw aesthetic' }
];

export const StylePresets = memo(() => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3 h-3" />
        <span>Style Presets</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            className="p-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-left"
            disabled
          >
            <div className="text-[10px] font-medium">{preset.name}</div>
            <div className="text-[9px] text-muted-foreground">{preset.description}</div>
          </button>
        ))}
      </div>
      
      <div className="text-[10px] text-muted-foreground text-center py-2 border-t border-border/50">
        Preset system coming soon...
      </div>
    </div>
  );
});

StylePresets.displayName = 'StylePresets';

// Hook placeholder for preset management
export function usePresetSystem() {
  const applyPreset = (presetId: string) => {
    console.log('Applying preset:', presetId);
    // Future: Apply preset to inspector state
  };

  const saveAsPreset = (name: string) => {
    console.log('Saving as preset:', name);
    // Future: Save current state as new preset
  };

  return { applyPreset, saveAsPreset, presets: PRESETS };
}
