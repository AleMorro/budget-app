const K = "budgetApp_v1_portfolioLots";

const DEFAULT_BROKERS = [
   "Directa",
   "Fineco",
   "Trade Republic",
   "Degiro",
   "eToro",
   "Interactive Brokers",
   "Altro",
];

function safeParse(json, fallback) {
   try {
      if (!json) return fallback;
      return JSON.parse(json);
   } catch {
      return fallback;
   }
}

export function getDefaultBrokers() {
   return [...DEFAULT_BROKERS];
}

/** @returns {Array<{id:string,symbol:string,broker:string,purchaseDate:string,purchasePrice:number,quantity:number,notes?:string}>} */
export function loadPortfolioLots() {
   const raw = safeParse(localStorage.getItem(K), null);
   if (!raw || !Array.isArray(raw.lots)) return [];
   return raw.lots.map((lot) => ({
      id: lot.id,
      symbol: String(lot.symbol || "").toUpperCase(),
      broker: String(lot.broker || "Altro").trim(),
      purchaseDate: lot.purchaseDate || "",
      purchasePrice: Number(lot.purchasePrice) || 0,
      quantity: Number(lot.quantity) || 0,
      notes: lot.notes || "",
   }));
}

function saveLots(lots) {
   localStorage.setItem(K, JSON.stringify({ lots }));
}

export function addPortfolioLot(partial) {
   const sym = String(partial.symbol || "")
      .trim()
      .toUpperCase();
   if (!sym) return loadPortfolioLots();

   const lot = {
      id: `lot_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      symbol: sym,
      broker: String(partial.broker || "Altro").trim() || "Altro",
      purchaseDate: partial.purchaseDate || new Date().toISOString().slice(0, 10),
      purchasePrice: Number(partial.purchasePrice) || 0,
      quantity: Number(partial.quantity) || 0,
      notes: partial.notes || "",
   };

   const lots = [...loadPortfolioLots(), lot];
   saveLots(lots);
   return lots;
}

export function removePortfolioLot(id) {
   const lots = loadPortfolioLots().filter((l) => l.id !== id);
   saveLots(lots);
   return lots;
}

export function getUniqueSymbolsFromLots(lots) {
   return [...new Set((lots || []).map((l) => l.symbol).filter(Boolean))].sort();
}
