require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require("bcrypt");

const incomeDao = require("./db/income_dao");
const expenseDao = require("./db/expense_dao");
const userDao = require("./db/users_dao");
const { getStockQuote, getStockQuotesBatch } = require("./services/stockQuoteService");
const {
   publicUser,
   isLoggedIn,
   assertOwnsUserParam,
   forceSessionUserId,
} = require("./middleware/auth");
const { createRateLimiter } = require("./middleware/rateLimit");

const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const SESSION_SECRET =
   process.env.SESSION_SECRET ||
   (isProd ? null : "dev-only-session-secret-not-for-production");

if (!SESSION_SECRET) {
   console.error("FATAL: SESSION_SECRET è obbligatorio in produzione (NODE_ENV=production).");
   process.exit(1);
}

const LOGIN_FAILURE_MESSAGE = "Email o password non corretti.";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 128;

const stockRateLimit = createRateLimiter({
   windowMs: 60_000,
   max: Number(process.env.STOCK_RATE_LIMIT_MAX) || 30,
   message: "Limite richieste titoli raggiunto. Riprova tra un minuto.",
});

const loginRateLimit = createRateLimiter({
   windowMs: 60_000,
   max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 10,
   message: "Troppi tentativi di accesso. Riprova tra un minuto.",
});

const registrationRateLimit = createRateLimiter({
   windowMs: 60_000,
   max: Number(process.env.REGISTRATION_RATE_LIMIT_MAX) || 5,
   message: "Troppe registrazioni da questo indirizzo. Riprova tra un minuto.",
});

const emailCheckRateLimit = createRateLimiter({
   windowMs: 60_000,
   max: Number(process.env.EMAIL_CHECK_RATE_LIMIT_MAX) || 20,
   message: "Troppe verifiche email. Riprova tra un minuto.",
});

passport.use(
   new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      function (email, password, done) {
         userDao
            .getUser(email)
            .then((user) => {
               if (!user) {
                  return done(null, false, { message: LOGIN_FAILURE_MESSAGE });
               }
               bcrypt.compare(password, user.password, (err, res) => {
                  if (err) return done(err);
                  if (res) return done(null, user);
                  return done(null, false, { message: LOGIN_FAILURE_MESSAGE });
               });
            })
            .catch((err) => done(err));
      }
   )
);

passport.serializeUser((user, done) => {
   done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
   userDao
      .getUserById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
});

const app = express();

app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
   cors({
      origin: CORS_ORIGIN,
      credentials: true,
   })
);

app.use(
   session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
         httpOnly: true,
         secure: isProd,
         sameSite: isProd ? "strict" : "lax",
         maxAge: 7 * 24 * 60 * 60 * 1000,
      },
   })
);

app.use(passport.initialize());
app.use(passport.session());

/***
 * REST API
 ***/

app.get("/api/sessions/current", isLoggedIn, (req, res) => {
   res.json(publicUser(req.user));
});

app.post("/api/sessions", loginRateLimit, (req, res, next) => {
   passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json(info);
      req.login(user, (loginErr) => {
         if (loginErr) return next(loginErr);
         return res.json(publicUser(user));
      });
   })(req, res, next);
});

app.delete("/api/sessions/current", (req, res) => {
   req.logout((err) => {
      if (err) return res.status(503).json({ error: err.message });
      req.session.destroy(() => {
         res.clearCookie("connect.sid");
         res.status(204).end();
      });
   });
});

app.get("/api/users/check-email", emailCheckRateLimit, (req, res) => {
   const email = String(req.query.email || "")
      .trim()
      .toLowerCase();
   if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Email non valida." });
   }
   userDao
      .getUser(email)
      .then((row) => res.json({ email, available: !row }))
      .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/api/addUser", registrationRateLimit, (req, res) => {
   const user = {
      name: String(req.body.name || "").trim(),
      email: String(req.body.email || "")
         .trim()
         .toLowerCase(),
      password: String(req.body.password || ""),
   };

   if (!user.name || !user.email || !user.password) {
      return res.status(400).json({ message: "Compila tutti i campi obbligatori." });
   }
   if (!user.email.includes("@")) {
      return res.status(400).json({ message: "Inserisci un indirizzo email valido." });
   }
   if (
      user.password.length < MIN_PASSWORD_LENGTH ||
      user.password.length > MAX_PASSWORD_LENGTH
   ) {
      return res.status(400).json({
         message: `La password deve avere tra ${MIN_PASSWORD_LENGTH} e ${MAX_PASSWORD_LENGTH} caratteri.`,
      });
   }

   userDao
      .getUser(user.email)
      .then((existing) => {
         if (existing) {
            return res.status(409).json({
               message:
                  "Questa email è già registrata. Accedi o usa un'altra email.",
            });
         }
         return userDao
            .createdUser(user)
            .then((result) =>
               res.status(201).header("Location", `/addUser/${result}`).end()
            );
      })
      .catch((err) => res.status(503).json({ error: err.message }));
});

app.get(
   "/api/incomes/:id",
   isLoggedIn,
   assertOwnsUserParam("id"),
   (req, res) => {
      incomeDao
         .getAllIncomes(req.user.user_id)
         .then((incomes) => res.json(incomes))
         .catch((error) => res.status(500).json({ error: error.message }));
   }
);

app.get(
   "/api/expenses/:id",
   isLoggedIn,
   assertOwnsUserParam("id"),
   (req, res) => {
      expenseDao
         .getAllExpenses(req.user.user_id)
         .then((expenses) => res.json(expenses))
         .catch((error) => res.status(500).json({ error: error.message }));
   }
);

app.post("/api/addIncome", isLoggedIn, forceSessionUserId, (req, res) => {
   const income = {
      user_id: req.body.user_id,
      category: req.body.category,
      date: req.body.date,
      description: req.body.description,
      amount: req.body.amount,
   };

   incomeDao
      .addIncome(income)
      .then((result) => res.status(201).header("Location", `/incomes/${result}`).end())
      .catch((err) => res.status(503).json({ error: err.message }));
});

app.post("/api/addExpense", isLoggedIn, forceSessionUserId, (req, res) => {
   const expense = {
      user_id: req.body.user_id,
      category: req.body.category,
      date: req.body.date,
      description: req.body.description,
      amount: req.body.amount,
   };

   expenseDao
      .addExpense(expense)
      .then((result) => res.status(201).header("Location", `/expenses/${result}`).end())
      .catch((err) => res.status(503).json({ error: err.message }));
});

app.delete("/api/deleteIncome/:id", isLoggedIn, (req, res) => {
   incomeDao
      .deleteIncomeByIdForUser(req.params.id, req.user.user_id)
      .then((changes) => {
         if (changes === 0) {
            return res.status(404).json({ error: "Income not found" });
         }
         res.status(200).json({ message: "Income deleted successfully" });
      })
      .catch((error) => res.status(500).json({ error: error.message }));
});

app.delete("/api/deleteExpense/:id", isLoggedIn, (req, res) => {
   expenseDao
      .deleteExpenseByIdForUser(req.params.id, req.user.user_id)
      .then((changes) => {
         if (changes === 0) {
            return res.status(404).json({ error: "Expense not found" });
         }
         res.status(200).json({ message: "Expense deleted successfully" });
      })
      .catch((error) => res.status(500).json({ error: error.message }));
});

app.post("/api/stocks/quotes", isLoggedIn, stockRateLimit, async (req, res) => {
   try {
      const symbols = req.body?.symbols || [];
      const data = await getStockQuotesBatch(symbols);
      res.json(data);
   } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Errore recupero titoli" });
   }
});

app.get("/api/stocks/:symbol", isLoggedIn, stockRateLimit, async (req, res) => {
   try {
      const interval = req.query.interval || "1m";
      const range = req.query.range || "1d";
      const period1 = req.query.period1 ? Number(req.query.period1) : undefined;
      const data = await getStockQuote(req.params.symbol, { interval, range, period1 });
      res.json(data);
   } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Errore recupero titolo" });
   }
});

app.listen(PORT, () => {
   console.log(`server listening at http://localhost:${PORT}`);
   if (!isProd) {
      console.log(`CORS origin: ${CORS_ORIGIN}`);
   }
});
