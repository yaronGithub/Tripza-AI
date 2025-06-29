/*
  # Storage bucket and policies for profile images
  
  1. New Storage
    - Creates a 'profile-images' bucket for user avatars
  
  2. Security
    - Adds policies for uploading, updating, and reading profile images
    - Ensures users can only manage their own images
    - Makes profile images publicly readable
*/

-- Create storage bucket for profile images if it doesn't exist
BEGIN;

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for users to upload their own profile images
CREATE POLICY "Users can upload their own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'avatars' AND
  POSITION(auth.uid()::text IN name) > 0
);

-- Policy for users to update their own profile images
CREATE POLICY "Users can update their own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'avatars' AND
  POSITION(auth.uid()::text IN name) > 0
);

-- Policy for users to read all profile images
CREATE POLICY "Anyone can read profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

COMMIT;