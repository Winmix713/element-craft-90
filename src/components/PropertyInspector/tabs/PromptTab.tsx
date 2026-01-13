import React, { useState, useCallback, useMemo } from 'react';
import { WandSparkles, Sparkles, Paperclip, Figma, Send, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInspector } from '../InspectorContext';
import { toast } from 'sonner';

const AI_MODELS = [
  { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
  { value: 'llama2-70b-4096', label: 'Llama 2 70B' },
  { value: 'gemma-7b-it', label: 'Gemma 7B' },
] as const;

type AIModel = typeof AI_MODELS[number];

const PROMPT_TEMPLATES = [
  { label: 'Make responsive', prompt: 'Make this element fully responsive across all breakpoints' },
  { label: 'Add hover effect', prompt: 'Add a subtle hover effect with smooth transition' },
  { label: 'Dark mode', prompt: 'Adapt colors for dark mode compatibility' },
  { label: 'Add animation', prompt: 'Add a subtle entrance animation' },
  { label: 'Glassmorphism', prompt: 'Apply glassmorphism effect with blur and transparency' },
] as const;

// Helper function to safely parse AI response
const parseAIResponse = (response: string): { tailwindClasses?: string; textContent?: string } | null => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return null;
  }
};

// Helper function to extract meaningful text from streaming response
const extractMeaningfulText = (text: string): string => {
  return text
    .replace(/^[:\s]+/, '') // Remove leading colons/spaces
    .replace(/\[DONE\]/g, '') // Remove [DONE] markers
    .trim();
};

export const PromptTab: React.FC = () => {
  const { state, updateState } = useInspector();
  const [promptText, setPromptText] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsLoading(true);
    setStreamingResponse('');
    abortControllerRef.current = new AbortController();

    try {
      // Groq API endpoint (OpenAI-compatible)
      const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

      if (!GROQ_API_KEY) {
        toast.error('Groq API key not configured');
        console.error('Missing VITE_GROQ_API_KEY environment variable');
        setIsLoading(false);
        return;
      }

      // System prompt for Tailwind CSS expertise
      const systemPrompt = `You are a Tailwind CSS expert assistant. Your job is to help modify UI element styles based on user requests.

Current element state:
- Element tag: ${state.elementTag}
- Current Tailwind classes: ${state.tailwindClasses}
- Text content: ${state.textContent}

When the user describes a change, respond with ONLY a valid JSON object:
{
  "tailwindClasses": "the complete updated Tailwind class string",
  "textContent": "the updated text content (only include if changed)"
}

Guidelines:
- Preserve existing classes unless they conflict with the requested change
- Use modern Tailwind CSS best practices (v3+)
- Ensure responsive design principles
- Add appropriate hover/focus states when relevant
- Always respond with valid JSON, no markdown, no code blocks, no explanations`;

      const resp = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: selectedModel.value,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: promptText },
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 500,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (resp.status === 429) {
        toast.error('Rate limit exceeded. Please try again in a moment.');
        setIsLoading(false);
        return;
      }

      if (resp.status === 401) {
        toast.error('Invalid Groq API key. Please check your configuration.');
        setIsLoading(false);
        return;
      }

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Groq API error:', resp.status, errorText);
        toast.error(`API error: ${resp.status}. Check console for details.`);
        setIsLoading(false);
        return;
      }

      if (!resp.body) {
        throw new Error('Failed to receive response body');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullResponse = '';
      let eventCount = 0;

      while (true) {
        try {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (line.startsWith(':') || line.trim() === '') continue;
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                fullResponse += content;
                eventCount++;
                // Update UI less frequently to avoid excessive re-renders
                if (eventCount % 3 === 0 || content.length > 50) {
                  setStreamingResponse(fullResponse);
                }
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE event:', jsonStr);
              continue;
            }
          }
        } catch (readError) {
          if ((readError as Error).name === 'AbortError') {
            console.log('Stream reading aborted');
            break;
          }
          throw readError;
        }
      }

      // Final update
      setStreamingResponse(fullResponse);

      // Try to parse the response as JSON to extract changes
      const changes = parseAIResponse(fullResponse);
      if (changes) {
        if (changes.tailwindClasses) {
          updateState('tailwindClasses', changes.tailwindClasses);
        }
        if (changes.textContent) {
          updateState('textContent', changes.textContent);
        }
        toast.success('Changes applied successfully');
      } else {
        // Response wasn't structured JSON
        const meaningfulText = extractMeaningfulText(fullResponse);
        if (meaningfulText) {
          toast.info('AI response received. Review the response above.');
        } else {
          toast.warning('AI returned empty response');
        }
      }

      setPromptText('');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('AI prompt error:', error);
        toast.error('Failed to get AI response. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [promptText, selectedModel.value, state, updateState]);

  const handleTemplateSelect = useCallback((template: string) => {
    setPromptText(template);
  }, []);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPromptText('');
    setStreamingResponse('');
    setIsLoading(false);
  }, []);

  const selectedModelLabel = useMemo(() => selectedModel.label, [selectedModel.label]);

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Describe what you want to change:
        </label>
        <div className="relative">
          <Textarea
            placeholder="Adapt to dark mode, add details, make adaptive, change text to..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full resize-none min-h-[100px] max-h-[200px] overflow-y-auto text-xs hover:bg-secondary/50 pb-[40px] rounded-2xl"
            disabled={isLoading}
          />
          <div className="absolute bottom-[16px] left-[9px] z-10 flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex p-2 py-1 gap-2 items-center text-[10px] rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 shadow-sm"
                  title="Open Prompt Builder"
                >
                  <WandSparkles className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {PROMPT_TEMPLATES.map((template) => (
                  <DropdownMenuItem
                    key={template.label}
                    onClick={() => handleTemplateSelect(template.prompt)}
                  >
                    {template.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center rounded-lg bg-card border border-border hover:border-primary/50 shadow-sm p-2 py-1 gap-2 text-[10px] flex-shrink-0 hover:bg-secondary disabled:opacity-50"
                  title="Select AI Model"
                  disabled={isLoading}
                >
                  <Sparkles className="h-3 w-3" />
                  {selectedModelLabel}
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {AI_MODELS.map((model) => (
                  <DropdownMenuItem
                    key={model.value}
                    onClick={() => setSelectedModel(model)}
                  >
                    {model.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              type="button"
              className="flex p-2 py-1 gap-2 items-center text-[10px] rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 shadow-sm opacity-50 cursor-not-allowed"
              title="Attach Files (Coming soon)"
              disabled
            >
              <Paperclip className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="flex p-2 py-1 items-center text-[10px] rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 shadow-sm opacity-50 cursor-not-allowed"
              title="Import from Figma (Coming soon)"
              disabled
            >
              <Figma className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {streamingResponse && (
        <div className="p-3 bg-secondary/50 rounded-lg border border-border">
          <p className="text-xs font-mono whitespace-pre-wrap">{streamingResponse}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div>
            Selected: <span className="font-medium font-mono text-xs uppercase text-foreground">{state.elementTag}</span>
          </div>
          <span className="text-[10px]">#{state.elementId}</span>
        </div>
        <div className="font-mono text-[10px] bg-secondary/50 border border-border rounded-lg px-2 py-2">
          {state.tailwindClasses}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 mt-2">
          <Button
            type="submit"
            disabled={!promptText.trim() || isLoading}
            className="flex p-2 px-3 gap-2 items-center"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            {isLoading ? 'Processing...' : 'Apply Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="p-2 px-3"
            disabled={isLoading && !streamingResponse}
          >
            Cancel
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Costs 1 prompt. Don't forget to save changes.
        </p>
      </div>
    </form>
  );
};
