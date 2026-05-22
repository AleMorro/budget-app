import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import PageTitle from "../PageTitle";
import Footer from "../../Footer";
import StockWatchChart from "./StockWatchChart";
import PortfolioPositionForm from "./PortfolioPositionForm";
import PortfolioSummary from "./PortfolioSummary";
import {
   loadStockWatchlist,
   addSymbolToWatchlist,
   setActiveSymbol,
} from "../../../../lib/stockWatchlistStore";
import {
   loadPortfolioLots,
   addPortfolioLot,
   removePortfolioLot,
   getUniqueSymbolsFromLots,
} from "../../../../lib/portfolioStore";
import "../../styles/Main.css";
import "../../styles/Dashboard.css";

const BASE_URL = "http://localhost:5000/api/";
const REFRESH_MS = 5 * 60 * 1000;

function StockWatch() {
   const [watchlist, setWatchlist] = useState(() => loadStockWatchlist());
   const [lots, setLots] = useState(() => loadPortfolioLots());
   const [quotesBySymbol, setQuotesBySymbol] = useState({});
   const [quote, setQuote] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [lastFetch, setLastFetch] = useState(null);
   const [tick, setTick] = useState(0);

   const portfolioSymbols = useMemo(() => getUniqueSymbolsFromLots(lots), [lots]);
   const symbolsToFetch = useMemo(() => {
      const set = new Set([...portfolioSymbols, ...(watchlist.symbols || [])]);
      if (watchlist.active) set.add(watchlist.active);
      return [...set];
   }, [portfolioSymbols, watchlist.symbols, watchlist.active]);

   const active = watchlist.active;

   const fetchBatchQuotes = useCallback(async (silent = false) => {
      if (!symbolsToFetch.length) {
         setQuotesBySymbol({});
         return;
      }
      if (!silent) setLoading(true);
      setError(null);
      try {
         const res = await axios.post(`${BASE_URL}stocks/quotes`, {
            symbols: symbolsToFetch,
         });
         setQuotesBySymbol(res.data.quotes || {});
         setLastFetch(new Date());
      } catch (err) {
         setError(
            err.response?.data?.error ||
               err.message ||
               "Impossibile aggiornare le quotazioni del portafoglio."
         );
      } finally {
         if (!silent) setLoading(false);
      }
   }, [symbolsToFetch]);

   useEffect(() => {
      fetchBatchQuotes(tick > 0);
   }, [fetchBatchQuotes, tick]);

   useEffect(() => {
      if (!active) {
         setQuote(null);
         return;
      }
      if (quotesBySymbol[active]) {
         setQuote(quotesBySymbol[active]);
         return;
      }
      axios
         .get(`${BASE_URL}stocks/${encodeURIComponent(active)}`)
         .then((res) => {
            setQuote(res.data);
            setQuotesBySymbol((prev) => ({ ...prev, [active]: res.data }));
         })
         .catch(() => setQuote(null));
   }, [active, quotesBySymbol]);

   useEffect(() => {
      if (!symbolsToFetch.length) return undefined;
      const id = setInterval(() => setTick((t) => t + 1), REFRESH_MS);
      return () => clearInterval(id);
   }, [symbolsToFetch.length]);

   const handleAddLot = (partial) => {
      const nextLots = addPortfolioLot(partial);
      setLots(nextLots);
      const wl = addSymbolToWatchlist(partial.symbol);
      setWatchlist(wl);
   };

   const handleRemoveLot = (id) => {
      setLots(removePortfolioLot(id));
   };

   const handleSelectSymbol = (sym) => {
      const upper = String(sym).toUpperCase();
      let wl = watchlist;
      if (!wl.symbols.includes(upper)) {
         wl = addSymbolToWatchlist(upper);
      } else {
         wl = setActiveSymbol(upper);
      }
      setWatchlist(wl);
   };

   const activePosition = useMemo(() => {
      if (!active) return null;
      const symbolLots = lots.filter((l) => l.symbol === active);
      if (!symbolLots.length) return null;
      const q = quotesBySymbol[active];
      const grouped = symbolLots.reduce(
         (acc, lot) => {
            acc.quantity += Number(lot.quantity) || 0;
            acc.cost += (Number(lot.quantity) || 0) * (Number(lot.purchasePrice) || 0);
            return acc;
         },
         { quantity: 0, cost: 0 }
      );
      const avg = grouped.quantity > 0 ? grouped.cost / grouped.quantity : 0;
      const price = q?.price ?? null;
      const plPct =
         avg > 0 && price != null ? ((price - avg) / avg) * 100 : null;
      return { avgPrice: avg, quantity: grouped.quantity, plPercent: plPct, currency: q?.currency };
   }, [active, lots, quotesBySymbol]);

   const changeUp = quote?.change != null && quote.change >= 0;
   const holdingPlUp = activePosition?.plPercent != null && activePosition.plPercent >= 0;

   return (
      <main id="main" className="main">
         <PageTitle page="Portafoglio investimenti" />

         <section className="dashboard section">
            <div className="row g-3 mb-3">
               <div className="col-12">
                  <div className="card">
                     <div className="card-body">
                        <h5 className="card-title">Panoramica multi-broker</h5>
                        <p className="text-muted small mb-3">
                           Registra ogni acquisto con broker, data, prezzo e quantità. PMC
                           ponderata, P&amp;L e valore aggiornati ogni{" "}
                           <strong>5 minuti</strong>
                           {lastFetch &&
                              ` · ultimo aggiornamento: ${lastFetch.toLocaleTimeString("it-IT")}`}
                        </p>
                        {error && (
                           <div className="alert alert-warning py-2 small" role="alert">
                              {error}
                           </div>
                        )}
                        <PortfolioSummary
                           lots={lots}
                           quotesBySymbol={quotesBySymbol}
                           activeSymbol={active}
                           onSelectSymbol={handleSelectSymbol}
                           onRemoveLot={handleRemoveLot}
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="row g-3">
               <div className="col-12 col-lg-4">
                  <div className="card h-100">
                     <div className="card-body">
                        <h5 className="card-title">Nuovo acquisto</h5>
                        <p className="text-muted small">
                           Simboli Yahoo: <code>ENI.MI</code>, <code>AAPL</code>, ETF{" "}
                           <code>SWDA.MI</code>.
                        </p>
                        <PortfolioPositionForm onAdd={handleAddLot} />
                     </div>
                  </div>
               </div>

               <div className="col-12 col-lg-8">
                  <div className="card">
                     <div className="card-body">
                        {!active ? (
                           <p className="text-muted mb-0">
                              Clicca un titolo nel riepilogo per visualizzare il grafico
                              intraday.
                           </p>
                        ) : (
                           <>
                              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                                 <div>
                                    <h5 className="card-title mb-1">
                                       {quote?.shortName || active}
                                       <span className="text-muted fs-6 ms-2">{active}</span>
                                    </h5>
                                    {quote?.exchange && (
                                       <p className="text-muted small mb-0">{quote.exchange}</p>
                                    )}
                                    {activePosition && (
                                       <p className="small mb-0 mt-1">
                                          In portafoglio: {activePosition.quantity.toLocaleString("it-IT")}{" "}
                                          azioni · PMC{" "}
                                          {activePosition.avgPrice.toLocaleString("it-IT", {
                                             minimumFractionDigits: 2,
                                             maximumFractionDigits: 4,
                                          })}{" "}
                                          {activePosition.currency}
                                          {activePosition.plPercent != null && (
                                             <span
                                                className={`badge ms-2 ${
                                                   holdingPlUp ? "bg-success" : "bg-danger"
                                                }`}
                                             >
                                                {holdingPlUp ? "+" : ""}
                                                {activePosition.plPercent.toFixed(2)}% sul titolo
                                             </span>
                                          )}
                                       </p>
                                    )}
                                 </div>
                                 <div className="text-end">
                                    {quote?.price != null && (
                                       <div className="fs-4 fw-semibold">
                                          {quote.price.toLocaleString("it-IT", {
                                             minimumFractionDigits: 2,
                                             maximumFractionDigits: 4,
                                          })}{" "}
                                          <span className="fs-6 text-muted">
                                             {quote.currency}
                                          </span>
                                       </div>
                                    )}
                                    {quote?.change != null && (
                                       <span
                                          className={`badge ${
                                             changeUp ? "bg-success" : "bg-danger"
                                          }`}
                                       >
                                          giorn. {changeUp ? "+" : ""}
                                          {quote.changePercent?.toFixed(2)}%
                                       </span>
                                    )}
                                 </div>
                              </div>

                              <StockWatchChart
                                 symbol={active}
                                 currency={quote?.currency}
                                 points={quote?.chart?.points}
                                 loading={loading}
                              />
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}

export default StockWatch;
