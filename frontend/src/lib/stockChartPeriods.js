/** Preset grafico portafoglio → parametri API Yahoo */
export const CHART_PERIODS = {
   "1d": { label: "Giornata", interval: "1m", range: "1d" },
   "1mo": { label: "1 mese", interval: "1d", range: "1mo" },
   "6mo": { label: "6 mesi", interval: "1d", range: "6mo" },
   "1y": { label: "1 anno", interval: "1d", range: "1y" },
   fromPurchase: { label: "Dal primo acquisto", interval: "1d", custom: true },
};

export function oldestPurchaseDateForSymbol(lots, symbol) {
   const dates = (lots || [])
      .filter((l) => l.symbol === symbol && l.purchaseDate)
      .map((l) => l.purchaseDate);
   if (!dates.length) return null;
   return dates.sort()[0];
}

export function buildChartQueryParams(periodKey, oldestDate) {
   const preset = CHART_PERIODS[periodKey] || CHART_PERIODS["1d"];
   if (periodKey === "fromPurchase" && oldestDate) {
      const d = new Date(oldestDate);
      if (!Number.isNaN(d.getTime())) {
         return {
            interval: "1d",
            period1: Math.floor(d.getTime() / 1000),
         };
      }
   }
   return { interval: preset.interval, range: preset.range };
}
