import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const prompt = `Analyze the following news content and determine if it is real or fake news.
Respond with a JSON object containing the analysis.

Content:
${content}

Required JSON format:
{
  "verdict": "real" or "fake",
  "confidenceScore": integer 0-100,
  "riskLevel": "low", "medium", or "high",
  "authenticityScore": integer 0-100,
  "biasScore": integer 0-100,
  "clickbaitScore": integer 0-100,
  "explanation": "brief explanation string",
  "keywords": [{ "word": "string", "type": "positive" or "warning" }]
}`;

    let response;
    let attempts = 0;
    let lastError: any = null;

    while (attempts < 3) {
      try {
        response = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an expert news analyst specialized in identifying misinformation, bias, and clickbait. You always respond in valid JSON format.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
          temperature: 0.1,
        });
        break;
      } catch (e: any) {
        attempts++;
        lastError = e;
        console.error(`Groq attempt ${attempts} failed:`, e.message);
        
        if (e.status === 429) {
          return NextResponse.json(
            { error: 'AI Rate limit reached. Please wait a moment.' },
            { status: 429 }
          );
        }
        
        if (attempts >= 3) break;
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }

    if (!response || !response.choices[0]?.message?.content) {
      throw new Error(
        'Unable to analyze content: ' +
          (lastError?.message || 'Please ensure your GROQ_API_KEY is set correctly.')
      );
    }

    const text = response.choices[0].message.content;
    const parsedResult = JSON.parse(text);

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze content' },
      { status: 500 }
    );
  }
}



