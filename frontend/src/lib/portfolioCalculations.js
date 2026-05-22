/**
 * Calcoli P&L stile broker su singolo lotto o aggregati.
 */

export function lotCostBasis(lot) {
   const q = Number(lot.quantity) || 0;
   const p = Number(lot.purchasePrice) || 0;
   return q * p;
}

/** @param {object} lot @param {{ price?: number|null, currency?: string }} quote */
export function metricsForLot(lot, quote) {
   const qty = Number(lot.quantity) || 0;
   const buy = Number(lot.purchasePrice) || 0;
   const cost = qty * buy;
   const price = quote?.price ?? null;
   const market = price != null ? qty * price : null;
   const pl = market != null ? market - cost : null;
   const plPct =
      cost > 0 && pl != null ? (pl / cost) * 100 : buy > 0 && price != null ? ((price - buy) / buy) * 100 : null;

   return {
      quantity: qty,
      avgPrice: buy,
      cost,
      price,
      marketValue: market,
      plAmount: pl,
      plPercent: plPct,
      currency: quote?.currency || "EUR",
      shortName: quote?.shortName || lot.symbol,
   };
}

/**
 * Raggruppa per symbol + broker (PMC ponderata).
 */
export function groupBySymbolBroker(lots) {
   const map = new Map();
   (lots || []).forEach((lot) => {
      const key = `${lot.symbol}::${lot.broker}`;
      if (!map.has(key)) {
         map.set(key, {
            symbol: lot.symbol,
            broker: lot.broker,
            lots: [],
            quantity: 0,
            totalCost: 0,
         });
      }
      const g = map.get(key);
      g.lots.push(lot);
      const q = Number(lot.quantity) || 0;
      const p = Number(lot.purchasePrice) || 0;
      g.quantity += q;
      g.totalCost += q * p;
   });

   return Array.from(map.values()).map((g) => ({
      ...g,
      avgPrice: g.quantity > 0 ? g.totalCost / g.quantity : 0,
   }));
}

/** @param {ReturnType<groupBySymbolBroker>} groups @param {Record<string, object>} quotesBySymbol */
export function metricsForGroup(group, quotesBySymbol) {
   const quote = quotesBySymbol[group.symbol];
   const price = quote?.price ?? null;
   const market = price != null ? group.quantity * price : null;
   const pl = market != null ? market - group.totalCost : null;
   const plPct =
      group.totalCost > 0 && pl != null
         ? (pl / group.totalCost) * 100
         : group.avgPrice > 0 && price != null
           ? ((price - group.avgPrice) / group.avgPrice) * 100
           : null;

   return {
      ...group,
      price,
      marketValue: market,
      plAmount: pl,
      plPercent: plPct,
      currency: quote?.currency || "EUR",
      shortName: quote?.shortName || group.symbol,
   };
}

export function portfolioTotals(groupsWithMetrics) {
   let invested = 0;
   let market = 0;
   let hasMarket = false;

   groupsWithMetrics.forEach((g) => {
      invested += g.totalCost || 0;
      if (g.marketValue != null) {
         market += g.marketValue;
         hasMarket = true;
      }
   });

   const pl = hasMarket ? market - invested : null;
   const plPercent = invested > 0 && pl != null ? (pl / invested) * 100 : null;

   return { invested, marketValue: hasMarket ? market : null, plAmount: pl, plPercent: plPercent };
}

export function formatMoney(n, currency = "EUR") {
   if (n == null || Number.isNaN(n)) return "—";
   return `${Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export function formatPct(n) {
   if (n == null || Number.isNaN(n)) return "—";
   const sign = n >= 0 ? "+" : "";
   return `${sign}${n.toFixed(2)}%`;
}
