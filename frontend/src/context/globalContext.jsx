/**
 * Class to save and contain the various method that make
 * request to the server
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
//import Home from '../components/budgetApp/routes/Home/Home.jsx'

const { parseISO, getDate, getMonth, getYear } = require('date-fns')

const BASE_URL = "http://localhost:5000/api/";

const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {
   
   const[incomes, setIncomes] = useState([])
   const[expenses, setExpenses] = useState([])
   
   const[error, setError] = useState(null)
   const[loading, setLoading] = useState(true)

   // useEffect hook to fetch data from backend when the
   // the globalContext is mounted
   useEffect(() => {
      console.log("GlobalContext useEffect:")
      getIncomes(1)
      getExpenses(1)
   }, [])

   /************ 
    * EXPENSES
   *************/

   const addExpense = async(expense) => {
      const res = await axios.post(`${BASE_URL}addExpense`, expense)
         .catch((err) => {
            setError(err.message)
         })
      getExpenses(expense.user_id);
   }

   const getExpenses = async (user_id) => {
      try {
         const res = await axios.get(`${BASE_URL}expenses/${user_id}`)
         console.log(res.data)
         setExpenses(res.data)
         setLoading(false)
      } catch(err) {
         console.error('Error fetching incomes in context:', err);
         setError(err);
         setLoading(false)
      } 
   }

   const expensesByFiltered = (filter, targetValue) => {
      return getFilteredData(expenses, filter, targetValue);
   };

   const totalExpensesFiltered = (filter, targetValue) => {
      let filterExpense = getFilteredData(expenses, filter, targetValue)

      let total = 0
      filterExpense.forEach((expense) => {
         total += expense.amount
      })

      return total
   }

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

   const getIncomes = async(user_id) => {
      try {
         const res = await axios.get(`${BASE_URL}incomes/${user_id}`)
         console.log(res.data)
         setIncomes(res.data)
         setLoading(false)
      } catch(err) {
         console.error('Error fetching incomes in context:', err);
         setError(err);
         setLoading(false)
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
      return getFilteredData(incomes, filter, targetValue);
   };
   
   // to implement: deleteIncome

   /************ 
    * GENERAL
   *************/

   const filterByDay = (dateString, targetDay) => {
      const date = parseISO(dateString)
      return getDate(date) === targetDay 
               && getMonth(date) === new Date().getMonth()
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
    * the correct data needed from the frontend
    */
   const getFilteredData = (data, filter, targetValue) => {
      let filteredData;
      switch (filter) {
         case 'Today':
            filteredData = data.filter(item => filterByDay(item.date, targetValue));
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
   
   /*
   const getUsers = async () => {
      try {
         const res = await axios.get(`${BASE_URL}users`);
         setUsers(res.data);
         console.log(res.data);
      } catch (error) {
         console.error('Error fetching users:', error);
         setError(error);
      }
   };
   */

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
         totalIncomesFiltered
      }}>
         {children}
      </GlobalContext.Provider>
   );
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};