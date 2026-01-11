import { useState } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerPopoverProps {
  color: string | null;
  onChange: (color: string | null) => void;
  label: string;
}

export const ColorPickerPopover = ({ color, onChange, label }: ColorPickerPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const recentColors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card hover:bg-secondary transition-colors ${
            !color ? 'opacity-50' : ''
          }`}
        >
          <div
            className="w-4 h-4 rounded-full border border-border"
            style={{ backgroundColor: color || 'transparent' }}
          />
          <span className="text-xs truncate">{color || 'No Color'}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3 space-y-3" align="start">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">{label}</label>
          <HexColorPicker color={color || '#000000'} onChange={onChange} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">#</span>
          <HexColorInput
            color={color || ''}
            onChange={onChange}
            className="flex-1 h-7 px-2 text-xs bg-secondary border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="000000"
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] text-muted-foreground">Recent</span>
          <div className="flex gap-1.5 flex-wrap">
            {recentColors.map((c) => (
              <button
                key={c}
                className="w-5 h-5 rounded-full border border-border hover:ring-2 hover:ring-primary/50 transition-all"
                style={{ backgroundColor: c }}
                onClick={() => {
                  onChange(c);
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 h-7 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
          >
            Clear
          </button>
          <button
            className="flex-1 h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
