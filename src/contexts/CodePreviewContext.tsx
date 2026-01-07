// Code Preview Context - Shared state between Inspector and Preview

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { InspectorState } from '@/components/PropertyInspector/types';
import { DEFAULT_STATE } from '@/components/PropertyInspector/constants';
import { useGeneratedClasses } from '@/components/PropertyInspector/hooks';

interface CodePreviewContextType {
  inspectorState: InspectorState;
  setInspectorState: React.Dispatch<React.SetStateAction<InspectorState>>;
  generatedClasses: string;
  customHtml: string;
  customCss: string;
  setCustomHtml: (html: string) => void;
  setCustomCss: (css: string) => void;
  isCodeMode: boolean;
  setIsCodeMode: (mode: boolean) => void;
  savedHtml: string;
  savedCss: string;
  hasSavedCode: boolean;
  saveCode: () => void;
  resetCode: () => void;
}

const CodePreviewContext = createContext<CodePreviewContextType | undefined>(undefined);

interface CodePreviewProviderProps {
  children: ReactNode;
}

export function CodePreviewProvider({ children }: CodePreviewProviderProps) {
  const [inspectorState, setInspectorState] = useState<InspectorState>(DEFAULT_STATE);
  const [customHtml, setCustomHtml] = useState('');
  const [customCss, setCustomCss] = useState('');
  const [savedHtml, setSavedHtml] = useState('');
  const [savedCss, setSavedCss] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  
  const generatedClasses = useGeneratedClasses(inspectorState, 'base');

  const hasSavedCode = useMemo(() => {
    return savedHtml.length > 0 || savedCss.length > 0;
  }, [savedHtml, savedCss]);

  const saveCode = useCallback(() => {
    setSavedHtml(customHtml);
    setSavedCss(customCss);
  }, [customHtml, customCss]);

  const resetCode = useCallback(() => {
    setCustomHtml('');
    setCustomCss('');
    setSavedHtml('');
    setSavedCss('');
  }, []);

  const contextValue = useMemo<CodePreviewContextType>(() => ({
    inspectorState,
    setInspectorState,
    generatedClasses,
    customHtml,
    customCss,
    setCustomHtml,
    setCustomCss,
    isCodeMode,
    setIsCodeMode,
    savedHtml,
    savedCss,
    hasSavedCode,
    saveCode,
    resetCode
  }), [
    inspectorState,
    generatedClasses,
    customHtml,
    customCss,
    isCodeMode,
    savedHtml,
    savedCss,
    hasSavedCode,
    saveCode,
    resetCode
  ]);

  return (
    <CodePreviewContext.Provider value={contextValue}>
      {children}
    </CodePreviewContext.Provider>
  );
}

export function useCodePreview() {
  const context = useContext(CodePreviewContext);
  if (context === undefined) {
    throw new Error('useCodePreview must be used within a CodePreviewProvider');
  }
  return context;
}
