/*
  # Add INSERT policy for attractions table

  1. Security Changes
    - Add policy to allow authenticated users to insert new attractions
    - This enables the trip saving functionality to work properly when new attractions need to be created

  The policy allows any authenticated user to insert attractions, which is appropriate since:
  - Attractions are public data that benefit all users
  - The app needs to create attractions when they don't exist in the database
  - There's no user-specific ownership model for attractions (they're shared resources)
*/

-- Add policy to allow authenticated users to insert new attractions
CREATE POLICY "Authenticated users can insert attractions"
  ON attractions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);