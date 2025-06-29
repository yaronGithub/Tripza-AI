/*
  # Social Features Data Migration (Fixed)

  1. Updates
    - Add social fields to existing profiles
    - Create sample social posts using existing user data
    - Add social interactions (follows, likes, comments)
    - Update counters based on actual data

  2. Data Strategy
    - Work with existing authenticated users
    - Create realistic social data
    - Ensure all foreign key constraints are satisfied
*/

-- First, let's add some sample social data to existing profiles
-- Update existing profiles with enhanced social information
DO $$
DECLARE
    existing_user_id uuid;
    user_count integer;
BEGIN
    -- Check if we have any existing users
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    IF user_count > 0 THEN
        -- Update the first existing user with enhanced profile
        SELECT id INTO existing_user_id FROM profiles LIMIT 1;
        
        UPDATE profiles SET 
            username = COALESCE(username, 'traveler_' || SUBSTRING(id::text, 1, 8)),
            bio = COALESCE(bio, 'Travel enthusiast exploring the world with AI-powered trip planning ✈️'),
            location = COALESCE(location, 'San Francisco, CA'),
            verified = COALESCE(verified, true),
            avatar_url = COALESCE(avatar_url, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face')
        WHERE id = existing_user_id;
        
        -- Update other existing users with varied data
        UPDATE profiles SET 
            username = COALESCE(username, 'explorer_' || SUBSTRING(id::text, 1, 8)),
            bio = COALESCE(bio, 'Adventure seeker and culture enthusiast 🌍'),
            location = COALESCE(location, 'Global Nomad'),
            verified = COALESCE(verified, false),
            avatar_url = COALESCE(avatar_url, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face')
        WHERE id != existing_user_id AND username IS NULL;
    END IF;
END $$;

-- Create sample social posts using existing trips and users
DO $$
DECLARE
    trip_record RECORD;
    user_record RECORD;
    post_id uuid;
    sample_captions text[] := ARRAY[
        'Just finished an incredible journey! The AI trip planner helped me discover amazing hidden gems I never would have found on my own. Already planning my next adventure! ✈️ #TripzaAI #TravelSmart',
        'This trip exceeded all my expectations! Every day was perfectly planned with the right balance of must-see attractions and local experiences. The route optimization saved me so much time! 🗺️ #SmartTravel',
        'Fell in love with this destination! The personalized recommendations were spot-on and matched my interests perfectly. Thank you Tripza AI for making trip planning so easy! 🌟 #AITravel',
        'What an adventure! From iconic landmarks to hidden local spots, this itinerary had it all. The interactive maps made navigation a breeze. Can''t wait to share this trip with friends! 📍 #TravelTech',
        'Best trip ever! The AI really understood my preferences and created the perfect balance of culture, food, and sightseeing. Every moment was optimized for maximum enjoyment! 🎯 #PersonalizedTravel'
    ];
    sample_photos text[][] := ARRAY[
        ARRAY['https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80', 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80'],
        ARRAY['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80'],
        ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
        ARRAY['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80', 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&q=80'],
        ARRAY['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80']
    ];
    caption_index integer := 1;
    photo_index integer := 1;
BEGIN
    -- Create social posts for existing public trips
    FOR trip_record IN 
        SELECT t.*, p.username 
        FROM trips t 
        JOIN profiles p ON t.user_id = p.id 
        WHERE t.is_public = true 
        LIMIT 5
    LOOP
        -- Generate a unique post ID
        post_id := gen_random_uuid();
        
        -- Insert social post
        INSERT INTO social_posts (
            id, 
            user_id, 
            trip_id, 
            caption, 
            photos, 
            likes_count, 
            comments_count, 
            shares_count,
            created_at
        ) VALUES (
            post_id,
            trip_record.user_id,
            trip_record.id,
            sample_captions[caption_index],
            sample_photos[photo_index],
            FLOOR(RANDOM() * 200 + 50)::integer, -- 50-250 likes
            FLOOR(RANDOM() * 30 + 5)::integer,   -- 5-35 comments
            FLOOR(RANDOM() * 15 + 2)::integer,   -- 2-17 shares
            trip_record.created_at + INTERVAL '1 day'
        ) ON CONFLICT (id) DO NOTHING;
        
        -- Increment indexes (cycle through arrays)
        caption_index := (caption_index % array_length(sample_captions, 1)) + 1;
        photo_index := (photo_index % array_length(sample_photos, 1)) + 1;
    END LOOP;
END $$;

-- Create sample follow relationships between existing users
DO $$
DECLARE
    user1_id uuid;
    user2_id uuid;
    user_ids uuid[];
    i integer;
    j integer;
BEGIN
    -- Get all existing user IDs
    SELECT ARRAY(SELECT id FROM profiles ORDER BY created_at LIMIT 10) INTO user_ids;
    
    -- Create follow relationships (each user follows 2-3 others)
    FOR i IN 1..array_length(user_ids, 1) LOOP
        FOR j IN 1..array_length(user_ids, 1) LOOP
            -- Skip self-follows and create some random follows
            IF i != j AND RANDOM() > 0.6 THEN
                INSERT INTO user_follows (follower_id, following_id)
                VALUES (user_ids[i], user_ids[j])
                ON CONFLICT (follower_id, following_id) DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Create sample likes for existing posts
DO $$
DECLARE
    post_record RECORD;
    user_record RECORD;
    like_count integer;
BEGIN
    -- Add likes to existing posts
    FOR post_record IN SELECT id, user_id FROM social_posts LOOP
        like_count := 0;
        
        -- Each post gets likes from random users (but not from the post author)
        FOR user_record IN 
            SELECT id FROM profiles 
            WHERE id != post_record.user_id 
            ORDER BY RANDOM() 
            LIMIT FLOOR(RANDOM() * 5 + 2)::integer -- 2-7 likes per post
        LOOP
            INSERT INTO post_likes (post_id, user_id)
            VALUES (post_record.id, user_record.id)
            ON CONFLICT (post_id, user_id) DO NOTHING;
            
            like_count := like_count + 1;
        END LOOP;
    END LOOP;
END $$;

-- Create sample comments for existing posts
DO $$
DECLARE
    post_record RECORD;
    user_record RECORD;
    sample_comments text[] := ARRAY[
        'Amazing trip! Your photos are incredible 😍',
        'This looks like such an adventure! Adding to my bucket list',
        'Love how well-planned this itinerary is! The AI really knows what it''s doing',
        'Your travel content always inspires me to explore more 🌟',
        'This destination is absolutely beautiful! Great recommendations',
        'The route optimization really shows - you covered so much ground efficiently!',
        'Thanks for sharing! This gives me so many ideas for my next trip',
        'Your photography skills are amazing! Every shot tells a story',
        'I''ve been to this place too and you captured it perfectly!',
        'The AI trip planner really found some hidden gems here! 💎'
    ];
    comment_text text;
BEGIN
    -- Add comments to existing posts
    FOR post_record IN SELECT id, user_id FROM social_posts LOOP
        -- Each post gets 1-3 comments from random users
        FOR user_record IN 
            SELECT id FROM profiles 
            WHERE id != post_record.user_id 
            ORDER BY RANDOM() 
            LIMIT FLOOR(RANDOM() * 3 + 1)::integer
        LOOP
            -- Pick a random comment
            comment_text := sample_comments[FLOOR(RANDOM() * array_length(sample_comments, 1) + 1)];
            
            INSERT INTO post_comments (post_id, user_id, content)
            VALUES (post_record.id, user_record.id, comment_text)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Create some saved posts relationships
DO $$
DECLARE
    post_record RECORD;
    user_record RECORD;
BEGIN
    -- Users save interesting posts from others
    FOR post_record IN SELECT id, user_id FROM social_posts LOOP
        FOR user_record IN 
            SELECT id FROM profiles 
            WHERE id != post_record.user_id 
            ORDER BY RANDOM() 
            LIMIT FLOOR(RANDOM() * 2 + 1)::integer -- 1-3 saves per post
        LOOP
            INSERT INTO saved_posts (user_id, post_id)
            VALUES (user_record.id, post_record.id)
            ON CONFLICT (user_id, post_id) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Update all profile counters based on actual data
UPDATE profiles SET 
    followers_count = (
        SELECT COUNT(*) 
        FROM user_follows 
        WHERE following_id = profiles.id
    ),
    following_count = (
        SELECT COUNT(*) 
        FROM user_follows 
        WHERE follower_id = profiles.id
    ),
    posts_count = (
        SELECT COUNT(*) 
        FROM social_posts 
        WHERE user_id = profiles.id
    );

-- Update post counters based on actual interactions
UPDATE social_posts SET 
    likes_count = (
        SELECT COUNT(*) 
        FROM post_likes 
        WHERE post_id = social_posts.id
    ),
    comments_count = (
        SELECT COUNT(*) 
        FROM post_comments 
        WHERE post_id = social_posts.id
    );

-- Add some trending destinations data by updating trip titles to be more social-friendly
UPDATE trips SET 
    title = CASE 
        WHEN destination ILIKE '%san francisco%' THEN 'SF Golden Gate & Foodie Adventure'
        WHEN destination ILIKE '%new york%' THEN 'NYC Museums & Central Park Explorer'
        WHEN destination ILIKE '%paris%' THEN 'Paris Art & Culture Immersion'
        WHEN destination ILIKE '%london%' THEN 'London History & Royal Tour'
        WHEN destination ILIKE '%tokyo%' THEN 'Tokyo Culture & Cuisine Journey'
        ELSE title
    END,
    description = CASE 
        WHEN description IS NULL OR description = '' THEN 
            'An amazing AI-generated trip featuring the best of ' || destination || 
            ' with perfectly optimized routes and personalized recommendations!'
        ELSE description
    END
WHERE is_public = true;