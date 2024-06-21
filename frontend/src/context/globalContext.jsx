/**
 * Class to save and contain the various method that make
 * request to the server. General context for application
 */

// import utilities
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
// import date-fns methods
const { parseISO, getMonth, getYear, getISOWeek } = require('date-fns')
// set static URL
const BASE_URL = "http://localhost:5000/api/";
// initialize context 
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
   // to store the transactions from backend
   const[incomes, setIncomes] = useState([])
   const[expenses, setExpenses] = useState([])
   // state variables
   const[error, setError] = useState(null)
   const[loading, setLoading] = useState(true)
   // to store the current logged user from backend
   const[loggedUser, setLoggedUser] = useState(() => {
      const savedUser = localStorage.getItem('loggedUser')
      return savedUser ? JSON.parse(savedUser) : { user_id: 0}
   })

   // useEffect hook to fetch data from backend when the
   // the globalContext is mounted
   useEffect(() => {
      setLoading(true)
      console.log("GlobalContext useEffect:")
      console.log("LoggedUserId: ", loggedUser)
      getIncomes(loggedUser.user_id)
      getExpenses(loggedUser.user_id)
      setLoading(false)

      console.log("User Logged: ", loggedUser)
   }, [loggedUser])

   /************
    * EXPENSES
   *************/

   // add expense to backend
   const addExpense = async(expense) => {
      console.log("Global context addExp: ", expense.category)
      const res = await axios.post(`${BASE_URL}addExpense`, expense)
         .catch((err) => {
            setError(err.message)
         })
      await getExpenses(expense.user_id);
   }
   // delete expense from backend
   const deleteExpense = async(id) => {
      console.log("Id passed to deleteExpense: ", id)

      const res = await axios.delete(`${BASE_URL}deleteExpense/${id}`)
         .catch((err) => {
            setError(err.message)
         })
      getExpenses(loggedUser.user_id)
   }
   // get expense by id from backend
   const getExpenses = async(user_id) => {
      try {
         const res = await axios.get(`${BASE_URL}expenses/${user_id}`)
         console.log(res.data)
         setExpenses(res.data)
      } catch(err) {
         console.error('Error fetching incomes in context:', err);
         setError(err);
      } 
   }
   // total of all the expenses filtered by week/month/year
   const totalExpensesFiltered = (filter, targetValue) => {
      let filterExpense = getFilteredData(expenses, filter, targetValue)

      let total = 0
      filterExpense.forEach((expense) => {
         total += expense.amount
      })

      return total
   }
   // object list of all the expenses filtered by week/month/year
   const expensesByFiltered = (filter, targetValue) => {
      let filterExpense =  getFilteredData(expenses, filter, targetValue);

      filterExpense.sort((a, b) => new Date(a.date) - new Date(b.date));

      return filterExpense;
   };

   /************ 
    * INCOMES
   *************/

   // add incomes to backend
   const addIncome = async(income) => {
      const res = await axios.post(`${BASE_URL}addIncome`, income)
         .catch((err) => {
            setError(err.message)
         })
      getIncomes(income.user_id);
   }
   // delete incomes from backend
   const deleteIncome = async(id) => {
      console.log("Id passed to deletIncome: ", id)

      const res = await axios.delete(`${BASE_URL}deleteIncome/${id}`)
         .catch((err) => {
            setError(err.message)
         })
      getIncomes(loggedUser.user_id)
   }
   // get incomes by id from backend
   const getIncomes = async(user_id) => {
      try {
         const res = await axios.get(`${BASE_URL}incomes/${user_id}`)
         console.log(res.data)
         setIncomes(res.data)
      } catch(err) {
         console.error('Error fetching incomes in context:', err);
         setError(err);
      }
   }
   // total of all the incomes filtered by week/month/year
   const totalIncomesFiltered = (filter, targetValue) => {
      let filterIncomes = getFilteredData(incomes, filter, targetValue)

      let total = 0
      filterIncomes.forEach((income) => {
         total += income.amount
      })

      return total
   }
   // object list of all the incomes filtered by week/month/year
   const incomesByFiltered = (filter, targetValue) => {
      //return getFilteredData(incomes, filter, targetValue);
      let filterIncomes = getFilteredData(incomes, filter, targetValue)

      filterIncomes.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Restituisci i dati ordinati
      return filterIncomes;
   };
   
   /************ 
    * GENERAL
   *************/

   // filtering functions to return a boolean if the dateString is of the correct time 

   const filterByWeek = (dateString, targetWeek) => {
      const date = parseISO(dateString)
      return getISOWeek(date) === targetWeek
               && getYear(date) === new Date().getFullYear()
   };
   
   const filterByMonth = (dateString, targetMonth) => {
      const date = parseISO(dateString);
      return getMonth(date) === targetMonth 
               && getYear(date) === new Date().getFullYear();
   };

   const filterByYear = (dateString, targetYear) => {
      const date = parseISO(dateString);
      return getYear(date) === targetYear;
   };
   
   // filter data by time period
   const getFilteredData = (data, filter, targetValue) => {
      let filteredData;
      switch (filter) {
         case 'This Week':
            filteredData = data.filter(item => filterByWeek(item.date, targetValue));
            break;
         case 'This Month':
            filteredData = data.filter(item => filterByMonth(item.date, targetValue));
            break;
         case 'This Year':
            filteredData = data.filter(item => filterByYear(item.date, targetValue));
            break;
         default:
            console.log("Invalid filter provided");
            return [];
      }
      return filteredData;
   };

   /************ 
    * SESSIONS
   *************/

   // to perform the login from backend
   const doLogin = async (email, password) => {
      try {
         console.log(`Attempting login with email: ${email} and password: ${password}`);
         const res = await axios.post(`${BASE_URL}sessions`, { email, password });
         const user = res.data
         localStorage.setItem('loggedUser', JSON.stringify(user))
         setLoggedUser(user);
         return res.data;
      } catch (err) {
         if (err.response && err.response.data && err.response.data.message) {
            throw new Error(err.response.data.message);
         } else {
            throw new Error('Login failed. Please check your credentials and try again.');
         }
      }
   };
   // to perform the logout from backend
   const doLogout = async() => {
      await fetch(`${BASE_URL}sessions/current`)
      setLoggedUser(0)
   }
   // to add user after registration from the backend
   const doRegistration = async(user) => {
      console.log("Dentro doRegistration")
      const res = await axios.post(`${BASE_URL}addUser`, user)
         .catch((err) => {
            setError(err.message)
         })
   }

   // exports all value data
   return (
      <GlobalContext.Provider value={{ 
         addExpense,
         deleteExpense,
         getExpenses,
         totalExpensesFiltered,
         expensesByFiltered,
         addIncome,
         deleteIncome,
         getIncomes,
         totalIncomesFiltered,
         incomesByFiltered, 
         doLogin,
         doLogout,
         doRegistration,
         setError,
         error,
         loading,
         loggedUser
      }}>
         {children}
      </GlobalContext.Provider>
   );
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};