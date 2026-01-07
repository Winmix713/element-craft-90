// PropertyInspector Shared UI Components

import React, { memo, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HexColorPicker } from 'react-colorful';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColorPickerProps, SliderRowProps } from './types';
import { COLOR_PRESETS } from './constants';

// Color Picker with presets
export const ColorPicker = memo<ColorPickerProps>(({ color, onChange, label }) => (
  <div className="space-y-1">
    <Label className="text-[10px] text-muted-foreground">{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full h-8 rounded-md border border-border flex items-center gap-2 px-2 hover:bg-secondary/50 transition-colors"
        >
          <div 
            className="w-5 h-5 rounded border border-border/50"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-mono text-muted-foreground">{color}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <HexColorPicker color={color} onChange={onChange} />
        <div className="mt-2 grid grid-cols-10 gap-1">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className="w-5 h-5 rounded border border-border/50 hover:scale-110 transition-transform"
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
        <Input
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 h-7 text-xs font-mono"
        />
      </PopoverContent>
    </Popover>
  </div>
));
ColorPicker.displayName = 'ColorPicker';

// Slider with label and value display
export const SliderRow = memo<SliderRowProps>(({ 
  label, value, onChange, min = 0, max = 100, step = 1, unit = '' 
}) => {
  const handleChange = useCallback((values: number[]) => {
    onChange(values[0]);
  }, [onChange]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <Label className="text-[10px] text-muted-foreground">{label}</Label>
        <span className="text-[10px] text-muted-foreground font-mono">{value}{unit}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
});
SliderRow.displayName = 'SliderRow';

// Styled Select component
interface StyledSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  label?: string;
}

export const StyledSelect = memo<StyledSelectProps>(({ 
  value, onValueChange, options, placeholder, label 
}) => (
  <div className="space-y-1">
    {label && <Label className="text-[10px] text-muted-foreground">{label}</Label>}
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-7 text-xs">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
));
StyledSelect.displayName = 'StyledSelect';

// Labeled Input
interface LabeledInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const LabeledInput = memo<LabeledInputProps>(({ 
  label, value, onChange, placeholder, className = '' 
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className={`space-y-1 ${className}`}>
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-7 text-xs"
      />
    </div>
  );
});
LabeledInput.displayName = 'LabeledInput';

// Spacing Grid for padding/margin
interface SpacingGridProps {
  values: { top: string; right: string; bottom: string; left: string };
  onChange: (side: 'top' | 'right' | 'bottom' | 'left', value: string) => void;
  label: string;
}

export const SpacingGrid = memo<SpacingGridProps>(({ values, onChange, label }) => (
  <div className="space-y-2">
    <Label className="text-[10px] text-muted-foreground">{label}</Label>
    <div className="grid grid-cols-4 gap-1">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <div key={side} className="space-y-1">
          <span className="text-[8px] text-muted-foreground uppercase block text-center">
            {side[0]}
          </span>
          <Input
            value={values[side]}
            onChange={(e) => onChange(side, e.target.value)}
            className="h-6 text-[10px] text-center px-1"
            placeholder="0"
          />
        </div>
      ))}
    </div>
  </div>
));
SpacingGrid.displayName = 'SpacingGrid';

// Section Skeleton for lazy loading
export const SectionSkeleton = memo(() => (
  <div className="space-y-2 p-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-3/4" />
  </div>
));
SectionSkeleton.displayName = 'SectionSkeleton';

// Toggle Button Group
interface ToggleGroupProps {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const ToggleGroup = memo<ToggleGroupProps>(({ options, value, onChange, label }) => (
  <div className="space-y-1">
    {label && <Label className="text-[10px] text-muted-foreground">{label}</Label>}
    <div className="flex border border-border rounded-md overflow-hidden">
      {options.map((opt, idx) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-1.5 text-[9px] capitalize transition-colors ${
            value === opt
              ? 'bg-primary text-primary-foreground'
              : 'bg-card hover:bg-secondary'
          } ${idx > 0 ? 'border-l border-border' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
));
ToggleGroup.displayName = 'ToggleGroup';

// Category Switch
interface CategorySwitchProps {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
  icons?: Record<string, React.ReactNode>;
}

export const CategorySwitch = memo<CategorySwitchProps>(({ 
  categories, active, onChange, icons 
}) => (
  <div className="flex border border-border rounded-md overflow-hidden mb-3">
    {categories.map((cat, idx) => (
      <button
        key={cat}
        onClick={() => onChange(cat)}
        className={`flex-1 py-1.5 text-[9px] capitalize flex items-center justify-center gap-1 transition-colors ${
          active === cat
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-secondary'
        } ${idx > 0 ? 'border-l border-border' : ''}`}
      >
        {icons?.[cat]}
        {cat}
      </button>
    ))}
  </div>
));
CategorySwitch.displayName = 'CategorySwitch';
