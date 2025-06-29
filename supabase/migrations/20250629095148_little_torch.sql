/*
  # Fix attractions table RLS policy for INSERT operations

  1. Changes
    - Add INSERT policy for attractions table if it doesn't exist
    - Allow authenticated users to insert new attractions

  2. Security
    - Uses IF NOT EXISTS to avoid conflicts with existing policies
    - Maintains security by requiring authentication
*/

-- Add policy to allow authenticated users to insert new attractions (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'attractions' 
    AND policyname = 'Authenticated users can insert attractions'
  ) THEN
    CREATE POLICY "Authenticated users can insert attractions"
      ON attractions
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;