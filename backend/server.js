// imports
const express = require('express');
const sqlite = require('sqlite3');
const morgan = require('morgan');
const cors = require('cors');
const incomeDao = require('./db/income_dao');
const expenseDao = require('./db/expense_dao');
const userDao = require('./db/users_dao');
const path = require('path');

const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // email and password for login
const session = require('express-session');
const { result } = require('lodash');

const {check, validationResult} = require('express-validator');
const db = require('./db/db');
const exp = require('constants');
const { error } = require('console');
const bcrypt = require('bcrypt')

// Configurazione strategia Passport
passport.use(new LocalStrategy(
   { usernameField: 'email', passwordField: 'password' },
   function(email, password, done) {
      userDao.getUser(email).then(user => {
         if (!user) {
            return done(null, false, { message: 'Incorrect username' });
         } 
         bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                  return done(null, user);
            } else {
                  return done(null, false, { message: 'Incorrect password' });
            }
         });
      }).catch(err => done(err));
   }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function(user, done) {
   done(null, user.user_id);
});

passport.deserializeUser(function(id, done) {
   userDao.getUserById(id).then(user => {
      done(null, user);
   }).catch(err => done(err, null))
});

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


// set up the session
app.use(session({
   secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
   resave: false,
   saveUninitialized: false,
   cookie: { sameSite: 'lax' }
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
   if(req.isAuthenticated()){
      return next();
   }
   return res.status(401).json({"statusCode" : 401, "message" : "not authenticated"});
}

/***
 * REST API
***/

/************ 
 * GET
*************/

// get all incomes by id
app.get('/api/incomes/:id', /*isLoggedIn,*/  (req, res) => {
   incomeDao.getAllIncomes(req.params.id)
      .then(incomes => res.json(incomes))
      .catch(error => res.status(500).json({ error: error.message }));
});
// get all expenses by id
app.get('/api/expenses/:id', /*isLoggedIn,*/  (req, res) => {
   expenseDao.getAllExpenses(req.params.id)
      .then(expenses => res.json(expenses))
      .catch(error => res.status(500).json({ error: error.message}));
})

/************ 
 * POST
*************/

// post a income
app.post('/api/addIncome', /*isLoggedIn,*/ (req, res) => {
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

// post a expense
app.post('/api/addExpense', /*isLoggedIn,*/ (req, res) => {
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

/************ 
 * DELETE
*************/

app.delete('/api/deleteIncome/:id', /*isLoggedIn*/ (req, res) => {
   incomeDao.deleteIncomeById(req.params.id)
      .then(changes => {
         if (changes === 0) {
            res.status(404).json({ error: 'Income not found' }); // Nessuna riga eliminata
         } else {
            res.status(200).json({ message: 'Income deleted successfully' }); // Eliminazione riuscita
         }
      })
      .catch(error => res.status(500).json({ error: error.message }));
});

app.delete('/api/deleteExpense/:id', /*isLoggedIn*/ (req, res) => {
   expenseDao.deleteExpenseById(req.params.id)
      .then(changes => {
         if (changes === 0) {
            res.status(404).json({ error: 'Expense not found' }); // Nessuna riga eliminata
         } else {
            res.status(200).json({ message: 'Expense deleted successfully' }); // Eliminazione riuscita
         }
      })
      .catch(error => res.status(500).json({ error: error.message }));
});

/************ 
 * SESSIONS
*************/

// Login
app.post('/api/sessions', function(req, res, next) {
   console.log(`Received login request: ${JSON.stringify(req.body)}`); // Log dei dati ricevuti
   passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) {
         return res.status(401).json(info);
      }
      req.login(user, function(err) {
         if (err) { return next(err); }
         return res.json(user);
      });
   })(req, res, next);
});

// Logout
app.delete('/api/sessions/current', function(req, res){
   req.logout(function(err) {
      if (err) { return res.status(503).json(err); }
   });
   res.end();
});

// POST /users
// Sign up
app.post('/api/addUser', /* isLoggedIn, */ (req, res) => {
   
   const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
   };

   console.log(`Registration submitted with name: ${user.name}, email: ${user.email} and password: ${user.password}`);

   userDao.createdUser(user)
   .then((result) => res.status(201).header('Location', `/addUser/${result}`).end())
   .catch((err) => res.status(503).json({error: err.message}));
});


// Check if the server is connected
app.listen(PORT, () => {
   console.log(`server listening at http://localhost:${PORT}`)
});