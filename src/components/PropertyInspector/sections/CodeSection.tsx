// Code Section - Tailwind classes, CSS, and generated code

import React, { memo, useCallback } from 'react';
import { Download, Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { useToast } from '@/hooks/use-toast';
import type { InspectorState, Breakpoint } from '../types';
import { useGeneratedCode } from '../hooks';

interface CodeSectionProps {
  state: InspectorState;
  breakpoint: Breakpoint;
  updateState: <K extends keyof InspectorState>(key: K, value: InspectorState[K]) => void;
}

export const CodeSection = memo<CodeSectionProps>(({ 
  state, 
  breakpoint,
  updateState 
}) => {
  const { toast } = useToast();
  const generatedCode = useGeneratedCode(state, breakpoint);

  const handleTailwindChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateState('tailwindClasses', e.target.value);
  }, [updateState]);

  const handleCssChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateState('inlineCss', e.target.value);
  }, [updateState]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(generatedCode);
    toast({ title: "Copied!", description: "Code copied to clipboard." });
  }, [generatedCode, toast]);

  const handleCopyTailwind = useCallback(() => {
    if (state.tailwindClasses) {
      navigator.clipboard.writeText(state.tailwindClasses);
      toast({ title: "Copied!", description: "Tailwind classes copied." });
    }
  }, [state.tailwindClasses, toast]);

  return (
    <div className="space-y-4">
      {/* Custom Tailwind Classes */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-[10px] text-muted-foreground">Custom Tailwind Classes</Label>
          {state.tailwindClasses && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 px-2 text-[9px]"
              onClick={handleCopyTailwind}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          )}
        </div>
        <Textarea
          value={state.tailwindClasses}
          onChange={handleTailwindChange}
          placeholder="e.g., hover:bg-blue-500 focus:ring-2..."
          className="min-h-[60px] text-xs font-mono resize-none"
        />
      </div>

      {/* Custom Inline CSS */}
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Custom Inline CSS</Label>
        <Textarea
          value={state.inlineCss}
          onChange={handleCssChange}
          placeholder="e.g., box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
          className="min-h-[60px] text-xs font-mono resize-none"
        />
      </div>

      {/* Generated Code Preview */}
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Generated Code</Label>
        <div className="rounded-lg overflow-hidden border border-border h-[200px]">
          <Editor
            height="100%"
            defaultLanguage="html"
            value={generatedCode}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 11,
              lineNumbers: 'off',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              readOnly: true,
              padding: { top: 8, bottom: 8 },
              folding: false,
              glyphMargin: false,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0
            }}
          />
        </div>
        <Button 
          variant="outline" 
          className="w-full h-7 text-xs"
          onClick={handleCopyCode}
        >
          <Download className="w-3 h-3 mr-2" />
          Copy Generated Code
        </Button>
      </div>
    </div>
  );
});

CodeSection.displayName = 'CodeSection';

export default CodeSection;
