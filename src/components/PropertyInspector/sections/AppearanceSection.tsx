// Appearance Section - Colors, borders, effects

import React, { memo, useCallback } from 'react';
import { Palette } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ColorPicker, SliderRow, StyledSelect } from '../components';
import type { SectionProps } from '../types';
import { BORDER_STYLE_OPTIONS, SHADOW_OPTIONS } from '../constants';

export const AppearanceSection = memo<SectionProps>(({ 
  state, 
  updateNestedState 
}) => {
  const handleBgColorChange = useCallback((c: string) => {
    updateNestedState('appearance', 'backgroundColor', c);
  }, [updateNestedState]);

  const handleBorderColorChange = useCallback((c: string) => {
    updateNestedState('border', 'color', c);
  }, [updateNestedState]);

  const handleBorderRadiusChange = useCallback((v: number) => {
    updateNestedState('border', 'radius', { ...state.border.radius, all: v });
  }, [updateNestedState, state.border.radius]);

  const handleBorderWidthChange = useCallback((v: string) => {
    updateNestedState('border', 'width', v);
  }, [updateNestedState]);

  const handleBorderStyleChange = useCallback((v: string) => {
    updateNestedState('border', 'style', v);
  }, [updateNestedState]);

  const handleOpacityChange = useCallback((v: number) => {
    updateNestedState('effects', 'opacity', v);
  }, [updateNestedState]);

  const handleBlurChange = useCallback((v: number) => {
    updateNestedState('effects', 'blur', v);
  }, [updateNestedState]);

  const handleBackdropBlurChange = useCallback((v: number) => {
    updateNestedState('effects', 'backdropBlur', v);
  }, [updateNestedState]);

  const handleShadowChange = useCallback((v: string) => {
    updateNestedState('effects', 'shadow', v);
  }, [updateNestedState]);

  const handleBrightnessChange = useCallback((v: number) => {
    updateNestedState('effects', 'brightness', v);
  }, [updateNestedState]);

  const handleContrastChange = useCallback((v: number) => {
    updateNestedState('effects', 'contrast', v);
  }, [updateNestedState]);

  const handleSaturationChange = useCallback((v: number) => {
    updateNestedState('effects', 'saturation', v);
  }, [updateNestedState]);

  return (
    <AccordionItem value="appearance" className="border border-border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
        <div className="flex items-center gap-2">
          <Palette className="w-3 h-3" />
          Appearance
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3 py-2 space-y-3">
        <ColorPicker
          label="Background Color"
          color={state.appearance.backgroundColor}
          onChange={handleBgColorChange}
        />
        
        <ColorPicker
          label="Border Color"
          color={state.border.color}
          onChange={handleBorderColorChange}
        />
        
        <SliderRow
          label="Border Radius"
          value={state.border.radius.all}
          onChange={handleBorderRadiusChange}
          max={50}
          unit="px"
        />
        
        <div className="grid grid-cols-2 gap-2">
          <StyledSelect
            label="Border Width"
            value={state.border.width}
            onValueChange={handleBorderWidthChange}
            options={[
              { value: '0', label: 'None' },
              { value: '1', label: '1px' },
              { value: '2', label: '2px' },
              { value: '4', label: '4px' }
            ]}
          />
          <StyledSelect
            label="Border Style"
            value={state.border.style}
            onValueChange={handleBorderStyleChange}
            options={BORDER_STYLE_OPTIONS}
          />
        </div>
        
        <StyledSelect
          label="Shadow"
          value={state.effects.shadow}
          onValueChange={handleShadowChange}
          options={SHADOW_OPTIONS}
        />
        
        <SliderRow
          label="Opacity"
          value={state.effects.opacity}
          onChange={handleOpacityChange}
          unit="%"
        />
        
        <SliderRow
          label="Blur"
          value={state.effects.blur}
          onChange={handleBlurChange}
          max={20}
          unit="px"
        />
        
        <SliderRow
          label="Backdrop Blur"
          value={state.effects.backdropBlur}
          onChange={handleBackdropBlurChange}
          max={20}
          unit="px"
        />
        
        <SliderRow
          label="Brightness"
          value={state.effects.brightness}
          onChange={handleBrightnessChange}
          min={0}
          max={200}
          unit="%"
        />
        
        <SliderRow
          label="Contrast"
          value={state.effects.contrast}
          onChange={handleContrastChange}
          min={0}
          max={200}
          unit="%"
        />
        
        <SliderRow
          label="Saturation"
          value={state.effects.saturation}
          onChange={handleSaturationChange}
          min={0}
          max={200}
          unit="%"
        />
      </AccordionContent>
    </AccordionItem>
  );
});

AppearanceSection.displayName = 'AppearanceSection';

export default AppearanceSection;
