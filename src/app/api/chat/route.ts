import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "NVIDIA API Key is missing" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: apiKey
    });

    const formattedMessages = [
      {
        role: "system",
        content:
          "You are an expert Embedded Systems AI Co-Pilot for ECE 515.2 (Introduction to Artificial Intelligence). Help the user diagnose ESP32, ESP-NOW, Wi-Fi, GPIO logic, and IoT hardware faults conversationally. Keep responses concise, precise, and highly technical."
      },
      ...messages
    ];

    const stream = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: formattedMessages,
      temperature: 0.3,
      max_tokens: 1024,
      stream: true
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI co-pilot response" },
      { status: 500 }
    );
  }
}
