import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Validate request payload
interface AIPromptRequest {
  prompt: string;
  model?: string;
  currentState?: {
    element?: string;
    classes?: string;
    textContent?: string;
  };
}

const validateRequest = (data: unknown): AIPromptRequest | null => {
  if (typeof data !== "object" || data === null) return null;

  const req = data as Record<string, unknown>;
  if (typeof req.prompt !== "string" || !req.prompt.trim()) return null;

  return {
    prompt: (req.prompt as string).trim(),
    model: typeof req.model === "string" ? req.model : undefined,
    currentState: typeof req.currentState === "object" ? (req.currentState as any) : undefined,
  };
};

const generateSystemPrompt = (state?: AIPromptRequest["currentState"]): string => {
  return `You are a Tailwind CSS expert assistant. Your job is to help modify UI element styles based on user requests.

Current element state:
- Element tag: ${state?.element || 'div'}
- Current Tailwind classes: ${state?.classes || ''}
- Text content: ${state?.textContent || ''}

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
- Always respond with valid JSON, no markdown, no code blocks, no explanations

Example response:
{"tailwindClasses":"px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors","textContent":"Updated text"}`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Parse and validate request
    let requestData: AIPromptRequest;
    try {
      const body = await req.json();
      const validated = validateRequest(body);
      if (!validated) {
        return new Response(
          JSON.stringify({ error: "Invalid request: prompt is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      requestData = validated;
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("AI Prompt request:", {
      promptLength: requestData.prompt.length,
      model: requestData.model,
      hasState: !!requestData.currentState
    });

    // Get Groq API key
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call Groq API (OpenAI-compatible endpoint)
    // Models available: mixtral-8x7b-32768, llama2-70b-4096, gemma-7b-it
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: requestData.model || "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: generateSystemPrompt(requestData.currentState) },
          { role: "user", content: requestData.prompt },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    // Handle specific error codes
    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a few moments." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status === 402) {
        console.warn("Payment required");
        return new Response(
          JSON.stringify({ error: "Insufficient credits. Please add funds to your Lovable AI account." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status === 401) {
        console.error("Authentication failed");
        return new Response(
          JSON.stringify({ error: "Authentication failed" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text().catch(() => "Unknown error");
      console.error("AI gateway error:", response.status, errorText.substring(0, 200));

      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Stream the response back with proper headers
    return new Response(response.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI prompt error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
