import React from 'react';

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
}) => (
  <div className="-space-y-1.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-[10px] text-muted-foreground">
        {valueLabel || `${value}${unit}`}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer slider-thumb"
    />
  </div>
);
