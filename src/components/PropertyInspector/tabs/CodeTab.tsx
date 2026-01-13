import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw, Check } from 'lucide-react';
import { useInspector } from '../InspectorContext';
import { toast } from 'sonner';

export const CodeTab: React.FC = () => {
  const { generatedCode, state, updateState } = useInspector();
  const [localCode, setLocalCode] = useState(generatedCode);
  const [hasChanges, setHasChanges] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLocalCode(generatedCode);
    setHasChanges(false);
  }, [generatedCode]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setLocalCode(value);
      setHasChanges(value !== generatedCode);
    }
  };

  const handleReset = () => {
    setLocalCode(generatedCode);
    setHasChanges(false);
  };

  const handleApply = () => {
    // Parse the code and extract Tailwind classes
    const classMatch = localCode.match(/class="([^"]*)"/);
    if (classMatch) {
      updateState('tailwindClasses', classMatch[1]);
    }

    // Extract text content
    const textMatch = localCode.match(/>([^<]*)</);
    if (textMatch) {
      updateState('textContent', textMatch[1]);
    }

    setHasChanges(false);
    toast.success('Code applied successfully');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(localCode);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="relative flex-1 min-h-[380px] rounded-lg overflow-hidden border border-border">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-6 w-6"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
        <Editor
          height="100%"
          defaultLanguage="html"
          value={localCode}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'off',
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            glyphMargin: false,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            automaticLayout: true,
            tabSize: 2,
            renderLineHighlight: 'none',
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
            },
          }}
        />
      </div>
      <div className="flex items-center justify-between border-t border-border py-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] ${hasChanges ? 'text-amber-500' : 'text-muted-foreground'}`}>
            {hasChanges ? 'Unsaved changes' : 'No changes'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={!hasChanges}
            className="text-[10px] h-7 px-2"
            onClick={handleReset}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          <Button
            disabled={!hasChanges}
            className="text-[10px] h-7 px-2"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};
