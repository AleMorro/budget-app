import React, { useState } from "react";

import { useGlobalContext } from "../../../../context/globalContext";
import { DEFAULT_EXPENSE_CATEGORIES } from "../../../../lib/appConstants";
import FormCategorySelect from "../common/FormCategorySelect";
import FormWalletSelect from "../common/FormWalletSelect";

function Form() {
   const { addExpense, loggedUser, loading, defaultWalletId } = useGlobalContext();
   const [category, setCategory] = useState("");
   const [date, setDate] = useState("");
   const [amount, setAmount] = useState(0);
   const [description, setDescription] = useState("");
   const [walletId, setWalletId] = useState(defaultWalletId);

   const handleFormSubmit = (e) => {
      e.preventDefault();
      const user_id = loggedUser.user_id;

      const expense = {
         user_id,
         category,
         date,
         amount: parseFloat(amount),
         description,
         walletId,
      };

      addExpense(expense);
      setCategory("");
      setDate("");
      setAmount(0);
      setDescription("");
      setWalletId(defaultWalletId);
   };

   return (
      <form className="row g-3 needs-validation" noValidate onSubmit={handleFormSubmit}>
         <div className="col-md-3">
            <label htmlFor="exp-cat" className="form-label">
               Categoria
            </label>
            <FormCategorySelect
               kind="expense"
               categories={DEFAULT_EXPENSE_CATEGORIES}
               id="exp-cat"
               value={category}
               onChange={setCategory}
               required
            />
         </div>
         <div className="col-md-2">
            <label htmlFor="exp-wallet" className="form-label">
               Wallet
            </label>
            <FormWalletSelect id="exp-wallet" value={walletId} onChange={setWalletId} />
         </div>
         <div className="col-md-2">
            <label htmlFor="exp-date" className="form-label">
               Data
            </label>
            <input
               type="date"
               className="form-control"
               id="exp-date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               required
            />
         </div>
         <div className="col-md-2">
            <label htmlFor="exp-amount" className="form-label">
               Importo
            </label>
            <div className="input-group">
               <span className="input-group-text">€</span>
               <input
                  type="number"
                  className="form-control"
                  id="exp-amount"
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
            <label htmlFor="exp-desc" className="form-label">
               Descrizione
            </label>
            <textarea
               className="form-control"
               id="exp-desc"
               rows={2}
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            />
         </div>

         <div className="col-12">
            <button className="btn btn-primary" type="submit" disabled={loading}>
               Aggiungi spesa
            </button>
         </div>
      </form>
   );
}

export default Form;
