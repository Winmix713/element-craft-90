import React, { useState } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label = 'Color',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasColor = color && color !== '';

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card hover:bg-secondary transition-colors ${
            !hasColor ? 'opacity-50' : ''
          }`}
        >
          <div
            className="w-4 h-4 rounded-full border border-border"
            style={{
              backgroundColor: hasColor ? color : 'transparent',
              backgroundImage: !hasColor
                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                : undefined,
              backgroundSize: !hasColor ? '4px 4px' : undefined,
              backgroundPosition: !hasColor ? '0 0, 0 2px, 2px -2px, -2px 0px' : undefined,
            }}
          />
          <span className="text-xs truncate">
            {hasColor ? color : `No ${label}`}
          </span>
          {hasColor && (
            <X
              className="w-3 h-3 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-3">
          <HexColorPicker color={color || '#000000'} onChange={onChange} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">#</span>
            <HexColorInput
              color={color || ''}
              onChange={onChange}
              placeholder="000000"
              className="flex-1 h-7 px-2 text-xs border border-border rounded-md bg-background"
            />
          </div>
          <div className="flex gap-1">
            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#000000', '#ffffff'].map(
              (presetColor) => (
                <button
                  key={presetColor}
                  className="w-5 h-5 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => onChange(presetColor)}
                />
              )
            )}
          </div>
          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px]"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="h-6 text-[10px]"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
