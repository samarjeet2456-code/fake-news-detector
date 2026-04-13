import { GoogleGenAI, Type } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: 'AIzaSyDb7IE6IbSQBG686kgWZnxxwTnjdm-Jt4Q' });
ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: 'test',
}).then(r => console.log('success', r.text)).catch(e => console.error(e));
