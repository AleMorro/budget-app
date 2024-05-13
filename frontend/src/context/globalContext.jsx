/**
 * Class to save and contain the various method that make
 * request to the server
 */

import React, { createContext, useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
   
   const[incomes, setIncomes] = useState([])
   const[expenses, setExpenses] = useState([])
   const[error, setError] = useState(null)

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
      const res = await axios.get(`${BASE_URL}expenses/${user_id}`)
      setExpenses(res.data)
      console.log(res.data)
   }

   // to implement: deleteExpense

   const totalExpenses = () => {
      let total = 0;
      expenses.forEach((expense) => {
         total += expense.amount
      })
      console.log("Total expenses: " + total)
      return total;
   }

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
      
      } catch(err) {
         console.error('Error fetching incomes in context:', err);
         setError(err);
      }
   }

   const incomesByFilter = (filter) => {
      console.log("Filter functions")
      const filteredIncomes = incomes.filter(inc => inc.amount > 1000)
      let total = 0;
      filteredIncomes.forEach((income) => {
         total += income.amount
      })
      console.log("Total incomes filter: " + total)
      return total;
   }

   // to implement: deleteIncome

   const totalIncomes = () => {
      let total = 0;
      incomes.forEach((income) => {
         total += income.amount
      })
      console.log("Total incomes: " + total)
      return total;
   }

   /************ 
    * GENERAL
   *************/
   const totalBalance = () => {
      return totalIncomes() - totalExpenses()
   }
   
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
         totalExpenses,
         addIncome,
         getIncomes,
         totalIncomes,
         totalBalance,
         error,
         setError,
         incomesByFilter
      }}>
         {children}
      </GlobalContext.Provider>
   );
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};