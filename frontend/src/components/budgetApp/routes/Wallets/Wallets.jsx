import React, { useMemo, useState } from "react";
import PageTitle from "../PageTitle";
import Footer from "../../Footer";
import { useGlobalContext } from "../../../../context/globalContext";
import { DEFAULT_WALLET_ID, computeWalletBalances } from "../../../../lib/localFinanceStore";
import "../../styles/Main.css";
import "../../styles/Dashboard.css";

function Wallets() {
   const { wallets, incomes, expenses, txWalletMap, addWallet, deleteWallet, updateWallet } =
      useGlobalContext();

   const walletsWithBalance = useMemo(
      () => computeWalletBalances(wallets, incomes, expenses, txWalletMap),
      [wallets, incomes, expenses, txWalletMap]
   );
   const [name, setName] = useState("");
   const [type, setType] = useState("Conto");
   const [initialBalance, setInitialBalance] = useState("");
   const [color, setColor] = useState("#4154f1");

   const handleAdd = (e) => {
      e.preventDefault();
      if (!name.trim()) return;
      addWallet({
         name: name.trim(),
         type: type.trim() || "Altro",
         initialBalance: parseFloat(initialBalance) || 0,
         color,
      });
      setName("");
      setType("Conto");
      setInitialBalance("");
      setColor("#4154f1");
   };

   return (
      <main id="main" className="main">
         <PageTitle page="Wallets" />

         <section className="dashboard section">
            <div className="row g-3">
               <div className="col-12 col-lg-5">
                  <div className="card h-100">
                     <div className="card-body">
                        <h5 className="card-title">Nuovo wallet</h5>
                        <form onSubmit={handleAdd} className="row g-2">
                           <div className="col-12">
                              <label className="form-label small">Nome</label>
                              <input
                                 className="form-control form-control-sm"
                                 value={name}
                                 onChange={(e) => setName(e.target.value)}
                                 required
                              />
                           </div>
                           <div className="col-12">
                              <label className="form-label small">Tipo</label>
                              <input
                                 className="form-control form-control-sm"
                                 value={type}
                                 onChange={(e) => setType(e.target.value)}
                              />
                           </div>
                           <div className="col-12">
                              <label className="form-label small">Saldo iniziale (€)</label>
                              <input
                                 type="number"
                                 step="0.01"
                                 className="form-control form-control-sm"
                                 value={initialBalance}
                                 onChange={(e) => setInitialBalance(e.target.value)}
                              />
                           </div>
                           <div className="col-12">
                              <label className="form-label small">Colore</label>
                              <input
                                 type="color"
                                 className="form-control form-control-color"
                                 value={color}
                                 onChange={(e) => setColor(e.target.value)}
                              />
                           </div>
                           <div className="col-12 mt-2">
                              <button type="submit" className="btn btn-primary btn-sm">
                                 Aggiungi wallet
                              </button>
                           </div>
                        </form>
                        <p className="text-muted small mt-3 mb-0">
                           Al primo avvio sono presenti conti di esempio. I wallet sono salvati solo in
                           questo browser.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="col-12 col-lg-7">
                  <div className="card">
                     <div className="card-body">
                        <h5 className="card-title">I tuoi wallet</h5>
                        <div className="table-responsive">
                           <table className="table table-sm align-middle">
                              <thead>
                                 <tr>
                                    <th />
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Saldo iniziale</th>
                                    <th>Saldo stimato</th>
                                    <th />
                                 </tr>
                              </thead>
                              <tbody>
                                 {walletsWithBalance.map((w) => (
                                    <tr key={w.id}>
                                       <td>
                                          <span
                                             className="rounded-circle d-inline-block border"
                                             style={{
                                                width: 14,
                                                height: 14,
                                                background: w.color || "#ccc",
                                             }}
                                          />
                                       </td>
                                       <td className="fw-medium">{w.name}</td>
                                       <td className="text-muted small">{w.type}</td>
                                       <td>
                                          <input
                                             type="number"
                                             step="0.01"
                                             className="form-control form-control-sm"
                                             style={{ maxWidth: 120 }}
                                             defaultValue={w.initialBalance}
                                             key={`bal-${w.id}-${w.initialBalance}`}
                                             onBlur={(e) =>
                                                updateWallet(w.id, {
                                                   initialBalance: parseFloat(e.target.value) || 0,
                                                })
                                             }
                                          />
                                       </td>
                                       <td
                                          className={
                                             w.balance >= 0 ? "text-primary fw-medium" : "text-warning fw-medium"
                                          }
                                       >
                                          €{" "}
                                          {w.balance.toLocaleString("it-IT", {
                                             minimumFractionDigits: 2,
                                          })}
                                       </td>
                                       <td>
                                          <button
                                             type="button"
                                             className="btn btn-outline-danger btn-sm"
                                             disabled={wallets.length <= 1 || w.id === DEFAULT_WALLET_ID}
                                             onClick={() => {
                                                if (
                                                   wallets.length > 1 &&
                                                   window.confirm(`Eliminare "${w.name}"?`)
                                                ) {
                                                   deleteWallet(w.id);
                                                }
                                             }}
                                          >
                                             Elimina
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}

export default Wallets;
