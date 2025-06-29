/*
  # Add policy for attractions table

  This migration adds a policy to allow authenticated users to insert new attractions.
  It uses a DO block to check if the policy already exists before attempting to create it.
*/

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