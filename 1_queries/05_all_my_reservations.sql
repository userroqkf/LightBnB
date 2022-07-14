SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;


-- SELECT properties.id as id, title, start_date, cost_per_night, average_rating
-- FROM properties
--   JOIN property_reviews ON properties.id = property_id
--   JOIN reservations ON reservations.id = reservation_id
--   JOIN (
--     SELECT reservation_id, avg(rating) as average_rating
--     FROM property_reviews
--     GROUP BY property_id) AS average_rating ON reservation_id = reservations.id
-- WHERE reservations.guest_id = 1
-- ORDER BY start_date
-- LIMIT 10;