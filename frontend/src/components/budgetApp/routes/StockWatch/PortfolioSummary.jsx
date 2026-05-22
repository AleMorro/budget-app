import React, { useMemo } from "react";
import {
   groupBySymbolBroker,
   metricsForGroup,
   metricsForLot,
   portfolioTotals,
   formatMoney,
   formatPct,
} from "../../../../lib/portfolioCalculations";

function PlBadge({ pct, amount, currency }) {
   if (pct == null) return <span className="text-muted small">—</span>;
   const up = pct >= 0;
   return (
      <span>
         <span className={`badge ${up ? "bg-success" : "bg-danger"} me-1`}>{formatPct(pct)}</span>
         {amount != null && (
            <span className={`small ${up ? "text-success" : "text-danger"}`}>
               {formatMoney(amount, currency)}
            </span>
         )}
      </span>
   );
}

function PortfolioSummary({ lots, quotesBySymbol, onSelectSymbol, onRemoveLot, activeSymbol }) {
   const groups = useMemo(() => groupBySymbolBroker(lots), [lots]);

   const groupsMetrics = useMemo(
      () => groups.map((g) => metricsForGroup(g, quotesBySymbol)),
      [groups, quotesBySymbol]
   );

   const totals = useMemo(() => portfolioTotals(groupsMetrics), [groupsMetrics]);

   const byBroker = useMemo(() => {
      const m = new Map();
      groupsMetrics.forEach((g) => {
         if (!m.has(g.broker)) m.set(g.broker, []);
         m.get(g.broker).push(g);
      });
      return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
   }, [groupsMetrics]);

   if (!lots.length) {
      return (
         <p className="text-muted small mb-0">
            Nessuna posizione in portafoglio. Registra un acquisto nel form sopra.
         </p>
      );
   }

   return (
      <>
         <div className="row g-2 mb-4">
            <div className="col-6 col-md-3">
               <div className="border rounded p-2 bg-light">
                  <div className="text-muted small">Capitale investito</div>
                  <div className="fw-semibold">{formatMoney(totals.invested)}</div>
               </div>
            </div>
            <div className="col-6 col-md-3">
               <div className="border rounded p-2 bg-light">
                  <div className="text-muted small">Valore attuale</div>
                  <div className="fw-semibold">
                     {formatMoney(totals.marketValue)}
                  </div>
               </div>
            </div>
            <div className="col-6 col-md-3">
               <div className="border rounded p-2 bg-light">
                  <div className="text-muted small">P&amp;L totale</div>
                  <div className="fw-semibold">
                     <PlBadge pct={totals.plPercent} amount={totals.plAmount} />
                  </div>
               </div>
            </div>
            <div className="col-6 col-md-3">
               <div className="border rounded p-2 bg-light">
                  <div className="text-muted small">Posizioni</div>
                  <div className="fw-semibold">{groups.length}</div>
                  <div className="text-muted small">{lots.length} operazioni</div>
               </div>
            </div>
         </div>

         {byBroker.map(([broker, items]) => (
            <div key={broker} className="mb-4">
               <h6 className="text-primary mb-2">
                  <i className="bi bi-bank me-1" aria-hidden />
                  {broker}
               </h6>
               <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle mb-0">
                     <thead className="table-light">
                        <tr>
                           <th>Titolo</th>
                           <th>Qtà</th>
                           <th>PMC</th>
                           <th>Prezzo mercato</th>
                           <th>Valore</th>
                           <th>P&amp;L</th>
                           <th />
                        </tr>
                     </thead>
                     <tbody>
                        {items.map((g) => (
                           <tr
                              key={`${g.symbol}-${g.broker}`}
                              className={activeSymbol === g.symbol ? "table-primary" : ""}
                              style={{ cursor: "pointer" }}
                              onClick={() => onSelectSymbol(g.symbol)}
                           >
                              <td className="fw-medium">
                                 {g.shortName}
                                 <span className="text-muted small d-block">{g.symbol}</span>
                              </td>
                              <td>{g.quantity.toLocaleString("it-IT")}</td>
                              <td>{formatMoney(g.avgPrice, g.currency)}</td>
                              <td>{formatMoney(g.price, g.currency)}</td>
                              <td>{formatMoney(g.marketValue, g.currency)}</td>
                              <td>
                                 <PlBadge
                                    pct={g.plPercent}
                                    amount={g.plAmount}
                                    currency={g.currency}
                                 />
                              </td>
                              <td onClick={(e) => e.stopPropagation()}>
                                 <button
                                    type="button"
                                    className="btn btn-link btn-sm p-0 text-primary"
                                    title="Grafico"
                                    onClick={() => onSelectSymbol(g.symbol)}
                                 >
                                    <i className="bi bi-graph-up" aria-hidden />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         ))}

         <h6 className="mt-4 mb-2">Storico operazioni</h6>
         <div className="table-responsive">
            <table className="table table-sm align-middle">
               <thead className="table-light">
                  <tr>
                     <th>Data</th>
                     <th>Broker</th>
                     <th>Titolo</th>
                     <th>Qtà</th>
                     <th>Prezzo</th>
                     <th>Investito</th>
                     <th>P&amp;L su lotto</th>
                     <th />
                  </tr>
               </thead>
               <tbody>
                  {[...lots]
                     .sort((a, b) => String(b.purchaseDate).localeCompare(String(a.purchaseDate)))
                     .map((lot) => {
                        const m = metricsForLot(lot, quotesBySymbol[lot.symbol]);
                        return (
                           <tr key={lot.id}>
                              <td className="small">{lot.purchaseDate}</td>
                              <td className="small">{lot.broker}</td>
                              <td>
                                 <button
                                    type="button"
                                    className="btn btn-link btn-sm p-0"
                                    onClick={() => onSelectSymbol(lot.symbol)}
                                 >
                                    {lot.symbol}
                                 </button>
                              </td>
                              <td>{m.quantity.toLocaleString("it-IT")}</td>
                              <td>{formatMoney(m.avgPrice, m.currency)}</td>
                              <td>{formatMoney(m.cost, m.currency)}</td>
                              <td>
                                 <PlBadge
                                    pct={m.plPercent}
                                    amount={m.plAmount}
                                    currency={m.currency}
                                 />
                              </td>
                              <td>
                                 <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    title="Elimina operazione"
                                    onClick={() => onRemoveLot(lot.id)}
                                 >
                                    <i className="bi bi-trash" aria-hidden />
                                 </button>
                              </td>
                           </tr>
                        );
                     })}
               </tbody>
            </table>
         </div>
      </>
   );
}

export default PortfolioSummary;
