"use strict"

const db = require('./db.js');

// GET functions

/**
 * Get method to fetch all the users data
 * @returns user json response
 */
exports.getAllUsers = function() {
   return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users';
      db.all(query, (err, rows) => {
         if (err) {
            reject(err);
            return;
         }
         const users = rows.map( (row)=> (
            {
               id:row.user_id,
               email:row.email,
               password:row.password
            }));
         resolve(users);
      });
   });
}

// POST functions
