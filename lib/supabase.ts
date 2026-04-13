import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables! Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string
          created_at: string
          content_type: 'text' | 'url' | 'file'
          content: string
          verdict: 'real' | 'fake'
          confidence_score: number
          risk_level: 'low' | 'medium' | 'high'
          authenticity_score: number
          bias_score: number
          clickbait_score: number
          explanation: string
          keywords: Array<{word: string, type: 'positive' | 'warning'}>
        }
        Insert: {
          id?: string
          created_at?: string
          content_type: 'text' | 'url' | 'file'
          content: string
          verdict: 'real' | 'fake'
          confidence_score: number
          risk_level: 'low' | 'medium' | 'high'
          authenticity_score: number
          bias_score: number
          clickbait_score: number
          explanation: string
          keywords?: Array<{word: string, type: 'positive' | 'warning'}>
        }
        Update: {
          id?: string
          created_at?: string
          content_type?: 'text' | 'url' | 'file'
          content?: string
          verdict?: 'real' | 'fake'
          confidence_score?: number
          risk_level?: 'low' | 'medium' | 'high'
          authenticity_score?: number
          bias_score?: number
          clickbait_score?: number
          explanation?: string
          keywords?: Array<{word: string, type: 'positive' | 'warning'}>
        }
      }
    }
  }
}
