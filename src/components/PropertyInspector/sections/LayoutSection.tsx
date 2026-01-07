// Layout Section - Spacing, size, position, transforms

import React, { memo, useCallback } from 'react';
import { Layout, RotateCcw, Layers } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SpacingGrid, SliderRow, LabeledInput, StyledSelect } from '../components';
import type { SectionProps } from '../types';
import { POSITION_OPTIONS } from '../constants';

export const LayoutSection = memo<SectionProps>(({ 
  state, 
  updateNestedState 
}) => {
  const handlePaddingChange = useCallback((side: 'top' | 'right' | 'bottom' | 'left', value: string) => {
    updateNestedState('padding', side, value);
  }, [updateNestedState]);

  const handleSizeChange = useCallback((key: string, value: string) => {
    updateNestedState('size', key, value);
  }, [updateNestedState]);

  const handlePositionTypeChange = useCallback((value: string) => {
    updateNestedState('position', 'type', value);
  }, [updateNestedState]);

  const handleTransformChange = useCallback((key: string, value: number) => {
    updateNestedState('transforms', key, value);
  }, [updateNestedState]);

  const handleTransform3DChange = useCallback((key: string, value: number) => {
    updateNestedState('transforms3D', key, value);
  }, [updateNestedState]);

  return (
    <>
      {/* Layout & Spacing */}
      <AccordionItem value="layout" className="border border-border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
          <div className="flex items-center gap-2">
            <Layout className="w-3 h-3" />
            Layout & Spacing
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-2 space-y-3">
          <SpacingGrid
            label="Padding"
            values={state.padding}
            onChange={handlePaddingChange}
          />
          
          <div className="grid grid-cols-2 gap-2">
            <LabeledInput
              label="Width"
              value={state.size.width}
              onChange={(v) => handleSizeChange('width', v)}
              placeholder="auto"
            />
            <LabeledInput
              label="Height"
              value={state.size.height}
              onChange={(v) => handleSizeChange('height', v)}
              placeholder="auto"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <LabeledInput
              label="Min Width"
              value={state.size.minWidth}
              onChange={(v) => handleSizeChange('minWidth', v)}
              placeholder="0"
            />
            <LabeledInput
              label="Max Width"
              value={state.size.maxWidth}
              onChange={(v) => handleSizeChange('maxWidth', v)}
              placeholder="none"
            />
          </div>
          
          <StyledSelect
            label="Position"
            value={state.position.type}
            onValueChange={handlePositionTypeChange}
            options={POSITION_OPTIONS}
          />
        </AccordionContent>
      </AccordionItem>

      {/* 2D Transforms */}
      <AccordionItem value="transforms" className="border border-border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3 h-3" />
            Transforms
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-2 space-y-3">
          <SliderRow
            label="Translate X"
            value={state.transforms.translateX}
            onChange={(v) => handleTransformChange('translateX', v)}
            min={-100}
            max={100}
            unit="px"
          />
          <SliderRow
            label="Translate Y"
            value={state.transforms.translateY}
            onChange={(v) => handleTransformChange('translateY', v)}
            min={-100}
            max={100}
            unit="px"
          />
          <SliderRow
            label="Rotate"
            value={state.transforms.rotate}
            onChange={(v) => handleTransformChange('rotate', v)}
            min={-180}
            max={180}
            unit="°"
          />
          <SliderRow
            label="Scale"
            value={state.transforms.scale}
            onChange={(v) => handleTransformChange('scale', v)}
            min={50}
            max={150}
            unit="%"
          />
          <SliderRow
            label="Skew X"
            value={state.transforms.skewX}
            onChange={(v) => handleTransformChange('skewX', v)}
            min={-45}
            max={45}
            unit="°"
          />
          <SliderRow
            label="Skew Y"
            value={state.transforms.skewY}
            onChange={(v) => handleTransformChange('skewY', v)}
            min={-45}
            max={45}
            unit="°"
          />
        </AccordionContent>
      </AccordionItem>

      {/* 3D Transforms */}
      <AccordionItem value="transforms3d" className="border border-border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline bg-secondary/30">
          <div className="flex items-center gap-2">
            <Layers className="w-3 h-3" />
            3D Transforms
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-2 space-y-3">
          <SliderRow
            label="Rotate X"
            value={state.transforms3D.rotateX}
            onChange={(v) => handleTransform3DChange('rotateX', v)}
            min={-180}
            max={180}
            unit="°"
          />
          <SliderRow
            label="Rotate Y"
            value={state.transforms3D.rotateY}
            onChange={(v) => handleTransform3DChange('rotateY', v)}
            min={-180}
            max={180}
            unit="°"
          />
          <SliderRow
            label="Rotate Z"
            value={state.transforms3D.rotateZ}
            onChange={(v) => handleTransform3DChange('rotateZ', v)}
            min={-180}
            max={180}
            unit="°"
          />
          <SliderRow
            label="Perspective"
            value={state.transforms3D.perspective}
            onChange={(v) => handleTransform3DChange('perspective', v)}
            max={1000}
            unit="px"
          />
        </AccordionContent>
      </AccordionItem>
    </>
  );
});

LayoutSection.displayName = 'LayoutSection';

export default LayoutSection;
