'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('./db/dbBudget.db', (err) => {
   if (err){
      console.log('Error opening Database', err.message);
      throw err;
   } else {
      console.log("Database connected");
   }
});

module.exports = db;