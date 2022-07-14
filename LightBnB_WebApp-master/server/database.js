const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const pool = new Pool({
  database: 'lightbnb'
});

const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  // 3
  const queryChecker = () => {
    if (queryParams.length > 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }
  };

  if (options.city) {
    queryChecker();
    queryParams.push(`%${options.city}%`);
    queryString += `city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryChecker();
    queryParams.push(options.minimum_price_per_night);
    queryParams.push(options.maximum_price_per_night);
    queryString += `cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryChecker();
    queryParams.push(options.minimum_rating);
    queryString += `rating >= $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

const getUserWithEmail = (email) => {
  return pool
    .query('SELECT * FROM users WHERE email=$1;', [email])
    .then(result => {
      console.log(result.rows);
      return result.rows[0];
    });
};

const getUserWithId = (id) => {
  return pool
    .query('SELECT * FROM users WHERE id=$1;', [id])
    .then(result => {
      console.log(result.rows);
      return result.rows[0];
    });
};

const addUser = (obj) => {
  const {name, email, password} = obj;
  return pool.
    query('INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *;', [name, email, password])
    .then(result => {
      console.log(result.rows);
      return result.rows[0];
    });
};

const getAllReservations = function (guest_id, limit = 10) {
  return pool.
    query(`
    SELECT reservations.*, properties.*
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
    `, [guest_id, limit])
    .then(result => {
      console.log(result.rows);
      return result.rows;
    });
};

const addProperty = function(property) {
  const {owner_id,title,description,thumbnail_photo_url,cover_photo_url,cost_per_night,
    street,city,province,post_code,country,parking_spaces,number_of_bathrooms,
    number_of_bedrooms} = property;
  const text = `
  INSERT INTO properties 
  (owner_id,title,description,thumbnail_photo_url,cover_photo_url,
    cost_per_night,street,city,province,post_code,country,parking_spaces,
    number_of_bathrooms,number_of_bedrooms) VALUES ($1, $2, $3, $4 , $5, $6, $7,
      $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
  const values = [owner_id,title,description,thumbnail_photo_url,
    cover_photo_url,cost_per_night,street,city,province,post_code,country,
    parking_spaces,number_of_bathrooms,number_of_bedrooms];
  return pool.
    query(text, values)
    .then(result => result.rows);
};

exports.getUserWithEmail = getUserWithEmail;
exports.getUserWithId = getUserWithId;
exports.addUser = addUser;
exports.getAllProperties = getAllProperties;
exports.getAllReservations = getAllReservations;
exports.addProperty = addProperty;
