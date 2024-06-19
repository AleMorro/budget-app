/**
 * Class to save and contain the various method that make
 * request to the server
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
//import Home from '../components/budgetApp/routes/Home/Home.jsx'

const { parseISO, getDate, getMonth, getYear, getWeekYear, getISOWeek } = require('date-fns')

const BASE_URL = "http://localhost:5000/api/";

const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {
   
   const[incomes, setIncomes] = useState([])
   const[expenses, setExpenses] = useState([])
   
   const[error, setError] = useState(null)
   const[loading, setLoading] = useState(true)

   const[loggedUser, setLoggedUser] = useState(() => {
      const savedUser = localStorage.getItem('loggedUser')
      return savedUser ? JSON.parse(savedUser) : { user_id: null}
   })

   // useEffect hook to fetch data from backend when the
   // the globalContext is mounted
   useEffect(() => {
      setLoading(false)
      console.log("GlobalContext useEffect:")
      console.log("LoggedUserId: ", loggedUser)
      getIncomes(loggedUser.user_id)
      getExpenses(loggedUser.user_id)

      console.log("User Logged: ", loggedUser)
   }, [loggedUser])

   /************ 
    * EXPENSES
   *************/

   const addExpense = async(expense) => {
      console.log("Global context addExp: ", expense.category)
      const res = await axios.post(`${BASE_URL}addExpense`, expense)
         .catch((err) => {
            setError(err.message)
         })
      getExpenses(expense.user_id);
   }

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

   const totalExpensesFiltered = (filter, targetValue) => {
      let filterExpense = getFilteredData(expenses, filter, targetValue)

      let total = 0
      filterExpense.forEach((expense) => {
         total += expense.amount
      })

      return total
   }

   const expensesByFiltered = (filter, targetValue) => {
      let filterExpense =  getFilteredData(expenses, filter, targetValue);

      filterExpense.sort((a, b) => new Date(a.date) - new Date(b.date));

      return filterExpense;
   };

   // to implement: deleteExpense

   /************ 
    * INCOMES
   *************/
   const addIncome = async(income) => {
      const res = await axios.post(`${BASE_URL}addIncome`, income)
         .catch((err) => {
            setError(err.message)
         })
      getIncomes(income.user_id);
   }

   const deleteIncome = async(id) => {
      console.log("Id passed to deletIncome: ", id)
   }

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

   const totalIncomesFiltered = (filter, targetValue) => {
      let filterIncomes = getFilteredData(incomes, filter, targetValue)

      let total = 0
      filterIncomes.forEach((income) => {
         total += income.amount
      })

      return total
   }

   const incomesByFiltered = (filter, targetValue) => {
      //return getFilteredData(incomes, filter, targetValue);
      let filterIncomes = getFilteredData(incomes, filter, targetValue)

      filterIncomes.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Restituisci i dati ordinati
      return filterIncomes;
   };
   
   // to implement: deleteIncome

   /************ 
    * GENERAL
   *************/

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
   
   /**
    * Function to filter correct data and return the list of object of 
    * the data needed from the frontend
    */
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

   // Function to perform the login and open a session with backend
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

   return (
      <GlobalContext.Provider value={{ 
         addExpense,
         getExpenses,
         addIncome,
         getIncomes,
         error,
         setError,
         loading,
         expensesByFiltered,
         incomesByFiltered, 
         totalExpensesFiltered,
         totalIncomesFiltered,
         loggedUser,
         doLogin,
         deleteIncome
      }}>
         {children}
      </GlobalContext.Provider>
   );
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};