import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { InspectorHeader } from './inspector/InspectorHeader';
import { EditTab } from './inspector/EditTab';
import { PromptTab } from './inspector/PromptTab';
import { CodeTab } from './inspector/CodeTab';
import { useToast } from '@/hooks/use-toast';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

interface PropertyInspectorProps {
  isVisible: boolean;
  onClose: () => void;
  selectedElement?: {
    id: string;
    type: string;
    content: string;
    className: string;
  } | null;
  onElementUpdate?: (updates: { content?: string; className?: string }) => void;
}

const STORAGE_KEY = 'property-inspector-position';

const getInitialPosition = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse saved position:', e);
  }
  return { x: window.innerWidth - 360, y: 50 };
};

export const PropertyInspector = ({
  isVisible,
  onClose,
  selectedElement,
  onElementUpdate,
}: PropertyInspectorProps) => {
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const [position, setPosition] = useState(getInitialPosition);
  const [elementContent, setElementContent] = useState(selectedElement?.content || '');
  const [codeText, setCodeText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (selectedElement) {
      setElementContent(selectedElement.content);
      setCodeText(
        `<${selectedElement.type} class="${selectedElement.className}">${selectedElement.content}</${selectedElement.type}>`
      );
    }
  }, [selectedElement]);

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosition));
  };

  const handleContentChange = (content: string) => {
    setElementContent(content);
    onElementUpdate?.({ content });
  };

  const handleCodeApply = () => {
    toast({
      title: 'Code applied',
      description: 'Your code changes have been applied.',
    });
  };

  const handleCodeReset = () => {
    if (selectedElement) {
      setCodeText(
        `<${selectedElement.type} class="${selectedElement.className}">${selectedElement.content}</${selectedElement.type}>`
      );
    }
  };

  const handleSave = () => {
    toast({
      title: 'Changes saved',
      description: 'All changes have been saved successfully.',
    });
  };

  const handleReset = () => {
    if (selectedElement) {
      setElementContent(selectedElement.content);
      setCodeText(
        `<${selectedElement.type} class="${selectedElement.className}">${selectedElement.content}</${selectedElement.type}>`
      );
    }
    toast({
      title: 'Reset complete',
      description: 'All changes have been reset.',
    });
  };

  const handlePromptApply = (newClasses: string) => {
    onElementUpdate?.({ className: newClasses });
  };

  if (!isVisible) return null;

  const elementTag = selectedElement?.type || 'button';
  const elementId = selectedElement?.id || '#element-id';
  const currentClasses = selectedElement?.className || '';

  return (
    <Draggable
      handle=".drag-handle"
      position={position}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div className="absolute z-50 bg-card border border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[85vh] flex flex-col">
        <InspectorHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          elementTag={elementTag}
          onClose={onClose}
          onReset={handleReset}
          onSave={handleSave}
        />

        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'PROMPT' ? (
            <PromptTab
              elementTag={elementTag}
              elementId={elementId}
              currentClasses={currentClasses}
              onApplyChanges={handlePromptApply}
            />
          ) : activeTab === 'CODE' ? (
            <CodeTab
              code={codeText}
              onChange={setCodeText}
              onApply={handleCodeApply}
              onReset={handleCodeReset}
            />
          ) : (
            <EditTab
              elementContent={elementContent}
              onContentChange={handleContentChange}
            />
          )}
        </div>
      </div>
    </Draggable>
  );
};
