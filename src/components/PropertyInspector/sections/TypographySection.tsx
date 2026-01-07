// Typography Section - Font and text settings

import React, { memo, useCallback } from 'react';
import { Type } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPicker, SliderRow, StyledSelect, ToggleGroup } from '../components';
import type { SectionProps } from '../types';
import { 
  FONT_FAMILY_OPTIONS, 
  FONT_WEIGHT_OPTIONS, 
  TEXT_ALIGN_OPTIONS,
  TAG_OPTIONS 
} from '../constants';

export const TypographySection = memo<SectionProps>(({ 
  state, 
  updateNestedState,
  updateState 
}) => {
  const handleTextContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateState('textContent', e.target.value);
  }, [updateState]);

  const handleElementIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateState('elementId', e.target.value);
  }, [updateState]);

  const handleTagChange = useCallback((v: string) => {
    updateState('tag', v);
  }, [updateState]);

  const handleTextColorChange = useCallback((c: string) => {
    updateNestedState('typography', 'textColor', c);
  }, [updateNestedState]);

  const handleFontFamilyChange = useCallback((v: string) => {
    updateNestedState('typography', 'fontFamily', v);
  }, [updateNestedState]);

  const handleFontWeightChange = useCallback((v: string) => {
    updateNestedState('typography', 'fontWeight', v);
  }, [updateNestedState]);

  const handleFontSizeChange = useCallback((v: number) => {
    updateNestedState('typography', 'fontSize', v.toString());
  }, [updateNestedState]);

  const handleLineHeightChange = useCallback((v: number) => {
    updateNestedState('typography', 'lineHeight', (v / 10).toFixed(1));
  }, [updateNestedState]);

  const handleLetterSpacingChange = useCallback((v: number) => {
    updateNestedState('typography', 'letterSpacing', (v / 10).toString());
  }, [updateNestedState]);

  const handleTextAlignChange = useCallback((v: string) => {
    updateNestedState('typography', 'textAlign', v);
  }, [updateNestedState]);

  return (
    <AccordionItem value="typography" className="border border-border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
        <div className="flex items-center gap-2">
          <Type className="w-3 h-3" />
          Typography
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3 py-2 space-y-3">
        {/* Element Settings */}
        <div className="grid grid-cols-2 gap-2">
          <StyledSelect
            label="Element Tag"
            value={state.tag}
            onValueChange={handleTagChange}
            options={TAG_OPTIONS}
          />
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Element ID</Label>
            <Input
              value={state.elementId}
              onChange={handleElementIdChange}
              placeholder="my-element"
              className="h-7 text-xs"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">Text Content</Label>
          <Input
            value={state.textContent}
            onChange={handleTextContentChange}
            placeholder="Enter text..."
            className="h-7 text-xs"
          />
        </div>
        
        {/* Text Color */}
        <ColorPicker
          label="Text Color"
          color={state.typography.textColor}
          onChange={handleTextColorChange}
        />
        
        {/* Font Family & Weight */}
        <div className="grid grid-cols-2 gap-2">
          <StyledSelect
            label="Font Family"
            value={state.typography.fontFamily}
            onValueChange={handleFontFamilyChange}
            options={FONT_FAMILY_OPTIONS}
          />
          <StyledSelect
            label="Weight"
            value={state.typography.fontWeight}
            onValueChange={handleFontWeightChange}
            options={FONT_WEIGHT_OPTIONS}
          />
        </div>
        
        {/* Font Size */}
        <SliderRow
          label="Font Size"
          value={parseInt(state.typography.fontSize) || 16}
          onChange={handleFontSizeChange}
          min={8}
          max={72}
          unit="px"
        />
        
        {/* Line Height */}
        <SliderRow
          label="Line Height"
          value={Math.round(parseFloat(state.typography.lineHeight) * 10) || 15}
          onChange={handleLineHeightChange}
          min={10}
          max={30}
          step={1}
          unit=""
        />
        
        {/* Letter Spacing */}
        <SliderRow
          label="Letter Spacing"
          value={Math.round(parseFloat(state.typography.letterSpacing) * 10) || 0}
          onChange={handleLetterSpacingChange}
          min={-5}
          max={20}
          step={1}
          unit="em"
        />
        
        {/* Text Align */}
        <ToggleGroup
          label="Text Align"
          options={TEXT_ALIGN_OPTIONS}
          value={state.typography.textAlign}
          onChange={handleTextAlignChange}
        />
      </AccordionContent>
    </AccordionItem>
  );
});

TypographySection.displayName = 'TypographySection';

export default TypographySection;
