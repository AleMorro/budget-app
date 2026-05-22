import React, { useState } from "react";

import { useGlobalContext } from "../../../../context/globalContext";
import { DEFAULT_INCOME_CATEGORIES } from "../../../../lib/appConstants";
import FormCategorySelect from "../common/FormCategorySelect";
import FormWalletSelect from "../common/FormWalletSelect";

function Form() {
   const { addIncome, loggedUser, loading, defaultWalletId } = useGlobalContext();
   const [category, setCategory] = useState("");
   const [date, setDate] = useState("");
   const [amount, setAmount] = useState("");
   const [description, setDescription] = useState("");
   const [walletId, setWalletId] = useState(defaultWalletId);

   const handleFormSubmit = (e) => {
      e.preventDefault();
      const user_id = loggedUser.user_id;

      const income = {
         user_id,
         category,
         date,
         amount: parseFloat(amount),
         description,
         walletId,
      };

      addIncome(income);
      setCategory("");
      setDate("");
      setAmount("");
      setDescription("");
      setWalletId(defaultWalletId);
   };

   return (
      <form className="row g-3 needs-validation" noValidate onSubmit={handleFormSubmit}>
         <div className="col-md-3">
            <label htmlFor="inc-cat" className="form-label">
               Categoria
            </label>
            <FormCategorySelect
               kind="income"
               categories={DEFAULT_INCOME_CATEGORIES}
               id="inc-cat"
               value={category}
               onChange={setCategory}
               required
            />
         </div>
         <div className="col-md-2">
            <label htmlFor="inc-wallet" className="form-label">
               Wallet
            </label>
            <FormWalletSelect id="inc-wallet" value={walletId} onChange={setWalletId} />
         </div>
         <div className="col-md-2">
            <label htmlFor="inc-date" className="form-label">
               Data
            </label>
            <input
               type="date"
               className="form-control"
               id="inc-date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               required
            />
         </div>
         <div className="col-md-2">
            <label htmlFor="inc-amount" className="form-label">
               Importo
            </label>
            <div className="input-group">
               <span className="input-group-text">€</span>
               <input
                  type="number"
                  className="form-control"
                  id="inc-amount"
                  step="0.01"
                  placeholder="0.00"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
               />
            </div>
         </div>
         <div className="col-md-12">
            <label htmlFor="inc-desc" className="form-label">
               Descrizione
            </label>
            <textarea
               className="form-control"
               id="inc-desc"
               rows={2}
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            />
         </div>

         <div className="col-12">
            <button className="btn btn-primary" type="submit" disabled={loading}>
               Aggiungi entrata
            </button>
         </div>
      </form>
   );
}

export default Form;
