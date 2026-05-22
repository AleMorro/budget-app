const K = "budgetApp_v1_stockWatchlist";

function safeParse(json, fallback) {
   try {
      if (!json) return fallback;
      return JSON.parse(json);
   } catch {
      return fallback;
   }
}

const DEFAULT = { symbols: [], active: null };

export function loadStockWatchlist() {
   const raw = safeParse(localStorage.getItem(K), null);
   if (!raw || !Array.isArray(raw.symbols)) return { ...DEFAULT };
   return {
      symbols: raw.symbols.map((s) => String(s).toUpperCase()),
      active: raw.active ? String(raw.active).toUpperCase() : null,
   };
}

export function saveStockWatchlist(state) {
   localStorage.setItem(
      K,
      JSON.stringify({
         symbols: state.symbols || [],
         active: state.active || null,
      })
   );
}

export function addSymbolToWatchlist(symbol) {
   const sym = String(symbol || "")
      .trim()
      .toUpperCase();
   if (!sym) return loadStockWatchlist();
   const cur = loadStockWatchlist();
   if (!cur.symbols.includes(sym)) {
      cur.symbols = [...cur.symbols, sym].sort((a, b) => a.localeCompare(b));
   }
   cur.active = sym;
   saveStockWatchlist(cur);
   return cur;
}

export function removeSymbolFromWatchlist(symbol) {
   const sym = String(symbol).toUpperCase();
   const cur = loadStockWatchlist();
   cur.symbols = cur.symbols.filter((s) => s !== sym);
   if (cur.active === sym) {
      cur.active = cur.symbols[0] || null;
   }
   saveStockWatchlist(cur);
   return cur;
}

export function setActiveSymbol(symbol) {
   const cur = loadStockWatchlist();
   const sym = symbol ? String(symbol).toUpperCase() : null;
   if (sym && cur.symbols.includes(sym)) {
      cur.active = sym;
      saveStockWatchlist(cur);
   }
   return cur;
}
