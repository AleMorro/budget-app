"use strict"

const db = require('./db.js');

// GET functions

/**
 * Get method to fetch expenses by user id
 * @param {*} id 
 * @returns json response
 */
exports.getAllExpenses = function(id) {
   return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM expenses WHERE expenses.user_id=?';
      db.all(query, [id], (err, rows) => {
         if (err) {
            reject(err);
            return;
         }
         // crea un oggetto per ogni riga della tabella
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

/**
 * Post method to add an expense
 * @param {*} expense 
 */
exports.addExpense = function(expense) {
   return new Promise((resolve,reject) => {
   const sql = "INSERT INTO expenses(user_id, category, date, description, amount) VALUES (?, ?, DATE(?), ?, ?)";
      db.run(sql, [expense.user_id,expense.category,expense.date,expense.description,expense.amount], (err)=> {
          if (err) {
              reject(err);
              return;
          }
          resolve(this.lastId);
      });
  });
} 

// DELETE functions
exports.deleteExpenseById = function(id) {
   return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM expenses WHERE id = ?';
      db.run(sql, [id], (err) => {
         if(err) {
            reject(err)
            return
         }
         resolve(this.changes)
      })
   })
}