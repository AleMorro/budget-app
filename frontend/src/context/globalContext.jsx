/**
 * Class to save and contain the various method that make
 * request to the server. General context for application
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { parseISO, getMonth, getYear, getISOWeek } from "date-fns";
import api from "../lib/api";
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
import { loadUserProfile, saveUserProfile, applyTheme } from "../lib/userProfileStore";

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
   const [userProfile, setUserProfileState] = useState(() => loadUserProfile());

   useEffect(() => {
      applyTheme(userProfile.theme);
   }, [userProfile.theme]);

   const displayName =
      (userProfile.displayName && userProfile.displayName.trim()) ||
      loggedUser?.name ||
      "Utente";

   const updateUserProfile = useCallback((partial) => {
      const next = { ...loadUserProfile(), ...partial };
      saveUserProfile(next);
      setUserProfileState(next);
      if (partial.theme != null) applyTheme(next.theme);
   }, []);

   const syncTxMap = useCallback(() => {
      setTxWalletMap(loadTxWalletMap());
   }, []);

   useEffect(() => {
      let cancelled = false;
      api
         .get("sessions/current")
         .then((res) => {
            if (cancelled || !res.data?.user_id) return;
            localStorage.setItem("loggedUser", JSON.stringify(res.data));
            setLoggedUser(res.data);
         })
         .catch(() => {
            if (cancelled) return;
            localStorage.removeItem("loggedUser");
            setLoggedUser({ user_id: 0 });
         });
      return () => {
         cancelled = true;
      };
   }, []);

   useEffect(() => {
      if (!loggedUser?.user_id) {
         setIncomes([]);
         setExpenses([]);
         return;
      }
      setLoading(true);
      Promise.all([getIncomes(loggedUser.user_id), getExpenses(loggedUser.user_id)]).finally(
         () => setLoading(false)
      );
   }, [loggedUser.user_id]);

   const getExpenses = async (user_id) => {
      try {
         const res = await api.get(`expenses/${user_id}`);
         setExpenses(res.data);
         return res.data;
      } catch (err) {
         console.error("Error fetching expenses in context:", err);
         if (err.response?.status === 401) {
            localStorage.removeItem("loggedUser");
            setLoggedUser({ user_id: 0 });
         }
         setError(err);
         return [];
      }
   };

   const getIncomes = async (user_id) => {
      try {
         const res = await api.get(`incomes/${user_id}`);
         setIncomes(res.data);
         return res.data;
      } catch (err) {
         console.error("Error fetching incomes in context:", err);
         if (err.response?.status === 401) {
            localStorage.removeItem("loggedUser");
            setLoggedUser({ user_id: 0 });
         }
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
         await api.post("addExpense", body);
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
         await api.delete(`deleteExpense/${id}`);
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
         await api.post("addIncome", body);
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
         await api.delete(`deleteIncome/${id}`);
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
         const res = await api.post("sessions", { email, password });
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
      try {
         await api.delete("sessions/current");
      } catch (e) {
         console.error(e);
      }
      localStorage.removeItem("loggedUser");
      setLoggedUser({ user_id: 0 });
      setIncomes([]);
      setExpenses([]);
   };

   const doRegistration = async (user) => {
      try {
         const body = {
            name: user.name?.trim(),
            email: user.email?.trim().toLowerCase(),
            password: user.password,
         };
         await api.post("addUser", body);
      } catch (err) {
         const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Registrazione non riuscita.";
         throw new Error(msg);
      }
   };

   const checkEmailAvailable = async (email) => {
      const normalized = String(email || "").trim().toLowerCase();
      const res = await api.get("users/check-email", {
         params: { email: normalized },
      });
      return res.data;
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
            checkEmailAvailable,
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
            userProfile,
            displayName,
            updateUserProfile,
         }}
      >
         {children}
      </GlobalContext.Provider>
   );
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};
