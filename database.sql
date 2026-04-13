-- Create the analyses table
CREATE TABLE analyses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('text', 'url', 'file')),
  content text NOT NULL,
  verdict text NOT NULL CHECK (verdict IN ('real', 'fake')),
  confidence_score integer NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  authenticity_score integer NOT NULL,
  bias_score integer NOT NULL,
  clickbait_score integer NOT NULL,
  explanation text NOT NULL,
  keywords jsonb DEFAULT '[]'::jsonb NOT NULL
);

-- Turn on Row Level Security (RLS) 
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous clients to insert new analyses
CREATE POLICY "Allow anonymous inserts" ON analyses
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policy to allow anonymous clients to select all analyses
CREATE POLICY "Allow anonymous selects" ON analyses
  FOR SELECT TO anon
  USING (true);
