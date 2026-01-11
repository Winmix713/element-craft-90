import { useState } from 'react';
import { WandSparkles, Sparkles, Paperclip, Figma, Send, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface PromptTabProps {
  elementTag: string;
  elementId: string;
  currentClasses: string;
  onApplyChanges: (newClasses: string) => void;
}

export const PromptTab = ({ elementTag, elementId, currentClasses, onApplyChanges }: PromptTabProps) => {
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-5');
  const [streamingResponse, setStreamingResponse] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsLoading(true);
    setStreamingResponse('');

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-prompt`;
      
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          prompt: promptText,
          currentClasses,
          elementTag,
        }),
      });

      if (resp.status === 429) {
        toast({
          title: 'Rate limit exceeded',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
        return;
      }

      if (resp.status === 402) {
        toast({
          title: 'Credits required',
          description: 'Please add credits to continue using AI features.',
          variant: 'destructive',
        });
        return;
      }

      if (!resp.ok || !resp.body) {
        throw new Error('Failed to get AI response');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullResponse = '';

      while (true) {
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
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullResponse += content;
              setStreamingResponse(fullResponse);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (fullResponse) {
        onApplyChanges(fullResponse);
        toast({
          title: 'Changes applied',
          description: 'AI generated new styles for your element.',
        });
      }
    } catch (error) {
      console.error('AI prompt error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
            <button
              type="button"
              className="flex p-2 py-1 gap-2 items-center text-[10px] rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 shadow-sm"
              title="Open Prompt Builder"
            >
              <WandSparkles className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="flex items-center rounded-lg bg-card border border-border hover:border-primary/50 shadow-sm p-2 py-1 gap-2 text-[10px] flex-shrink-0 hover:bg-secondary"
              title="Select AI Model"
            >
              <Sparkles className="h-3 w-3" />
              {selectedModel}
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
            <button
              type="button"
              className="flex p-2 py-1 gap-2 items-center text-[10px] rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 shadow-sm"
              title="Attach Files (Max 2)"
            >
              <Paperclip className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="flex p-2 py-1 items-center text-[10px] rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 shadow-sm"
              title="Import from Figma"
            >
              <Figma className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {streamingResponse && (
        <div className="p-2 bg-secondary/50 rounded-lg border border-border">
          <p className="text-[10px] text-muted-foreground mb-1">AI Response:</p>
          <p className="text-xs font-mono">{streamingResponse}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div>
            Selected: <span className="font-medium font-mono text-xs uppercase text-foreground">{elementTag}</span>
          </div>
          <span className="text-[10px]">{elementId}</span>
        </div>
        <div className="font-mono text-[10px] bg-secondary/50 border border-border rounded-lg px-2 py-2">
          {currentClasses}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 mt-2">
          <Button type="submit" disabled={!promptText.trim() || isLoading} className="flex p-2 px-3 gap-2 items-center">
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            {isLoading ? 'Processing...' : 'Apply Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPromptText('');
              setStreamingResponse('');
            }}
            className="p-2 px-3"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">Costs 1 prompt. Don't forget to save changes.</p>
      </div>
    </form>
  );
};
