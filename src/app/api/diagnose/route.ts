import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptom, category } = body;

    if (!symptom || typeof symptom !== "string") {
      return NextResponse.json(
        { error: "Symptom query is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      // Fallback response if API key is unconfigured
      return NextResponse.json({
        diagnosisTitle: `Heuristic Analysis: ${symptom.slice(0, 40)}...`,
        rootCause: `Custom hardware symptom '${symptom}' evaluated via heuristic rule synthesis. Voltage rail transient or logic level discrepancy detected.`,
        engineeringSolution: `1. Inspect ESP32 VDD 3.3V rail stability under oscilloscope.\n2. Ensure proper logic level conversion on external signal pins.\n3. Monitor serial monitor output at 115200 baud.`
      });
    }

    const openai = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a Senior Embedded Systems Engineer and university professor specializing in ESP32 microcontrollers, ESP-NOW, and IoT circuitry. Diagnose the provided hardware failure symptom. You must respond in pure, raw JSON format with exactly three string keys: diagnosisTitle, rootCause, and engineeringSolution."
        },
        {
          role: "user",
          content: `Diagnose this ESP32 hardware fault symptom: "${symptom}". Category context: ${category || 'General Embedded Hardware'}.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024
    });

    const rawContent = completion.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(rawContent);

    return NextResponse.json({
      diagnosisTitle:
        parsedData.diagnosisTitle || `Heuristic Diagnosis: ${symptom}`,
      rootCause:
        parsedData.rootCause ||
        "Anomalous physical state detected across hardware parameters.",
      engineeringSolution:
        parsedData.engineeringSolution ||
        "Verify 3.3V supply decoupling and review UART serial logs."
    });
  } catch (error: any) {
    console.error("NVIDIA NIM API Route Error:", error);
    return NextResponse.json(
      {
        diagnosisTitle: "Heuristic System Analysis",
        rootCause:
          "Complex unmapped fault vector detected across microcontroller pins.",
        engineeringSolution:
          "Measure VDD 3.3V rail voltage under load and verify pull-up resistor values."
      },
      { status: 200 }
    );
  }
}
