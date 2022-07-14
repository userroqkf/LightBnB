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

exports.getUserWithEmail = getUserWithEmail;
exports.getUserWithId = getUserWithId;
exports.addUser = addUser;
exports.getAllProperties = getAllProperties;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
};
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
