-- Create CSV files table
CREATE TABLE IF NOT EXISTS public.csv_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  size INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for csv_files table
ALTER TABLE public.csv_files ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view only their own CSV files
CREATE POLICY "Users can view their own CSV files"
  ON public.csv_files
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own CSV files
CREATE POLICY "Users can insert their own CSV files"
  ON public.csv_files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own CSV files
CREATE POLICY "Users can update their own CSV files"
  ON public.csv_files
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own CSV files
CREATE POLICY "Users can delete their own CSV files"
  ON public.csv_files
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create CSV user preferences table
CREATE TABLE IF NOT EXISTS public.csv_user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID NOT NULL REFERENCES public.csv_files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  highlighted_rows INTEGER[] DEFAULT '{}',
  highlighted_columns TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(file_id, user_id)
);

-- Add RLS policies for csv_user_preferences table
ALTER TABLE public.csv_user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view only their own CSV preferences
CREATE POLICY "Users can view their own CSV preferences"
  ON public.csv_user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own CSV preferences
CREATE POLICY "Users can insert their own CSV preferences"
  ON public.csv_user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own CSV preferences
CREATE POLICY "Users can update their own CSV preferences"
  ON public.csv_user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own CSV preferences
CREATE POLICY "Users can delete their own CSV preferences"
  ON public.csv_user_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_csv_files_user_id ON public.csv_files(user_id);
CREATE INDEX IF NOT EXISTS idx_csv_user_preferences_file_id ON public.csv_user_preferences(file_id);
CREATE INDEX IF NOT EXISTS idx_csv_user_preferences_user_id ON public.csv_user_preferences(user_id);
