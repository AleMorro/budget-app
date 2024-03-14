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

// init
const app = express();
const PORT = 3000;

// set up the middlewares
app.use(morgan('tiny'));
app.use(express.static('client'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

// interpreting json-encoded parameters
app.use(express.json());

// REST API

app.get('/', (req, res) => {
   res.send('Hello world')
});

app.get('/api/incomes', (req, res) => {
   incomeDao.getAllIncomes()
      .then(incomes => res.json(incomes))
      .catch(error => res.status(500).json({ error: error.message }));
});

app.listen(PORT, () => {
   console.log(`server listening at http://localhost:${PORT}`)
});