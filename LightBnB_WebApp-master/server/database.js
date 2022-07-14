const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const pool = new Pool({
  database: 'lightbnb'
});

const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);

    });
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

exports.getUserWithEmail = getUserWithEmail;
exports.getUserWithId = getUserWithId;
exports.addUser = addUser;
exports.getAllProperties = getAllProperties;
exports.getAllReservations = getAllReservations;



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
