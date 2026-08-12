import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Health Check Route
export async function GET() {
  return new Response("API IS ALIVE AND ROUTED CORRECTLY", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('--- [API HIT] NEW REQUEST ---');
    console.log('Model ID:', body.modelId);
    
    const targetModel = body.modelId === 'nvidia-deepseek' 
      ? 'deepseek/deepseek-r1:free' 
      : 'meta-llama/llama-3.3-70b-instruct:free';

    console.log('Routing to OpenRouter Model:', targetModel);

    const result = streamText({
      model: openrouter.chat(targetModel),
      messages: body.messages,
    });

    console.log('Stream successfully connected to OpenRouter.');
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[API CRASH]:', error);
    return new Response(JSON.stringify({ error: 'System crash' }), { status: 500 });
  }
}
