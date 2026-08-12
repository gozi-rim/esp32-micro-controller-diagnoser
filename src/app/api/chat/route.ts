import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText, wrapLanguageModel, extractReasoningMiddleware } from 'ai';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, modelId } = await req.json();

    // Route to free models via OpenRouter
    const targetModel = modelId === 'nvidia-deepseek' 
      ? 'deepseek/deepseek-r1:free' 
      : 'meta-llama/llama-3.3-70b-instruct:free';

    const enhancedModel = wrapLanguageModel({
      model: openrouter(targetModel),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    });

    const result = streamText({
      model: enhancedModel,
      system: 'You are an expert Embedded Systems AI Co-Pilot for ECE 515.2. Help the user diagnose ESP32 and IoT hardware faults conversationally.',
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[API CRASH]:', error);
    return new Response(JSON.stringify({ error: 'System crash' }), { status: 500 });
  }
}
