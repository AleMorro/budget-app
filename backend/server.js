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
const PORT = 3000;

// set up the middlewares
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

// interpreting json-encoded parameters
app.use(express.json());
// redirecting to index.html
app.get("/main", (req,res) => {
   res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// REST API

// Testing API to verify functionability

// GET
/*
app.get('/', (req, res) => {
   res.send('Hello world')
}); */

app.get('/api/incomes', (req, res) => {
   incomeDao.getAllIncomes()
      .then(incomes => res.json(incomes))
      .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/api/expenses', (req, res) => {
   expenseDao.getAllExpenses()
      .then(expenses => res.json(expenses))
      .catch(error => res.status(500).json({ error: error.message}));
})

app.get('/api/users', (req, res) => {
   userDao.getAllUsers()
      .then(users => res.json(users))
      .catch(error => res.status(500).json({ error: error.message}));
})

// POST

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


app.listen(PORT, () => {
   console.log(`server listening at http://localhost:${PORT}`)
});