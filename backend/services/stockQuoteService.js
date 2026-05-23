/**
 * Quote e serie intraday via Yahoo Finance (uso educativo / demo).
 * Simboli es. AAPL, MSFT, ENI.MI, UCG.MI (Borsa Italiana).
 */

const YAHOO_CHART = "https://query1.finance.yahoo.com/v8/finance/chart";

const SYMBOL_RE = /^[A-Za-z0-9.^=-]{1,24}$/;

function normalizeSymbol(raw) {
   return String(raw || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");
}

function validateSymbol(symbol) {
   if (!symbol || !SYMBOL_RE.test(symbol)) {
      const err = new Error("Simbolo non valido. Usa es. AAPL, ENI.MI, MSFT.");
      err.status = 400;
      throw err;
   }
   return symbol;
}

async function fetchYahooChart(symbol, opts = {}) {
   const interval = opts.interval || "1m";
   let url = `${YAHOO_CHART}/${encodeURIComponent(symbol)}?interval=${encodeURIComponent(interval)}`;
   if (opts.period1 != null) {
      const period2 = opts.period2 ?? Math.floor(Date.now() / 1000);
      url += `&period1=${opts.period1}&period2=${period2}`;
   } else {
      url += `&range=${encodeURIComponent(opts.range || "1d")}`;
   }
   const res = await fetch(url, {
      headers: {
         "User-Agent": "Mozilla/5.0 (compatible; BudgetApp/1.0)",
      },
   });
   if (!res.ok) {
      const err = new Error(`Dati non disponibili per ${symbol} (${res.status})`);
      err.status = res.status === 404 ? 404 : 502;
      throw err;
   }
   const json = await res.json();
   const result = json?.chart?.result?.[0];
   if (!result) {
      const err = new Error(`Nessun dato per il simbolo ${symbol}`);
      err.status = 404;
      throw err;
   }
   return result;
}

function buildSeries(result) {
   const timestamps = result.timestamp || [];
   const closes = result.indicators?.quote?.[0]?.close || [];
   const points = [];
   for (let i = 0; i < timestamps.length; i++) {
      const c = closes[i];
      if (c == null || Number.isNaN(c)) continue;
      points.push({ x: timestamps[i] * 1000, y: Number(c) });
   }
   return points;
}

/**
 * @param {string} rawSymbol
 * @param {{ interval?: string, range?: string }} opts
 */
async function getStockQuote(rawSymbol, opts = {}) {
   const symbol = validateSymbol(normalizeSymbol(rawSymbol));
   const interval = opts.interval || "1m";
   const range = opts.range || "1d";
   const period1 =
      opts.period1 != null ? Number(opts.period1) : undefined;

   const result = await fetchYahooChart(symbol, {
      interval,
      range,
      period1,
      period2: opts.period2,
   });
   const meta = result.meta || {};
   const points = buildSeries(result);

   const price = meta.regularMarketPrice ?? meta.previousClose ?? null;
   const prev = meta.chartPreviousClose ?? meta.previousClose ?? price;
   const change = price != null && prev != null ? price - prev : null;
   const changePercent =
      change != null && prev ? (change / prev) * 100 : null;

   return {
      symbol: meta.symbol || symbol,
      shortName: meta.shortName || meta.longName || symbol,
      currency: meta.currency || "EUR",
      exchange: meta.exchangeName || meta.fullExchangeName || "",
      price,
      previousClose: prev,
      change,
      changePercent,
      marketState: meta.marketState || "UNKNOWN",
      updatedAt: new Date().toISOString(),
      chart: {
         interval,
         range,
         points,
      },
   };
}

/**
 * Quote multiple symbols (max 25), per aggiornamento portafoglio.
 * @param {string[]} rawSymbols
 */
async function getStockQuotesBatch(rawSymbols) {
   const unique = [
      ...new Set(
         (rawSymbols || [])
            .map(normalizeSymbol)
            .filter(Boolean)
      ),
   ].slice(0, 25);

   const results = await Promise.all(
      unique.map(async (symbol) => {
         try {
            const data = await getStockQuote(symbol, { interval: "1m", range: "1d" });
            return { symbol, ok: true, data };
         } catch (err) {
            return { symbol, ok: false, error: err.message };
         }
      })
   );

   const bySymbol = {};
   results.forEach((r) => {
      if (r.ok) bySymbol[r.symbol] = r.data;
   });

   return { quotes: bySymbol, results, updatedAt: new Date().toISOString() };
}

module.exports = {
   getStockQuote,
   getStockQuotesBatch,
   normalizeSymbol,
   validateSymbol,
};
