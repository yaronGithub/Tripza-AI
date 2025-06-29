-- Create storage bucket for profile images if it doesn't exist
DO $$
BEGIN
  -- This is a workaround since we can't check if a bucket exists directly
  -- We try to create it and ignore the error if it already exists
  BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('profile-images', 'profile-images', true);
  EXCEPTION WHEN unique_violation THEN
    -- Bucket already exists, do nothing
  END;
END $$;

-- Add storage policies for profile images
DO $$
BEGIN
  -- Policy for users to upload their own profile images
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Users can upload their own profile images'
  ) THEN
    CREATE POLICY "Users can upload their own profile images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'profile-images' AND
      (storage.foldername(name))[1] = 'avatars' AND
      POSITION(auth.uid()::text IN name) > 0
    );
  END IF;

  -- Policy for users to update their own profile images
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Users can update their own profile images'
  ) THEN
    CREATE POLICY "Users can update their own profile images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'profile-images' AND
      (storage.foldername(name))[1] = 'avatars' AND
      POSITION(auth.uid()::text IN name) > 0
    );
  END IF;

  -- Policy for users to read all profile images
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Anyone can read profile images'
  ) THEN
    CREATE POLICY "Anyone can read profile images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'profile-images');
  END IF;
END $$;