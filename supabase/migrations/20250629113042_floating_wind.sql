/*
  # Update profile policies

  1. Updated Policies
    - Modify policy to allow users to update their own profile
    - Ensure users can read all profiles for social features
*/

-- Check if policies exist before creating them
DO $$
BEGIN
  -- Policy for updating profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (uid() = id)
      WITH CHECK (uid() = id);
  END IF;

  -- Policy for reading all profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can read all profiles'
  ) THEN
    CREATE POLICY "Users can read all profiles"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;