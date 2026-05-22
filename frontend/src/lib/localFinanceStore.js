/**
 * Persistenza locale (localStorage) per wallet, budget mensile, stili categoria, mapping transazione→wallet.
 */

import {
   DEFAULT_CATEGORY_STYLE,
   DEFAULT_EXPENSE_CATEGORIES,
   DEFAULT_INCOME_CATEGORIES,
} from "./appConstants";

const K = {
   wallets: "budgetApp_v1_wallets",
   txWallet: "budgetApp_v1_txWallet",
   catStyles: "budgetApp_v1_categoryStyles",
   budgets: "budgetApp_v1_budgetsMonthlyExpense",
};

const SEED_WALLETS = [
   {
      id: "w_main",
      name: "Main Account",
      type: "Conto",
      initialBalance: 2500,
      color: "#4154f1",
   },
   {
      id: "w_cash",
      name: "Cash",
      type: "Contanti",
      initialBalance: 150,
      color: "#2eca6a",
   },
   {
      id: "w_savings",
      name: "Savings",
      type: "Risparmi",
      initialBalance: 5000,
      color: "#899bbd",
   },
   {
      id: "w_credit",
      name: "Credit Card",
      type: "Carta",
      initialBalance: -320,
      color: "#b83941",
   },
];

function safeParse(json, fallback) {
   try {
      if (!json) return fallback;
      return JSON.parse(json);
   } catch {
      return fallback;
   }
}

export const DEFAULT_WALLET_ID = "w_main";

export function loadWalletsState() {
   const raw = localStorage.getItem(K.wallets);
   const parsed = safeParse(raw, null);
   if (!parsed || !Array.isArray(parsed.list) || parsed.list.length === 0) {
      const initial = { list: SEED_WALLETS.map((w) => ({ ...w })), seeded: true };
      localStorage.setItem(K.wallets, JSON.stringify(initial));
      return initial;
   }
   return parsed;
}

export function saveWalletsState(state) {
   localStorage.setItem(K.wallets, JSON.stringify(state));
}

export function loadTxWalletMap() {
   return safeParse(localStorage.getItem(K.txWallet), {});
}

export function saveTxWalletMap(map) {
   localStorage.setItem(K.txWallet, JSON.stringify(map));
}

export function txKey(kind, id) {
   return `${kind}:${String(id)}`;
}

export function getWalletIdForTransaction(kind, transactionId) {
   const map = loadTxWalletMap();
   return map[txKey(kind, transactionId)] ?? null;
}

export function setWalletIdForTransaction(kind, transactionId, walletId) {
   const map = loadTxWalletMap();
   if (!walletId || walletId === DEFAULT_WALLET_ID) {
      delete map[txKey(kind, transactionId)];
   } else {
      map[txKey(kind, transactionId)] = walletId;
   }
   saveTxWalletMap(map);
}

export function removeWalletIdForTransaction(kind, transactionId) {
   const map = loadTxWalletMap();
   delete map[txKey(kind, transactionId)];
   saveTxWalletMap(map);
}

/** @returns {{ income: Record<string,{color:string,icon:string}>, expense: Record<string,{color:string,icon:string}> }} */
export function loadCategoryStyles() {
   const raw = safeParse(localStorage.getItem(K.catStyles), null);
   if (!raw || typeof raw !== "object") {
      const income = {};
      const expense = {};
      DEFAULT_INCOME_CATEGORIES.forEach((c, i) => {
         income[c] = {
            color: ["#4154f1", "#2eca6a", "#ff771d", "#6f42c1", "#899bbd"][i % 5],
            icon: "bi-bank",
         };
      });
      DEFAULT_EXPENSE_CATEGORIES.forEach((c, i) => {
         expense[c] = {
            color: ["#b83941", "#ff771d", "#6f42c1", "#0dcaf0", "#2eca6a", "#899bbd", "#4154f1", "#6c757d"][i % 8],
            icon: ICON_FOR_EXPENSE_CATEGORY(c),
         };
      });
      const initial = { income, expense };
      localStorage.setItem(K.catStyles, JSON.stringify(initial));
      return initial;
   }
   return {
      income: raw.income || {},
      expense: raw.expense || {},
   };
}

function ICON_FOR_EXPENSE_CATEGORY(name) {
   const m = {
      Food: "bi-cup-hot",
      Shopping: "bi-bag",
      Gifts: "bi-gift",
      Entertainment: "bi-controller",
      Transport: "bi-car-front",
      Home: "bi-house",
      Vices: "bi-heart",
      Other: "bi-tag",
   };
   return m[name] || "bi-tag";
}

export function saveCategoryStyles(styles) {
   localStorage.setItem(K.catStyles, JSON.stringify(styles));
}

export function getStyleForCategory(styles, kind, name) {
   const bucket = kind === "income" ? styles.income : styles.expense;
   const s = bucket[name];
   return s ? { ...DEFAULT_CATEGORY_STYLE, ...s } : { ...DEFAULT_CATEGORY_STYLE };
}

/** Monthly expense budgets: category -> amount (number) */
export function loadExpenseBudgetsMonthly() {
   return safeParse(localStorage.getItem(K.budgets), {});
}

export function saveExpenseBudgetsMonthly(map) {
   localStorage.setItem(K.budgets, JSON.stringify(map));
}

/**
 * Saldo stimato = saldo iniziale + entrate assegnate al wallet − uscite assegnate.
 * Movimenti senza mapping → wallet predefinito (Main Account).
 */
export function computeWalletBalances(wallets, incomes, expenses, txWalletMap) {
   const agg = {};
   (wallets || []).forEach((w) => {
      agg[w.id] = Number(w.initialBalance) || 0;
   });

   (incomes || []).forEach((row) => {
      const wid = txWalletMap[txKey("i", row.id)] ?? DEFAULT_WALLET_ID;
      if (agg[wid] !== undefined) agg[wid] += Number(row.amount) || 0;
   });

   (expenses || []).forEach((row) => {
      const wid = txWalletMap[txKey("e", row.id)] ?? DEFAULT_WALLET_ID;
      if (agg[wid] !== undefined) agg[wid] -= Number(row.amount) || 0;
   });

   return (wallets || []).map((w) => ({
      ...w,
      balance: agg[w.id] ?? (Number(w.initialBalance) || 0),
   }));
}

export function mergeCategoryNamesFromData(incomes, expenses, kind) {
   const defaults = kind === "income" ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;
   const set = new Set(defaults);
   const rows = kind === "income" ? incomes || [] : expenses || [];
   rows.forEach((row) => {
      if (row?.category) set.add(row.category);
   });
   return Array.from(set).sort((a, b) => a.localeCompare(b));
}
