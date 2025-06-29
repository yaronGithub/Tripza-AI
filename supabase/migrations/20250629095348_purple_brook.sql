/*
  # Fix policy for attractions table

  This migration checks if the policy "Authenticated users can insert attractions" already exists
  before trying to create it, to avoid the "policy already exists" error.
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