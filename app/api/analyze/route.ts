import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const prompt = `Analyze the following news content and determine if it is real or fake news.
Return ONLY a valid JSON object with exactly these fields:
{
  "verdict": "real" or "fake",
  "confidenceScore": integer 0-100,
  "riskLevel": "low", "medium", or "high",
  "authenticityScore": integer 0-100,
  "biasScore": integer 0-100,
  "clickbaitScore": integer 0-100,
  "explanation": "brief explanation string",
  "keywords": [{ "word": "string", "type": "positive" or "warning" }]
}

Content:
${content}`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    let response;
    let attempts = 0;
    let lastError: any = null;

    while (attempts < 3) {
      try {
        const result = await model.generateContent(prompt);
        response = result.response;
        break;
      } catch (e: any) {
        attempts++;
        lastError = e;
        console.error(`AI attempt ${attempts} failed:`, e.message);
        if (attempts >= 3) break;
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempts));
      }
    }

    if (!response) {
      throw new Error(
        'Unable to analyze content: ' +
          (lastError?.message || 'Please ensure your GEMINI_API_KEY is set correctly in Vercel environment variables.')
      );
    }

    const text = response.text();

    if (!text) {
      throw new Error('AI returned an empty response. Please try again.');
    }

    // Robust JSON parsing (handles markdown code blocks sometimes returned by Gemini)
    let parsedResult;
    try {
      const cleanText = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleanText);
    } catch {
      throw new Error('AI returned an invalid format. Please try again.');
    }

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze content' },
      { status: 500 }
    );
  }
}

