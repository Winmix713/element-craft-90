import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { CodeXml } from 'lucide-react';

interface CodeTabProps {
  code: string;
  onChange: (code: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const CodeTab = ({ code, onChange, onApply, onReset }: CodeTabProps) => {
  const [localCode, setLocalCode] = useState(code);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalCode(code);
    setHasChanges(false);
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || '';
    setLocalCode(newValue);
    setHasChanges(newValue !== code);
    onChange(newValue);
  };

  const handleApply = () => {
    onApply();
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalCode(code);
    setHasChanges(false);
    onReset();
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1">
          <CodeXml className="h-2.5 w-2.5 opacity-70" />
          <span>Code Snippets</span>
        </Button>
      </div>
      
      <div className="flex-1 border border-border rounded-lg overflow-hidden min-h-[350px]">
        <Editor
          height="100%"
          defaultLanguage="html"
          value={localCode}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingStrategy: 'advanced',
            padding: { top: 8, bottom: 8 },
            fontFamily: 'Consolas, "Courier New", monospace',
            tabSize: 2,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="flex items-center justify-between border-t border-border py-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {hasChanges ? 'Unsaved changes' : 'No changes'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={!hasChanges}
            onClick={handleReset}
            className="text-[10px] h-7 px-2"
          >
            Reset
          </Button>
          <Button
            disabled={!hasChanges}
            onClick={handleApply}
            className="text-[10px] h-7 px-2"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};
