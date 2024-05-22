/**
 * Class to save and contain the various method that make
 * request to the server
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

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

   const expensesByFilter = (filter, targetValue) => {
      console.log("Filter function: " + filter)

      let filteredExpenses
      switch(filter) {
         case 'Today':
            filteredExpenses = expenses.filter(exp => filterByDay(exp.date, targetValue))
            break;
         case 'This Month':
            filteredExpenses = expenses.filter(exp => filterByMonth(exp.date, targetValue))
            break;
         case 'This Year':
            filteredExpenses = expenses.filter(exp => filterByYear(exp.date, targetValue))
            break;
         default:
            console.log("Invalid filter provided")
            return 0
      }

      let total = 0
      filteredExpenses.forEach((expense) => {
         total += expense.amount
      });
      console.log("Total expenses filtered " + total)
      return total
   }

   // to implement: deleteExpense

   /************ 
    * INCOMES
   *************/
   const addIncome = async(income) => {
      const res = await axios.post(`${BASE_URL}addExpense`, income)
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
   
   const incomesByFilter = (filter, targetValue) => {
      console.log("Filter function: " + filter)

      let filteredIncomes
      switch(filter) {
         case 'Today':
            filteredIncomes = incomes.filter(inc => filterByDay(inc.date, targetValue))
            break;
         case 'This Month':
            filteredIncomes = incomes.filter(inc => filterByMonth(inc.date, targetValue))
            break;
         case 'This Year':
            filteredIncomes = incomes.filter(inc => filterByYear(inc.date, targetValue))
            break;
         default:
            console.log("Invalid filter provided")
            return 0
      }

      let total = 0
      filteredIncomes.forEach((income) => {
         total += income.amount
      });
      console.log("Total incomes filtered " + total)
      return total
   }

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
   
   // Function to calculate the difference beetween incomes and the expenses
   // based on the filter
   const balanceByFilter = (filter, targetValue) => {
      console.log("Filter balance function: " + filter)

      let filteredIncomes
      let filteredExpenses
      switch(filter) {
         case 'Today':
            filteredIncomes = incomes.filter(inc => filterByDay(inc.date, targetValue))
            filteredExpenses = expenses.filter(exp => filterByDay(exp.date, targetValue))
            break;
         case 'This Month':
            filteredIncomes = incomes.filter(inc => filterByMonth(inc.date, targetValue))
            filteredExpenses = expenses.filter(exp => filterByMonth(exp.date, targetValue))
            break;
         case 'This Year':
            filteredIncomes = incomes.filter(inc => filterByYear(inc.date, targetValue))
            filteredExpenses = expenses.filter(exp => filterByYear(exp.date, targetValue))
            break;
         default:
            console.log("Invalid filter provided")
            return 0
      }

      let totalInc = 0
      filteredIncomes.forEach((income) => {
         totalInc += income.amount
      });

      let totalExp = 0
      filteredExpenses.forEach((expense) => {
         totalExp += expense.amount
      });
      return totalInc - totalExp
   }

   /**
    * TESTING RITIRO DATI PER GRAFICO
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
   
   const incomesByFiltered = (filter, targetValue) => {
      return getFilteredData(incomes, filter, targetValue);
   };
   
   const expensesByFiltered = (filter, targetValue) => {
      return getFilteredData(expenses, filter, targetValue);
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
         incomesByFilter,
         expensesByFilter,
         balanceByFilter,
         loading,
         expensesByFiltered,
         incomesByFiltered
      }}>
         {children}
      </GlobalContext.Provider>
   );
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};