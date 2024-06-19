"use strict"

const db = require('./db.js');

// GET functions

/**
 * Get method to fetch incomes by user id
 * @param {*} id 
 * @returns json reponse
 */
exports.getAllIncomes = function(id) {
   return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM incomes WHERE incomes.user_id=?';
      db.all(query, [id], (err, rows) => {
         if (err) {
            reject(err);
            return;
         }
         const incomes = rows.map( (row)=> (
            {
               id:row.id,
               user_id:row.user_id,
               category:row.category,
               date:row.date,
               description:row.description,
               amount:row.amount
            }));
         resolve(incomes);
      });
   });
}

// POST functions

/**
 * Post method to add an income
 * @param {*} income 
 */
exports.addIncome = function(income) {
   return new Promise((resolve,reject) => {
   const sql = "INSERT INTO incomes(user_id, category, date, description, amount) VALUES (?, ?, DATE(?), ?, ?)";
   db.run(sql, [income.user_id,income.category,income.date,income.description,income.amount], (err)=> {
      if (err) {
         reject(err);
         return;
      }
      resolve(this.lastId);
   });
   });
}

// DELETE functions
exports.deleteIncomeById = function(id) {
   return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM incomes WHERE id = ?';
      db.run(sql, [id], (err) => {
         if(err) {
            reject(err)
            return
         }
         resolve(this.changes)
      })
   })
}


