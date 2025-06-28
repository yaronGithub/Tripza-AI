/*
  # Initial TripCraft Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `trips`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `destination` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `preferences` (text array)
      - `is_public` (boolean)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `attractions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text)
      - `description` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `estimated_duration` (integer, minutes)
      - `rating` (decimal)
      - `address` (text)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
    
    - `day_plans`
      - `id` (uuid, primary key)
      - `trip_id` (uuid, references trips)
      - `date` (date)
      - `estimated_travel_time` (integer, minutes)
      - `total_duration` (integer, minutes)
      - `day_order` (integer)
      - `created_at` (timestamp)
    
    - `day_plan_attractions`
      - `id` (uuid, primary key)
      - `day_plan_id` (uuid, references day_plans)
      - `attraction_id` (uuid, references attractions)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public trip viewing
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  destination text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  preferences text[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create attractions table
CREATE TABLE IF NOT EXISTS attractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  latitude decimal NOT NULL,
  longitude decimal NOT NULL,
  estimated_duration integer NOT NULL DEFAULT 60,
  rating decimal DEFAULT 4.0,
  address text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create day_plans table
CREATE TABLE IF NOT EXISTS day_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  estimated_travel_time integer DEFAULT 0,
  total_duration integer DEFAULT 0,
  day_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create day_plan_attractions junction table
CREATE TABLE IF NOT EXISTS day_plan_attractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_plan_id uuid REFERENCES day_plans(id) ON DELETE CASCADE NOT NULL,
  attraction_id uuid REFERENCES attractions(id) ON DELETE CASCADE NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_plan_attractions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can read own trips"
  ON trips
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read public trips"
  ON trips
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can insert own trips"
  ON trips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON trips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON trips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Attractions policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read attractions"
  ON attractions
  FOR SELECT
  TO authenticated
  USING (true);

-- Day plans policies
CREATE POLICY "Users can manage day plans for own trips"
  ON day_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = day_plans.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read day plans for public trips"
  ON day_plans
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = day_plans.trip_id 
      AND trips.is_public = true
    )
  );

-- Day plan attractions policies
CREATE POLICY "Users can manage day plan attractions for own trips"
  ON day_plan_attractions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM day_plans 
      JOIN trips ON trips.id = day_plans.trip_id
      WHERE day_plans.id = day_plan_attractions.day_plan_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read day plan attractions for public trips"
  ON day_plan_attractions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM day_plans 
      JOIN trips ON trips.id = day_plans.trip_id
      WHERE day_plans.id = day_plan_attractions.day_plan_id 
      AND trips.is_public = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_public ON trips(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_day_plans_trip_id ON day_plans(trip_id);
CREATE INDEX IF NOT EXISTS idx_day_plan_attractions_day_plan_id ON day_plan_attractions(day_plan_id);
CREATE INDEX IF NOT EXISTS idx_attractions_type ON attractions(type);