import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw, Check } from 'lucide-react';
import { useInspector } from '../InspectorContext';
import { toast } from 'sonner';

// Helper function to safely parse code and extract Tailwind classes
const extractClassesFromCode = (code: string): string | null => {
  try {
    const classMatch = code.match(/class="([^"]*)"/);
    return classMatch ? classMatch[1] : null;
  } catch {
    return null;
  }
};

// Helper function to safely extract text content
const extractTextFromCode = (code: string): string | null => {
  try {
    // Match text between tags, excluding HTML tags
    const textMatch = code.match(/>([^<]+)<\//);
    return textMatch ? textMatch[1].trim() : null;
  } catch {
    return null;
  }
};

export const CodeTab: React.FC = () => {
  const { generatedCode, state, updateState } = useInspector();
  const [localCode, setLocalCode] = useState(generatedCode);
  const [hasChanges, setHasChanges] = useState(false);
  const [copied, setCopied] = useState(false);

  // Detect theme (light/dark mode)
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const observer = new MutationObserver(() => {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isCurrentlyDark);
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setLocalCode(generatedCode);
    setHasChanges(false);
  }, [generatedCode]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setLocalCode(value);
      setHasChanges(value !== generatedCode);
    }
  }, [generatedCode]);

  const handleReset = useCallback(() => {
    setLocalCode(generatedCode);
    setHasChanges(false);
  }, [generatedCode]);

  const handleApply = useCallback(() => {
    try {
      const extractedClasses = extractClassesFromCode(localCode);
      if (extractedClasses) {
        updateState('tailwindClasses', extractedClasses);
      }

      const extractedText = extractTextFromCode(localCode);
      if (extractedText) {
        updateState('textContent', extractedText);
      }

      setHasChanges(false);
      toast.success('Code applied successfully');
    } catch (error) {
      console.error('Failed to apply code:', error);
      toast.error('Failed to apply code. Please check the syntax.');
    }
  }, [localCode, updateState]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(localCode);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  }, [localCode]);

  const monacoTheme = useMemo(() => isDarkMode ? 'vs-dark' : 'vs-light', [isDarkMode]);

  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 12,
    lineNumbers: 'off' as const,
    folding: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    glyphMargin: false,
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    padding: { top: 12, bottom: 12 },
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    renderLineHighlight: 'none' as const,
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    scrollbar: {
      vertical: 'hidden' as const,
      horizontal: 'hidden' as const,
    },
    semanticHighlighting: {
      enabled: false,
    },
  }), []);

  const changeStatus = useMemo(() => ({
    hasChanges,
    label: hasChanges ? 'Unsaved changes' : 'No changes',
    color: hasChanges ? 'text-amber-500' : 'text-muted-foreground',
  }), [hasChanges]);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="relative flex-1 min-h-[380px] rounded-lg overflow-hidden border border-border">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-6 w-6"
          onClick={handleCopy}
          title="Copy code to clipboard"
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
          theme={monacoTheme}
          options={editorOptions}
          loading={<div className="p-4 text-xs text-muted-foreground">Loading editor...</div>}
        />
      </div>
      <div className="flex items-center justify-between border-t border-border py-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] ${changeStatus.color}`}>
            {changeStatus.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={!hasChanges}
            className="text-[10px] h-7 px-2"
            onClick={handleReset}
            title="Reset to generated code"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          <Button
            disabled={!hasChanges}
            className="text-[10px] h-7 px-2"
            onClick={handleApply}
            title="Apply code changes"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};
