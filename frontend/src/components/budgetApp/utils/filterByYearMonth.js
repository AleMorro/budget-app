import { parseISO, getYear, getMonth } from "date-fns";

/**
 * @param {Array} items transactions with .date ISO string
 * @param {number} year full year e.g. 2025
 * @param {number} monthIndex -1 = whole year, 0-11 = January-December
 */
export function filterByYearMonth(items, year, monthIndex) {
   return (items || []).filter((item) => {
      if (!item?.date) return false;
      const d = parseISO(item.date);
      if (getYear(d) !== year) return false;
      if (monthIndex >= 0 && getMonth(d) !== monthIndex) return false;
      return true;
   });
}

export function getYearOptionsFromTransactions(items, fallbackYear) {
   const years = new Set();
   (items || []).forEach((i) => {
      if (i?.date) {
         try {
            years.add(getYear(parseISO(i.date)));
         } catch {
            /* ignore */
         }
      }
   });
   years.add(fallbackYear);
   return Array.from(years).sort((a, b) => b - a);
}

/**
 * Every year from the earliest transaction (incomes + expenses) through max(data year, current year).
 * Descending order for select UI (most recent first).
 */
export function getYearRangeOptionsFromTransactions(incomes, expenses) {
   const years = new Set();
   const collect = (arr) => {
      (arr || []).forEach((i) => {
         if (i?.date) {
            try {
               years.add(getYear(parseISO(i.date)));
            } catch {
               /* ignore */
            }
         }
      });
   };
   collect(incomes);
   collect(expenses);
   const current = new Date().getFullYear();
   if (years.size === 0) {
      return [current];
   }
   const minY = Math.min(...years);
   const maxY = Math.max(...years, current);
   const options = [];
   for (let y = maxY; y >= minY; y -= 1) {
      options.push(y);
   }
   return options;
}

/**
 * Periodo immediatamente precedente (calendario).
 * monthIndex -1 = anno intero → periodo precedente = anno intero precedente.
 * monthIndex 0–11 = mese → mese precedente (gennaio → dicembre anno-1).
 */
export function getPreviousYearMonthPeriod(year, monthIndex) {
   if (monthIndex >= 0) {
      if (monthIndex > 0) {
         return { year, monthIndex: monthIndex - 1 };
      }
      return { year: year - 1, monthIndex: 11 };
   }
   return { year: year - 1, monthIndex: -1 };
}

export function sumTransactionAmounts(items) {
   return (items || []).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
}
