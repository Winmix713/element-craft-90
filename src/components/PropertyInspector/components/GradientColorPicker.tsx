import React, { useState, useCallback } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { X, Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface GradientValue {
  type: 'solid' | 'linear' | 'radial';
  angle: number; // for linear gradients
  stops: GradientStop[];
}

interface GradientColorPickerProps {
  value?: GradientValue | string;
  onChange: (value: GradientValue | string) => void;
  label?: string;
}

const defaultGradient: GradientValue = {
  type: 'linear',
  angle: 90,
  stops: [
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ],
};

export const GradientColorPicker: React.FC<GradientColorPickerProps> = ({
  value = '',
  onChange,
  label = 'Color',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'solid' | 'gradient'>('solid');
  const [gradient, setGradient] = useState<GradientValue>(defaultGradient);
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [solidColor, setSolidColor] = useState('#000000');

  // Determine if we're showing a gradient or solid color
  const isSolidColor = typeof value === 'string';
  const isGradient = typeof value === 'object' && value !== null;

  React.useEffect(() => {
    if (isOpen) {
      if (isSolidColor) {
        setMode('solid');
        setSolidColor(value || '#000000');
      } else if (isGradient) {
        setMode('gradient');
        setGradient(value as GradientValue);
        setSelectedStopIndex(0);
      }
    }
  }, [isOpen, value, isSolidColor, isGradient]);

  const handleSolidColorChange = useCallback((color: string) => {
    setSolidColor(color);
    onChange(color);
  }, [onChange]);

  const handleGradientChange = useCallback((updatedGradient: GradientValue) => {
    setGradient(updatedGradient);
    onChange(updatedGradient);
  }, [onChange]);

  const updateGradientStop = (index: number, color: string) => {
    const updatedStops = [...gradient.stops];
    updatedStops[index] = { ...updatedStops[index], color };
    handleGradientChange({ ...gradient, stops: updatedStops });
  };

  const updateStopPosition = (index: number, position: number) => {
    const updatedStops = [...gradient.stops];
    updatedStops[index] = { ...updatedStops[index], position };
    handleGradientChange({ ...gradient, stops: updatedStops });
  };

  const addGradientStop = () => {
    const newStop: GradientStop = {
      color: '#000000',
      position: 50,
    };
    const updatedStops = [...gradient.stops, newStop];
    updatedStops.sort((a, b) => a.position - b.position);
    handleGradientChange({ ...gradient, stops: updatedStops });
    setSelectedStopIndex(updatedStops.findIndex(s => s.color === newStop.color && s.position === 50));
  };

  const removeGradientStop = (index: number) => {
    if (gradient.stops.length <= 2) return;
    const updatedStops = gradient.stops.filter((_, i) => i !== index);
    handleGradientChange({ ...gradient, stops: updatedStops });
    setSelectedStopIndex(Math.max(0, Math.min(selectedStopIndex, updatedStops.length - 1)));
  };

  const updateGradientAngle = (angle: number) => {
    handleGradientChange({ ...gradient, angle });
  };

  const updateGradientType = (type: 'linear' | 'radial') => {
    handleGradientChange({ ...gradient, type });
  };

  const generateGradientCSS = () => {
    if (mode === 'solid') {
      return solidColor;
    }
    const stops = gradient.stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');
    if (gradient.type === 'linear') {
      return `linear-gradient(${gradient.angle}deg, ${stops})`;
    }
    return `radial-gradient(circle, ${stops})`;
  };

  const displayValue = mode === 'solid' ? solidColor : `gradient`;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card hover:bg-secondary transition-colors"
        >
          <div
            className="w-4 h-4 rounded-full border border-border"
            style={{
              background: generateGradientCSS(),
            }}
          />
          <span className="text-xs truncate capitalize">{displayValue}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'solid' | 'gradient')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="solid" className="text-xs">
              Solid
            </TabsTrigger>
            <TabsTrigger value="gradient" className="text-xs">
              Gradient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="space-y-3">
            <HexColorPicker color={solidColor} onChange={handleSolidColorChange} />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">#</span>
              <HexColorInput
                color={solidColor}
                onChange={handleSolidColorChange}
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
                    onClick={() => handleSolidColorChange(presetColor)}
                  />
                )
              )}
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px]"
                onClick={() => {
                  handleSolidColorChange('');
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
          </TabsContent>

          <TabsContent value="gradient" className="space-y-3">
            {/* Gradient Type */}
            <div className="flex gap-2">
              <Button
                variant={gradient.type === 'linear' ? 'default' : 'outline'}
                size="sm"
                className="h-6 text-[10px] flex-1"
                onClick={() => updateGradientType('linear')}
              >
                Linear
              </Button>
              <Button
                variant={gradient.type === 'radial' ? 'default' : 'outline'}
                size="sm"
                className="h-6 text-[10px] flex-1"
                onClick={() => updateGradientType('radial')}
              >
                Radial
              </Button>
            </div>

            {/* Angle Control for Linear Gradient */}
            {gradient.type === 'linear' && (
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-muted-foreground">Angle</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={gradient.angle}
                    onChange={(e) => updateGradientAngle(Number(e.target.value))}
                    className="flex-1 h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                  />
                  <Input
                    type="number"
                    value={gradient.angle}
                    onChange={(e) => updateGradientAngle(Number(e.target.value))}
                    min={0}
                    max={360}
                    className="h-6 w-16 text-xs"
                  />
                  <span className="text-[10px] text-muted-foreground w-6">°</span>
                </div>
              </div>
            )}

            {/* Preview */}
            <div
              className="h-12 rounded-md border border-border"
              style={{ background: generateGradientCSS() }}
            />

            {/* Gradient Stops */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-medium text-muted-foreground">Stops</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-5 text-[10px] px-2 gap-1"
                  onClick={addGradientStop}
                >
                  <Plus className="w-2.5 h-2.5" />
                  Add
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {gradient.stops.map((stop, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        className={`w-6 h-6 rounded border border-border cursor-pointer transition-transform ${
                          selectedStopIndex === index ? 'ring-2 ring-primary' : ''
                        }`}
                        style={{ backgroundColor: stop.color }}
                        onClick={() => setSelectedStopIndex(index)}
                      />
                      <div className="flex-1 flex items-center gap-1">
                        <Input
                          type="number"
                          value={stop.position}
                          onChange={(e) => updateStopPosition(index, Number(e.target.value))}
                          min={0}
                          max={100}
                          className="h-6 text-xs w-16"
                        />
                        <span className="text-[10px] text-muted-foreground">%</span>
                      </div>
                      {gradient.stops.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => removeGradientStop(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    {selectedStopIndex === index && (
                      <div className="pl-8">
                        <HexColorPicker color={stop.color} onChange={(color) => updateGradientStop(index, color)} />
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">#</span>
                          <HexColorInput
                            color={stop.color}
                            onChange={(color) => updateGradientStop(index, color)}
                            placeholder="000000"
                            className="flex-1 h-6 px-2 text-xs border border-border rounded-md bg-background"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-2">
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
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
