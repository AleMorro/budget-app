/**
 * Class to save and contain the various method that make
 * request to the server. General context for application
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { parseISO, getMonth, getYear, getISOWeek } from "date-fns";
import {
   loadWalletsState,
   saveWalletsState,
   loadTxWalletMap,
   saveTxWalletMap,
   loadCategoryStyles,
   saveCategoryStyles,
   loadExpenseBudgetsMonthly,
   saveExpenseBudgetsMonthly,
   getStyleForCategory,
   setWalletIdForTransaction,
   removeWalletIdForTransaction,
   txKey,
   DEFAULT_WALLET_ID,
} from "../lib/localFinanceStore";

const BASE_URL = "http://localhost:5000/api/";
const GlobalContext = createContext();

function transactionMatchesSubmit(row, body) {
   if (!row || !body) return false;
   return (
      Number(row.user_id) === Number(body.user_id) &&
      row.category === body.category &&
      String(row.date) === String(body.date) &&
      Math.abs(Number(row.amount) - Number(body.amount)) < 0.009
   );
}

export const GlobalProvider = ({ children }) => {
   const [incomes, setIncomes] = useState([]);
   const [expenses, setExpenses] = useState([]);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(true);
   const [loggedUser, setLoggedUser] = useState(() => {
      const savedUser = localStorage.getItem("loggedUser");
      return savedUser ? JSON.parse(savedUser) : { user_id: 0 };
   });

   const [walletsState, setWalletsState] = useState(() => loadWalletsState());
   const [categoryStyles, setCategoryStyles] = useState(() => loadCategoryStyles());
   const [expenseBudgetsMonthly, setExpenseBudgetsMonthly] = useState(() =>
      loadExpenseBudgetsMonthly()
   );
   const [txWalletMap, setTxWalletMap] = useState(() => loadTxWalletMap());

   const syncTxMap = useCallback(() => {
      setTxWalletMap(loadTxWalletMap());
   }, []);

   useEffect(() => {
      setLoading(true);
      getIncomes(loggedUser.user_id);
      getExpenses(loggedUser.user_id);
      setLoading(false);
   }, [loggedUser]);

   const getExpenses = async (user_id) => {
      try {
         const res = await axios.get(`${BASE_URL}expenses/${user_id}`);
         setExpenses(res.data);
         return res.data;
      } catch (err) {
         console.error("Error fetching expenses in context:", err);
         setError(err);
         return [];
      }
   };

   const getIncomes = async (user_id) => {
      try {
         const res = await axios.get(`${BASE_URL}incomes/${user_id}`);
         setIncomes(res.data);
         return res.data;
      } catch (err) {
         console.error("Error fetching incomes in context:", err);
         setError(err);
         return [];
      }
   };

   const addExpense = async (expense) => {
      const walletId = expense.walletId ?? DEFAULT_WALLET_ID;
      const body = {
         user_id: expense.user_id,
         category: expense.category,
         date: expense.date,
         amount: expense.amount,
         description: expense.description,
      };
      try {
         await axios.post(`${BASE_URL}addExpense`, body).catch((err) => {
            setError(err.message);
         });
         const data = await getExpenses(expense.user_id);
         const newest = data.reduce((best, row) => (row.id > (best?.id ?? -1) ? row : best), null);
         if (newest && transactionMatchesSubmit(newest, body)) {
            if (walletId && walletId !== DEFAULT_WALLET_ID) {
               setWalletIdForTransaction("e", newest.id, walletId);
            } else {
               removeWalletIdForTransaction("e", newest.id);
            }
            syncTxMap();
         }
      } catch (e) {
         console.error(e);
      }
   };

   const deleteExpense = async (id) => {
      try {
         await axios.delete(`${BASE_URL}deleteExpense/${id}`).catch((err) => {
            setError(err.message);
         });
         removeWalletIdForTransaction("e", id);
         syncTxMap();
         getExpenses(loggedUser.user_id);
      } catch (e) {
         console.error(e);
      }
   };

   const addIncome = async (income) => {
      const walletId = income.walletId ?? DEFAULT_WALLET_ID;
      const body = {
         user_id: income.user_id,
         category: income.category,
         date: income.date,
         amount: income.amount,
         description: income.description,
      };
      try {
         await axios.post(`${BASE_URL}addIncome`, body).catch((err) => {
            setError(err.message);
         });
         const data = await getIncomes(income.user_id);
         const newest = data.reduce((best, row) => (row.id > (best?.id ?? -1) ? row : best), null);
         if (newest && transactionMatchesSubmit(newest, body)) {
            if (walletId && walletId !== DEFAULT_WALLET_ID) {
               setWalletIdForTransaction("i", newest.id, walletId);
            } else {
               removeWalletIdForTransaction("i", newest.id);
            }
            syncTxMap();
         }
      } catch (e) {
         console.error(e);
      }
   };

   const deleteIncome = async (id) => {
      try {
         await axios.delete(`${BASE_URL}deleteIncome/${id}`).catch((err) => {
            setError(err.message);
         });
         removeWalletIdForTransaction("i", id);
         syncTxMap();
         getIncomes(loggedUser.user_id);
      } catch (e) {
         console.error(e);
      }
   };

   const totalExpensesFiltered = (filter, targetValue) => {
      let filterExpense = getFilteredData(expenses, filter, targetValue);
      let total = 0;
      filterExpense.forEach((expense) => {
         total += expense.amount;
      });
      return total;
   };

   const expensesByFiltered = (filter, targetValue) => {
      let filterExpense = getFilteredData(expenses, filter, targetValue);
      filterExpense.sort((a, b) => new Date(a.date) - new Date(b.date));
      return filterExpense;
   };

   const totalIncomesFiltered = (filter, targetValue) => {
      let filterIncomes = getFilteredData(incomes, filter, targetValue);
      let total = 0;
      filterIncomes.forEach((income) => {
         total += income.amount;
      });
      return total;
   };

   const incomesByFiltered = (filter, targetValue) => {
      let filterIncomes = getFilteredData(incomes, filter, targetValue);
      filterIncomes.sort((a, b) => new Date(a.date) - new Date(b.date));
      return filterIncomes;
   };

   const filterByWeek = (dateString, targetWeek) => {
      const date = parseISO(dateString);
      return getISOWeek(date) === targetWeek && getYear(date) === new Date().getFullYear();
   };

   const filterByMonth = (dateString, targetMonth) => {
      const date = parseISO(dateString);
      return getMonth(date) === targetMonth && getYear(date) === new Date().getFullYear();
   };

   const filterByYear = (dateString, targetYear) => {
      const date = parseISO(dateString);
      return getYear(date) === targetYear;
   };

   const getFilteredData = (data, filter, targetValue) => {
      let filteredData;
      switch (filter) {
         case "This Week":
            filteredData = data.filter((item) => filterByWeek(item.date, targetValue));
            break;
         case "This Month":
            filteredData = data.filter((item) => filterByMonth(item.date, targetValue));
            break;
         case "This Year":
            filteredData = data.filter((item) => filterByYear(item.date, targetValue));
            break;
         default:
            console.log("Invalid filter provided");
            return [];
      }
      return filteredData;
   };

   const doLogin = async (email, password) => {
      try {
         const res = await axios.post(`${BASE_URL}sessions`, { email, password });
         const user = res.data;
         localStorage.setItem("loggedUser", JSON.stringify(user));
         setLoggedUser(user);
         return res.data;
      } catch (err) {
         if (err.response && err.response.data && err.response.data.message) {
            throw new Error(err.response.data.message);
         }
         throw new Error("Login failed. Please check your credentials and try again.");
      }
   };

   const doLogout = async () => {
      await fetch(`${BASE_URL}sessions/current`);
      setLoggedUser(0);
   };

   const doRegistration = async (user) => {
      await axios.post(`${BASE_URL}addUser`, user).catch((err) => {
         setError(err.message);
      });
   };

   const persistWallets = (next) => {
      saveWalletsState(next);
      setWalletsState(next);
   };

   const addWallet = (partial) => {
      const cur = loadWalletsState();
      const id = `w_${Date.now()}`;
      const row = {
         id,
         name: partial.name || "Wallet",
         type: partial.type || "Altro",
         initialBalance: Number(partial.initialBalance) || 0,
         color: partial.color || "#6c757d",
      };
      persistWallets({ ...cur, list: [...cur.list, row] });
   };

   const updateWallet = (id, partial) => {
      const cur = loadWalletsState();
      persistWallets({
         ...cur,
         list: cur.list.map((w) => {
            if (w.id !== id) return w;
            const next = { ...w, ...partial };
            if (partial.initialBalance !== undefined) {
               next.initialBalance = Number(partial.initialBalance) || 0;
            }
            return next;
         }),
      });
   };

   const deleteWallet = (id) => {
      if (id === DEFAULT_WALLET_ID) return;
      const cur = loadWalletsState();
      if (cur.list.length <= 1) return;
      persistWallets({ ...cur, list: cur.list.filter((w) => w.id !== id) });
      const map = loadTxWalletMap();
      let changed = false;
      Object.keys(map).forEach((k) => {
         if (map[k] === id) {
            delete map[k];
            changed = true;
         }
      });
      if (changed) saveTxWalletMap(map);
      syncTxMap();
   };

   const setCategoryAppearance = (kind, categoryName, style) => {
      const next = loadCategoryStyles();
      const bucket = kind === "income" ? "income" : "expense";
      next[bucket] = { ...next[bucket], [categoryName]: { ...style } };
      saveCategoryStyles(next);
      setCategoryStyles(next);
   };

   const getCategoryAppearance = useCallback(
      (kind, name) => getStyleForCategory(categoryStyles, kind, name),
      [categoryStyles]
   );

   const setExpenseBudgetForCategory = (categoryName, monthlyAmount) => {
      const cur = loadExpenseBudgetsMonthly();
      const n = Number(monthlyAmount);
      if (!n || n <= 0) {
         delete cur[categoryName];
      } else {
         cur[categoryName] = n;
      }
      saveExpenseBudgetsMonthly(cur);
      setExpenseBudgetsMonthly({ ...cur });
   };

   const getWalletLabel = useCallback(
      (kind, transactionId) => {
         const wid = txWalletMap[txKey(kind, transactionId)] ?? null;
         if (!wid) {
            const main = walletsState.list.find((x) => x.id === DEFAULT_WALLET_ID);
            return main ? main.name : "Predefinito";
         }
         const w = walletsState.list.find((x) => x.id === wid);
         return w ? w.name : wid;
      },
      [txWalletMap, walletsState.list]
   );

   return (
      <GlobalContext.Provider
         value={{
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
            loggedUser,
            incomes,
            expenses,
            wallets: walletsState.list,
            walletsState,
            addWallet,
            updateWallet,
            deleteWallet,
            categoryStyles,
            setCategoryAppearance,
            getCategoryAppearance,
            expenseBudgetsMonthly,
            setExpenseBudgetForCategory,
            txWalletMap,
            getWalletLabel,
            getWalletIdForTransaction: (kind, id) => txWalletMap[txKey(kind, id)] ?? null,
            defaultWalletId: DEFAULT_WALLET_ID,
         }}
      >
         {children}
      </GlobalContext.Provider>
   );
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};
