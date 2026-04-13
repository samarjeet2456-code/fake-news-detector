import { GoogleGenAI, Type, Schema } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        verdict: { type: Type.STRING, enum: ['real', 'fake'] },
        confidenceScore: { type: Type.INTEGER },
        riskLevel: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
        authenticityScore: { type: Type.INTEGER },
        biasScore: { type: Type.INTEGER },
        clickbaitScore: { type: Type.INTEGER },
        explanation: { type: Type.STRING },
        keywords: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['positive', 'warning'] }
                },
                required: ['word', 'type']
            }
        }
    },
    required: [
        'verdict', 'confidenceScore', 'riskLevel', 
        'authenticityScore', 'biasScore', 'clickbaitScore', 
        'explanation', 'keywords'
    ]
};

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const prompt = `Analyze the following news content and determine if it is real or fake news. Provide scores from 0-100 for confidence, authenticity, bias, and clickbait. Provide a brief explanation and identify key words as positive indicators or warnings.\n\nContent:\n${content}`;

    let response;
    let attempts = 0;
    let lastError = null;
    while (attempts < 3) {
        try {
            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-lite',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                }
            });
            break;
        } catch (e: any) {
            attempts++;
            lastError = e;
            if (attempts >= 3) {
                console.error("AI Rate limit or API error.", e);
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    if (!response || !response.text) {
        throw new Error("Unable to analyze content: " + (lastError?.message || "Please ensure your AI credentials and quotas are active."));
    }

    const text = response.text;
    
    // Robust JSON parsing (handles markdown blocks often returned by Gemini)
    let parsedResult;
    try {
        const cleanText = text.replace(/```json/i, '').replace(/```/g, '').trim();
        parsedResult = JSON.parse(cleanText);
    } catch (parseError) {
        throw new Error("AI returned an invalid format. Please try again.");
    }

    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error('Error in analyze route:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze content' }, { status: 500 });
  }
}
