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

exports.getUser = function(email) {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE users.email = ?';
      db.get(sql, [email], (err, row) => {
         if (err) reject(err);
         else resolve(row);
      });
   });
};

exports.getUserById = function(id) {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE users.user_id = ?';
      db.get(sql, [id], (err, row) => {
         if (err) reject(err);
         else resolve(row);
      });
   });
};
