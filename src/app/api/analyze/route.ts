import { NextResponse } from 'next/server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateObject } from 'ai';
import { z } from 'zod';

const AnalysisSchema = z.object({
  rootCause: z.string(),
  remediationSteps: z.array(z.string())
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customLogs } = body;

    if (!customLogs || !Array.isArray(customLogs) || customLogs.length === 0) {
      return NextResponse.json(
        { error: 'customLogs array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY is not configured in environment' },
        { status: 500 }
      );
    }

    const openrouter = createOpenRouter({
      apiKey: apiKey
    });

    const logsText = customLogs.map((log: string, index: number) => `Log #${index + 1}: ${log}`).join('\n');

    const { object } = await generateObject({
      model: openrouter('meta-llama/llama-3.1-70b-instruct'),
      schema: AnalysisSchema,
      system: `You are a Senior Embedded Hardware Engineer specializing in ESP32 microcontrollers, ESP-NOW, and IoT circuitry. Diagnose the provided ESP32 hardware failure based on the user's custom logged symptoms. Provide a highly technical, specific root cause analysis and a list of step-by-step engineering remediation steps. Do not return generic boilerplate responses.`,
      prompt: `Recorded Custom Hardware Failure Symptoms:\n${logsText}\n\nAnalyze these symptoms thoroughly and produce the rootCause and remediationSteps JSON object.`
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error('[API ERROR - /api/analyze]:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate AI hardware analysis',
        message: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
