"use strict"

const db = require('./db.js');
const bcrypt = require('bcrypt')

// GET functions

/**
 * Get method to fetch the user by email
 * @param {*} email 
 */
exports.getUser = function(email) {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE users.email = ?';
      db.get(sql, [email], (err, row) => {
         if (err) reject(err);
         else resolve(row);
      });
   });
};

/**
 * Get method to fetch user by id
 * @param {*} id 
 */
exports.getUserById = function(id) {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE users.user_id = ?';
      db.get(sql, [id], (err, row) => {
         if (err) reject(err);
         else resolve(row);
      });
   });
};

// POST functions

/**
 * Post method to add user
 * @param {*} user 
 */
exports.createdUser = function(user) {
   return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users(name, email, password) VALUES (?, ?, ?)';
  
      bcrypt.hash(user.password, 10).then((hash => {
         db.run(sql, [user.name, user.email, hash], function(err) {
            if(err) {
               reject(err);
            } else {
               resolve(this.lastID);
            }
         });
      }));
   });
}