/*
  # Fix policy creation for attractions table

  1. Changes
    - Add conditional check before creating policy to prevent duplicate policy error
*/

-- Check if policy exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'attractions' 
    AND policyname = 'Authenticated users can insert attractions'
  ) THEN
    -- Add policy to allow authenticated users to insert new attractions
    CREATE POLICY "Authenticated users can insert attractions"
      ON attractions
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;