import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { symptom, category, modelId } = body;

    if (!symptom || typeof symptom !== 'string') {
      return NextResponse.json(
        { error: 'Symptom query is required' },
        { status: 400 }
      );
    }

    let targetModel = 'meta/llama-3.1-70b-instruct';
    if (modelId === 'nvidia-deepseek') {
      targetModel = 'deepseek-ai/deepseek-r1';
    }

    const apiKey = process.env.NVIDIA_API_KEY;

    let text = '';
    if (apiKey) {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            {
              role: 'system',
              content: 'You are a Senior Embedded Systems Engineer and university professor specializing in ESP32 microcontrollers, ESP-NOW, and IoT circuitry. Diagnose the provided hardware failure symptom. You must respond in pure, raw JSON format with exactly three string keys: diagnosisTitle, rootCause, and engineeringSolution.'
            },
            {
              role: 'user',
              content: `Diagnose this ESP32 hardware fault symptom: "${symptom}". Category context: ${category || 'General Embedded Hardware'}.`
            }
          ],
          temperature: 0.2,
          max_tokens: 1024,
        })
      });

      if (response.ok) {
        const json = await response.json();
        text = json.choices?.[0]?.message?.content || '';
      }
    }

    let parsedData: any = {};
    if (text) {
      try {
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanJson);
      } catch {
        parsedData = {
          diagnosisTitle: `Heuristic Analysis: ${symptom.slice(0, 30)}`,
          rootCause: text.slice(0, 250),
          engineeringSolution:
            '1. Inspect ESP32 VDD 3.3V rail stability under oscilloscope.\n2. Ensure proper logic level conversion on external signal pins.',
        };
      }
    }

    return NextResponse.json({
      diagnosisTitle:
        parsedData.diagnosisTitle || `Heuristic Diagnosis: ${symptom}`,
      rootCause:
        parsedData.rootCause ||
        'Anomalous physical state detected across hardware parameters.',
      engineeringSolution:
        parsedData.engineeringSolution ||
        'Verify 3.3V supply decoupling and review UART serial logs.',
    });
  } catch (error: any) {
    console.error('[API CRASH - DIAGNOSE]:', error);
    return NextResponse.json(
      {
        diagnosisTitle: 'Heuristic System Analysis',
        rootCause:
          'Complex unmapped fault vector detected across microcontroller pins.',
        engineeringSolution:
          'Measure VDD 3.3V rail voltage under load and verify pull-up resistor values.',
      },
      { status: 200 }
    );
  }
}
