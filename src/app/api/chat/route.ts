import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const nvidia = createOpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, modelId } = await req.json();
    const modelName = modelId === 'nvidia-deepseek' ? 'deepseek-ai/deepseek-r1' : 'meta/llama-3.1-70b-instruct';
    
    const result = streamText({
      model: nvidia(modelName),
      system: 'You are an expert Embedded Systems AI Co-Pilot for ECE 515.2. Help the user diagnose ESP32 and IoT hardware faults conversationally.',
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[API CRASH]:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
  }
}
