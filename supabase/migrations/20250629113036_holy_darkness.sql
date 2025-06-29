/*
  # Add post comments functionality

  1. New Policies
    - Add policy to allow users to read all comments
    - Add policy to allow users to insert their own comments
    - Add policy to allow users to update their own comments
    - Add policy to allow users to delete their own comments
*/

-- Check if policies exist before creating them
DO $$
BEGIN
  -- Policy for reading comments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' 
    AND policyname = 'Users can read all comments'
  ) THEN
    CREATE POLICY "Users can read all comments"
      ON post_comments
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for inserting comments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' 
    AND policyname = 'Users can insert own comments'
  ) THEN
    CREATE POLICY "Users can insert own comments"
      ON post_comments
      FOR INSERT
      TO authenticated
      WITH CHECK (uid() = user_id);
  END IF;

  -- Policy for updating comments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' 
    AND policyname = 'Users can update own comments'
  ) THEN
    CREATE POLICY "Users can update own comments"
      ON post_comments
      FOR UPDATE
      TO authenticated
      USING (uid() = user_id)
      WITH CHECK (uid() = user_id);
  END IF;

  -- Policy for deleting comments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' 
    AND policyname = 'Users can delete own comments'
  ) THEN
    CREATE POLICY "Users can delete own comments"
      ON post_comments
      FOR DELETE
      TO authenticated
      USING (uid() = user_id);
  END IF;
END $$;