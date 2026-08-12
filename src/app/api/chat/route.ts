import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

const nvidia = createOpenAICompatible({
  name: 'nvidia',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, modelId } = await req.json();
    
    let targetModel = 'meta/llama-3.1-70b-instruct';
    if (modelId === 'nvidia-deepseek') {
      targetModel = 'deepseek-ai/deepseek-r1';
    }

    const result = streamText({
      model: nvidia.chatModel(targetModel),
      system: 'You are an expert Embedded Systems AI Co-Pilot for ECE 515.2. Help the user diagnose ESP32 and IoT hardware faults conversationally.',
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[API CRASH]:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
  }
}
