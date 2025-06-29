/*
  # Seed Social Media Data

  1. Sample Users
    - Create sample profiles with social data
    
  2. Sample Posts
    - Create sample social posts with trips
    
  3. Sample Interactions
    - Likes, follows, comments
*/

-- Update existing profiles with social data
UPDATE profiles SET 
  username = 'admin_user',
  bio = 'Travel enthusiast and AI trip planning expert ✈️',
  location = 'San Francisco, CA',
  verified = true
WHERE email LIKE '%@%' 
AND username IS NULL;

-- Insert sample users
INSERT INTO profiles (id, email, name, username, bio, location, verified, avatar_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sarah@example.com', 'Sarah Chen', 'sarahexplores', 'Digital nomad • Travel photographer • Coffee addict ☕ Currently exploring Europe 🇪🇺', 'Paris, France', true, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'),
('550e8400-e29b-41d4-a716-446655440002', 'mike@example.com', 'Mike Rodriguez', 'mikeadventures', 'Adventure seeker and foodie 🍜 Sharing authentic travel experiences from around the world', 'Austin, TX', false, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
('550e8400-e29b-41d4-a716-446655440003', 'emma@example.com', 'Emma Thompson', 'emmaroams', 'Solo traveler and nature lover 🌲 Documenting sustainable travel practices', 'London, UK', true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'),
('550e8400-e29b-41d4-a716-446655440004', 'alex@example.com', 'Alex Rivera', 'alexexplores', 'Adventure photographer capturing the world one frame at a time 📸', 'Barcelona, Spain', true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'),
('550e8400-e29b-41d4-a716-446655440005', 'maya@example.com', 'Maya Patel', 'mayatravels', 'Solo travel enthusiast and cultural explorer 🌍 Sharing tips for fearless female travelers', 'Mumbai, India', false, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face')
ON CONFLICT (id) DO NOTHING;

-- Insert sample trips for social posts
INSERT INTO trips (id, user_id, title, destination, start_date, end_date, preferences, is_public, description) VALUES
('trip-social-001', '550e8400-e29b-41d4-a716-446655440001', 'Paris Art & Culture Immersion', 'Paris, France', '2024-03-15', '2024-03-18', ARRAY['Museums & Galleries', 'Art & Culture'], true, 'A perfect 4-day cultural journey through Paris featuring world-class museums and hidden artistic gems'),
('trip-social-002', '550e8400-e29b-41d4-a716-446655440002', 'Tokyo Foodie Adventure', 'Tokyo, Japan', '2024-02-10', '2024-02-14', ARRAY['Restaurants & Foodie Spots', 'Art & Culture'], true, 'An incredible culinary exploration of Tokyo from street food to michelin-starred restaurants'),
('trip-social-003', '550e8400-e29b-41d4-a716-446655440003', 'SF Nature & Adventure', 'San Francisco, CA', '2024-03-12', '2024-03-15', ARRAY['Parks & Nature', 'Adventure & Outdoors'], true, 'Outdoor adventure through San Francisco beautiful parks and scenic trails'),
('trip-social-004', '550e8400-e29b-41d4-a716-446655440004', 'Barcelona Architecture Tour', 'Barcelona, Spain', '2024-01-20', '2024-01-24', ARRAY['Historical Sites', 'Art & Culture'], true, 'Exploring Gaudí masterpieces and architectural wonders of Barcelona'),
('trip-social-005', '550e8400-e29b-41d4-a716-446655440005', 'Mumbai Street Food Journey', 'Mumbai, India', '2024-02-01', '2024-02-05', ARRAY['Restaurants & Foodie Spots', 'Art & Culture'], true, 'Authentic street food adventure through the vibrant neighborhoods of Mumbai')
ON CONFLICT (id) DO NOTHING;

-- Insert sample social posts
INSERT INTO social_posts (id, user_id, trip_id, caption, photos, likes_count, comments_count, shares_count, created_at) VALUES
('post-001', '550e8400-e29b-41d4-a716-446655440001', 'trip-social-001', 
'Just finished an incredible 4-day art journey through Paris! The Louvre was absolutely breathtaking, and I discovered some amazing hidden galleries in Montmartre. Who else loves getting lost in art museums? 🎨✨ #ParisArt #TravelWithTripza', 
ARRAY['https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80', 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80', 'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&q=80'], 
234, 18, 12, '2024-03-20T14:30:00Z'),

('post-002', '550e8400-e29b-41d4-a716-446655440002', 'trip-social-002', 
'Tokyo blew my mind! From street food in Shibuya to michelin-starred ramen, every meal was an adventure. The AI trip planner helped me discover places I never would have found. Already planning my next trip! 🍜🇯🇵 #TokyoFood #AITravel', 
ARRAY['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80'], 
189, 25, 8, '2024-03-18T09:15:00Z'),

('post-003', '550e8400-e29b-41d4-a716-446655440003', 'trip-social-003', 
'Golden Gate Bridge at sunrise hits different! 🌅 Spent the weekend hiking through SF amazing parks and trails. The route optimization in Tripza AI saved me so much time - I got to see twice as many spots! Nature therapy at its finest 🌲 #SanFrancisco #NatureTherapy', 
ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80'], 
156, 12, 6, '2024-03-16T18:45:00Z'),

('post-004', '550e8400-e29b-41d4-a716-446655440004', 'trip-social-004', 
'Barcelona architecture is pure poetry in stone! 🏛️ Spent 5 days exploring Gaudí masterpieces and fell in love with every curve and detail. Park Güell at sunset was absolutely magical. Architecture lovers, this city is a must! #Barcelona #Gaudi #Architecture', 
ARRAY['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80', 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&q=80'], 
298, 31, 15, '2024-01-26T16:20:00Z'),

('post-005', '550e8400-e29b-41d4-a716-446655440005', 'trip-social-005', 
'Mumbai street food is an explosion of flavors! 🌶️ From vada pav to pani puri, every bite tells a story. The local vendors taught me so much about authentic Indian cuisine. Food is truly the best way to understand a culture! #Mumbai #StreetFood #IndianCuisine', 
ARRAY['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80'], 
167, 22, 9, '2024-02-07T12:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample follows
INSERT INTO user_follows (follower_id, following_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (follower_id, following_id) DO NOTHING;

-- Insert sample likes
INSERT INTO post_likes (post_id, user_id) VALUES
('post-001', '550e8400-e29b-41d4-a716-446655440002'),
('post-001', '550e8400-e29b-41d4-a716-446655440003'),
('post-001', '550e8400-e29b-41d4-a716-446655440004'),
('post-002', '550e8400-e29b-41d4-a716-446655440001'),
('post-002', '550e8400-e29b-41d4-a716-446655440003'),
('post-002', '550e8400-e29b-41d4-a716-446655440005'),
('post-003', '550e8400-e29b-41d4-a716-446655440001'),
('post-003', '550e8400-e29b-41d4-a716-446655440002'),
('post-004', '550e8400-e29b-41d4-a716-446655440001'),
('post-004', '550e8400-e29b-41d4-a716-446655440002'),
('post-004', '550e8400-e29b-41d4-a716-446655440003'),
('post-005', '550e8400-e29b-41d4-a716-446655440001'),
('post-005', '550e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (post_id, user_id) DO NOTHING;

-- Insert sample comments
INSERT INTO post_comments (post_id, user_id, content) VALUES
('post-001', '550e8400-e29b-41d4-a716-446655440002', 'Amazing photos! The Louvre is definitely on my bucket list now 😍'),
('post-001', '550e8400-e29b-41d4-a716-446655440003', 'Love your photography style! Those Montmartre shots are incredible'),
('post-002', '550e8400-e29b-41d4-a716-446655440001', 'Tokyo food scene is unmatched! Which ramen place was your favorite?'),
('post-002', '550e8400-e29b-41d4-a716-446655440003', 'The AI trip planner really does find hidden gems! Planning my Tokyo trip now'),
('post-003', '550e8400-e29b-41d4-a716-446655440002', 'That Golden Gate sunrise shot is wallpaper worthy! 🌅'),
('post-004', '550e8400-e29b-41d4-a716-446655440001', 'Gaudí was a genius! Barcelona architecture is so unique'),
('post-005', '550e8400-e29b-41d4-a716-446655440004', 'Street food is the best way to experience local culture! Looks delicious 🌶️')
ON CONFLICT DO NOTHING;

-- Update follower counts based on actual follows
UPDATE profiles SET 
  followers_count = (SELECT COUNT(*) FROM user_follows WHERE following_id = profiles.id),
  following_count = (SELECT COUNT(*) FROM user_follows WHERE follower_id = profiles.id),
  posts_count = (SELECT COUNT(*) FROM social_posts WHERE user_id = profiles.id);