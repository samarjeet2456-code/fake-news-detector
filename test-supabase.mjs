import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
    console.log("Testing Supabase insertion...");
    const { error } = await supabase.from('analyses').insert({
        content_type: 'text',
        content: 'test content',
        verdict: 'fake',
        confidence_score: 99,
        risk_level: 'high',
        authenticity_score: 10,
        bias_score: 90,
        clickbait_score: 80,
        explanation: 'test explanation',
        keywords: [{ word: 'test', type: 'warning' }]
    });

    if (error) {
        console.error("Supabase Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Supabase insert succeeded!");
    }
}

testSupabase();
