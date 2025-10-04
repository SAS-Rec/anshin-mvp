-- Create user_sessions table to track user visits and location sharing
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  location_shared BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hospital_interactions table to track user interactions with hospitals
CREATE TABLE public.hospital_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  hospital_id TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- 'view', 'call', 'directions'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for analytics)
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_interactions ENABLE ROW LEVEL SECURITY;

-- Policies for public access (no auth required)
CREATE POLICY "Anyone can insert sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view sessions" 
ON public.user_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can insert interactions" 
ON public.hospital_interactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view interactions" 
ON public.hospital_interactions 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_sessions_updated_at
BEFORE UPDATE ON public.user_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX idx_hospital_interactions_session_id ON public.hospital_interactions(session_id);
CREATE INDEX idx_hospital_interactions_hospital_id ON public.hospital_interactions(hospital_id);
CREATE INDEX idx_hospital_interactions_created_at ON public.hospital_interactions(created_at DESC);