/*
  # Update trips policies

  1. Updated Policies
    - Add policy to allow users to read public trips
    - Ensure users can update their own trips
*/

-- Check if policies exist before creating them
DO $$
BEGIN
  -- Policy for reading public trips
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'trips' 
    AND policyname = 'Users can read public trips'
  ) THEN
    CREATE POLICY "Users can read public trips"
      ON trips
      FOR SELECT
      TO authenticated
      USING (is_public = true);
  END IF;

  -- Policy for updating own trips
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'trips' 
    AND policyname = 'Users can update own trips'
  ) THEN
    CREATE POLICY "Users can update own trips"
      ON trips
      FOR UPDATE
      TO authenticated
      USING (uid() = user_id)
      WITH CHECK (uid() = user_id);
  END IF;
END $$;