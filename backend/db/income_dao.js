"use strict"

const db = require('./db.js');

exports.getAllIncomes = function() {
   return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM incomes';
      db.all(query, (err, rows) => {
         if (err) {
            reject(err);
            return;
         }
         const incomes = rows.map( (row)=> (
            {
               id:row.id,
               user_id:row.user_id,
               date:row.date,
               description:row.description,
               amount:row.amount
            }));
         resolve(incomes);
      });
   });
}


