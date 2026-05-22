import React, { useState } from "react";
import { getDefaultBrokers } from "../../../../lib/portfolioStore";

const BROKERS = getDefaultBrokers();

function PortfolioPositionForm({ onAdd }) {
   const [symbol, setSymbol] = useState("");
   const [broker, setBroker] = useState(BROKERS[0]);
   const [brokerCustom, setBrokerCustom] = useState("");
   const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().slice(0, 10));
   const [purchasePrice, setPurchasePrice] = useState("");
   const [quantity, setQuantity] = useState("");
   const [notes, setNotes] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      const sym = symbol.trim().toUpperCase();
      if (!sym || !purchasePrice || !quantity) return;

      const resolvedBroker =
         broker === "Altro" ? brokerCustom.trim() || "Altro" : broker;

      onAdd({
         symbol: sym,
         broker: resolvedBroker,
         purchaseDate,
         purchasePrice: parseFloat(purchasePrice),
         quantity: parseFloat(quantity),
         notes: notes.trim(),
      });

      setSymbol("");
      setPurchasePrice("");
      setQuantity("");
      setNotes("");
   };

   return (
      <form onSubmit={handleSubmit} className="row g-2">
         <div className="col-12 col-md-6">
            <label className="form-label small">Simbolo</label>
            <input
               className="form-control form-control-sm"
               placeholder="ENI.MI, AAPL…"
               value={symbol}
               onChange={(e) => setSymbol(e.target.value)}
               maxLength={24}
               required
            />
         </div>
         <div className="col-12 col-md-6">
            <label className="form-label small">Broker</label>
            <select
               className="form-select form-select-sm"
               value={broker}
               onChange={(e) => setBroker(e.target.value)}
            >
               {BROKERS.map((b) => (
                  <option key={b} value={b}>
                     {b}
                  </option>
               ))}
            </select>
            {broker === "Altro" && (
               <input
                  className="form-control form-control-sm mt-1"
                  placeholder="Nome broker"
                  value={brokerCustom}
                  onChange={(e) => setBrokerCustom(e.target.value)}
               />
            )}
         </div>
         <div className="col-6 col-md-4">
            <label className="form-label small">Data acquisto</label>
            <input
               type="date"
               className="form-control form-control-sm"
               value={purchaseDate}
               onChange={(e) => setPurchaseDate(e.target.value)}
               required
            />
         </div>
         <div className="col-6 col-md-4">
            <label className="form-label small">Prezzo acquisto</label>
            <input
               type="number"
               step="0.0001"
               min="0"
               className="form-control form-control-sm"
               placeholder="0.00"
               value={purchasePrice}
               onChange={(e) => setPurchasePrice(e.target.value)}
               required
            />
         </div>
         <div className="col-12 col-md-4">
            <label className="form-label small">Quantità (azioni)</label>
            <input
               type="number"
               step="0.0001"
               min="0.0001"
               className="form-control form-control-sm"
               placeholder="es. 50"
               value={quantity}
               onChange={(e) => setQuantity(e.target.value)}
               required
            />
         </div>
         <div className="col-12">
            <label className="form-label small">Note (opzionale)</label>
            <input
               className="form-control form-control-sm"
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
            />
         </div>
         <div className="col-12">
            <button type="submit" className="btn btn-primary btn-sm w-100">
               Registra acquisto
            </button>
         </div>
      </form>
   );
}

export default PortfolioPositionForm;
