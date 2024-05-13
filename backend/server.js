// imports
const express = require('express');
const sqlite = require('sqlite3');
const morgan = require('morgan');
const cors = require('cors');
const incomeDao = require('./db/income_dao');
const expenseDao = require('./db/expense_dao');
const userDao = require('./db/users_dao');
const path = require('path');

const {check, validationResult} = require('express-validator');
const db = require('./db/db');
const exp = require('constants');
const { error } = require('console');

// init
const app = express();
const PORT = 5000;

// set up the middlewares
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

// interpreting json-encoded parameters
app.use(express.json());

// REST API

// GET

// get all incomes by id
app.get('/api/incomes/:id', (req, res) => {
   incomeDao.getAllIncomes(req.params.id)
      .then(incomes => res.json(incomes))
      .catch(error => res.status(500).json({ error: error.message }));
});
// get all expenses by id
app.get('/api/expenses/:id', (req, res) => {
   expenseDao.getAllExpenses(req.params.id)
      .then(expenses => res.json(expenses))
      .catch(error => res.status(500).json({ error: error.message}));
})
// get all users
app.get('/api/users', (req, res) => {
   userDao.getAllUsers()
      .then(users => res.json(users))
      .catch(error => res.status(500).json({ error: error.message}));
})

// POST

// post a expense
app.post('/api/addExpense', /* [add here some validity checks], */ (req, res) => {
   const expense = {
     user_id: req.body.user_id,
     category: req.body.category,
     date: req.body.date,
     description: req.body.description,
     amount: req.body.amount
   };

   expenseDao.addExpense(expense)
   .then((result) => res.status(201).header('Location', `/expenses/${result}`).end())
   .catch((err) => res.status(503).json({error: err.message}));
});

// post a income
app.post('/api/addIncome', /* [add here some validity checks], */ (req, res) => {
   const income = {
     user_id: req.body.user_id,
     category: req.body.category,
     date: req.body.date,
     description: req.body.description,
     amount: req.body.amount
   };

   incomeDao.addIncome(income)
   .then((result) => res.status(201).header('Location', `/incomes/${result}`).end())
   .catch((err) => res.status(503).json({error: err.message}));
});

// Check if the server is connected
app.listen(PORT, () => {
   console.log(`server listening at http://localhost:${PORT}`)
});