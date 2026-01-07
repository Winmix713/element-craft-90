// Breakpoint Selector - Responsive breakpoint controls

import React, { memo, useCallback } from 'react';
import { Laptop } from 'lucide-react';
import type { Breakpoint, BreakpointSelectorProps } from './types';
import { BREAKPOINT_LIST } from './constants';

export const BreakpointSelector = memo<BreakpointSelectorProps>(({ current, onChange }) => {
  const handleClick = useCallback((bp: Breakpoint) => {
    onChange(bp);
  }, [onChange]);

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex border border-border rounded-md overflow-hidden h-6">
        {BREAKPOINT_LIST.map((bp, idx) => (
          <button
            key={bp}
            onClick={() => handleClick(bp)}
            className={`px-2 text-[9px] transition-colors ${
              current === bp
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-secondary'
            } ${idx > 0 ? 'border-l border-border' : ''}`}
          >
            {bp.toUpperCase()}
          </button>
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
        <Laptop className="w-3 h-3" />
      </span>
    </div>
  );
});

BreakpointSelector.displayName = 'BreakpointSelector';
