import React, { useCallback } from 'react';

interface SliderProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  valueLabel?: string;
}

export const Slider: React.FC<SliderProps> = ({
  icon,
  label,
  value,
  onChange,
  min,
  max,
  unit,
  valueLabel,
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);

  const displayValue = valueLabel || `${value}${unit}`;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="-space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {icon}
          <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
        </div>
        <span className="text-[10px] text-muted-foreground" aria-live="polite">
          {displayValue}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer slider-input"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--secondary)) ${percentage}%, hsl(var(--secondary)) 100%)`,
          }}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
    </div>
  );
};
