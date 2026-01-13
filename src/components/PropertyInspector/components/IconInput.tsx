import React from 'react';
import { Input } from '@/components/ui/input';

interface IconInputProps {
  icon: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const IconInput: React.FC<IconInputProps> = ({
  icon,
  value = '',
  onChange,
  placeholder,
}) => (
  <div className="relative">
    <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none opacity-30">
      {icon}
    </div>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="h-8 text-xs pl-8"
    />
  </div>
);

interface LabeledInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value = '',
  onChange,
  placeholder,
}) => (
  <div className="relative">
    <span
      className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xs font-light text-foreground pointer-events-none ${
        !value ? 'opacity-30' : ''
      }`}
    >
      {label}
    </span>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="h-8 text-xs pl-8"
    />
  </div>
);
