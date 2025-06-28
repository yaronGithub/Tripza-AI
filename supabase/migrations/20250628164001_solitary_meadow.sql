/*
  # Seed Attractions Data

  1. Attractions
    - Add sample attractions for San Francisco and New York
    - Include all attraction types from the application
*/

-- Insert San Francisco attractions
INSERT INTO attractions (name, type, description, latitude, longitude, estimated_duration, rating, address, image_url) VALUES
('Golden Gate Bridge', 'Parks & Nature', 'Iconic suspension bridge and symbol of San Francisco', 37.8199, -122.4783, 90, 4.7, 'Golden Gate Bridge, San Francisco, CA', 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg'),
('Alcatraz Island', 'Historical Sites', 'Former federal prison on an island in San Francisco Bay', 37.8267, -122.4230, 180, 4.5, 'Alcatraz Island, San Francisco, CA', 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg'),
('Fisherman''s Wharf', 'Restaurants & Foodie Spots', 'Waterfront area with seafood restaurants and shops', 37.8080, -122.4177, 120, 4.2, 'Fisherman''s Wharf, San Francisco, CA', 'https://images.pexels.com/photos/161663/san-francisco-california-fishermans-wharf-161663.jpeg'),
('Lombard Street', 'Historical Sites', 'The most crooked street in the world', 37.8021, -122.4187, 45, 4.0, 'Lombard Street, San Francisco, CA', 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg'),
('Golden Gate Park', 'Parks & Nature', 'Large urban park with gardens, museums, and recreational areas', 37.7694, -122.4862, 180, 4.6, 'Golden Gate Park, San Francisco, CA', 'https://images.pexels.com/photos/1006293/pexels-photo-1006293.jpeg'),
('Museum of Modern Art', 'Museums & Galleries', 'Premier modern and contemporary art museum', 37.7857, -122.4011, 150, 4.4, '151 3rd St, San Francisco, CA 94103', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'),
('Chinatown', 'Art & Culture', 'Historic neighborhood with authentic Chinese culture', 37.7941, -122.4078, 120, 4.3, 'Chinatown, San Francisco, CA', 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg'),
('Union Square', 'Shopping Districts', 'Central shopping and hotel district', 37.7880, -122.4074, 90, 4.1, 'Union Square, San Francisco, CA', 'https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg');

-- Insert New York attractions
INSERT INTO attractions (name, type, description, latitude, longitude, estimated_duration, rating, address, image_url) VALUES
('Central Park', 'Parks & Nature', 'Large public park in Manhattan', 40.7829, -73.9654, 180, 4.7, 'Central Park, New York, NY', 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg'),
('Statue of Liberty', 'Historical Sites', 'Symbol of freedom and democracy', 40.6892, -74.0445, 240, 4.6, 'Liberty Island, New York, NY', 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg'),
('Times Square', 'Nightlife', 'Bright lights and Broadway theaters', 40.7580, -73.9855, 90, 4.2, 'Times Square, New York, NY', 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg'),
('Metropolitan Museum', 'Museums & Galleries', 'World-renowned art museum', 40.7794, -73.9632, 180, 4.8, '1000 5th Ave, New York, NY 10028', 'https://images.pexels.com/photos/247676/pexels-photo-247676.jpeg'),
('Brooklyn Bridge', 'Historical Sites', 'Historic suspension bridge connecting Manhattan and Brooklyn', 40.7061, -73.9969, 60, 4.5, 'Brooklyn Bridge, New York, NY', 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg'),
('High Line', 'Parks & Nature', 'Elevated linear park built on former railway tracks', 40.7480, -74.0048, 90, 4.4, 'High Line, New York, NY', 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg'),
('9/11 Memorial', 'Historical Sites', 'Memorial honoring victims of September 11 attacks', 40.7115, -74.0134, 120, 4.7, '180 Greenwich St, New York, NY 10007', 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg'),
('Little Italy', 'Restaurants & Foodie Spots', 'Historic neighborhood known for Italian cuisine', 40.7195, -73.9967, 90, 4.0, 'Little Italy, New York, NY', 'https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg');