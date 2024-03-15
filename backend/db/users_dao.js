"use strict"

const db = require('./db.js');

// GET functions

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
