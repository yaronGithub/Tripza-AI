/*
  # Add INSERT policy for attractions table

  1. Security
    - Add policy allowing authenticated users to insert new attractions
    - This is necessary for trip saving functionality
*/

-- Add policy to allow authenticated users to insert new attractions
CREATE POLICY "Authenticated users can insert attractions"
  ON attractions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);