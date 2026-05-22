import React, { useMemo } from "react";
import { useGlobalContext } from "../../../../context/globalContext";
import { filterByYearMonth } from "../../utils/filterByYearMonth";
import { txKey, DEFAULT_WALLET_ID } from "../../../../lib/localFinanceStore";

function HomeWalletSummary({ year, monthIndex, loading, periodLabel }) {
   const { wallets, incomes, expenses, txWalletMap } = useGlobalContext();

   const rows = useMemo(() => {
      const inc = filterByYearMonth(incomes, year, monthIndex);
      const exp = filterByYearMonth(expenses, year, monthIndex);

      const agg = {};
      wallets.forEach((w) => {
         agg[w.id] = { inflow: 0, outflow: 0 };
      });

      inc.forEach((row) => {
         const wid = txWalletMap[txKey("i", row.id)] ?? DEFAULT_WALLET_ID;
         if (!agg[wid]) agg[wid] = { inflow: 0, outflow: 0 };
         agg[wid].inflow += Number(row.amount) || 0;
      });

      exp.forEach((row) => {
         const wid = txWalletMap[txKey("e", row.id)] ?? DEFAULT_WALLET_ID;
         if (!agg[wid]) agg[wid] = { inflow: 0, outflow: 0 };
         agg[wid].outflow += Number(row.amount) || 0;
      });

      return wallets.map((w) => {
         const a = agg[w.id] || { inflow: 0, outflow: 0 };
         return {
            id: w.id,
            name: w.name,
            color: w.color,
            inflow: a.inflow,
            outflow: a.outflow,
            net: a.inflow - a.outflow,
         };
      });
   }, [wallets, incomes, expenses, year, monthIndex, txWalletMap]);

   if (loading) {
      return (
         <div className="card mb-3">
            <div className="card-body">
               <p className="text-muted small mb-0">Caricamento…</p>
            </div>
         </div>
      );
   }

   return (
      <div className="card mb-3">
         <div className="card-body">
            <h5 className="card-title">Movimenti per wallet — {periodLabel}</h5>
            <p className="text-muted small">
               Flussi nel periodo. I movimenti senza wallet dedicato sono conteggiati sul wallet
               predefinito (Main Account).
            </p>
            <div className="table-responsive">
               <table className="table table-sm align-middle mb-0">
                  <thead>
                     <tr>
                        <th>Wallet</th>
                        <th>Entrate</th>
                        <th>Uscite</th>
                        <th>Netto periodo</th>
                     </tr>
                  </thead>
                  <tbody>
                     {rows.map((r) => (
                        <tr key={r.id}>
                           <td>
                              <span
                                 className="rounded-circle d-inline-block border me-2 align-middle"
                                 style={{ width: 10, height: 10, background: r.color }}
                              />
                              {r.name}
                           </td>
                           <td className="text-success">
                              € {r.inflow.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                           </td>
                           <td className="text-danger">
                              € {r.outflow.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                           </td>
                           <td className={r.net >= 0 ? "text-primary" : "text-warning"}>
                              € {r.net.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}

export default HomeWalletSummary;
