"use strict"

const db = require('./db.js');

// GET functions

exports.getAllExpenses = function() {
   return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM expenses';
      db.all(query, (err, rows) => {
         if (err) {
            reject(err);
            return;
         }
         const expenses = rows.map( (row)=> (
            {
               id:row.id,
               user_id:row.user_id,
               category:row.category,
               date:row.date,
               description:row.description,
               amount:row.amount
            }));
         resolve(expenses);
      });
   });
}

// POST functions

exports.addExpense = function(expense) {
   return new Promise((resolve,reject) => {
   const sql = "INSERT INTO expenses(user_id, category, date, description, amount) VALUES (?, DATE(?), ?, ?)";
      db.run(sql, [expense.user_id,expense.category,expense.date,expense.description,expense.amount], (err)=> {
          if (err) {
              reject(err);
              return;
          }
          resolve(this.lastId);
      });
  });
} 