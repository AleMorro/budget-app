import React, { useEffect, useState, useRef } from 'react'

import { useGlobalContext } from '../../../../context/globalContext';

function Form() {

   const { addExpense, loggedUser, loading } = useGlobalContext();

   const [category, setCategory] = useState('');
   const [date, setDate] = useState('');
   const [amount, setAmount] = useState(null);
   const [description, setDescription] = useState('');
   const [error, setError] = useState(null);

   const handleFormSubmit = (e) => {

      console.log("Submit handle Expense")
      e.preventDefault()
      const user_id = loggedUser.user_id

      const expense = {
          user_id: user_id,
          category,
          date,
          amount: parseFloat(amount),
          description
      };

      try {
         addExpense(expense);
         setCategory('');
         setDate('');
         setAmount('');
         setDescription('');
         setError(null);
      } catch (err) {
         setError("Failed to add expense. Please try again.");
      }
   };

   return (
   
      <form class="row g-3 needs-validation" novalidate onSubmit={handleFormSubmit}>
         <div class="col-md-4">
            <label for="validationCustom04" class="form-label">Category</label>
            <select 
               className="form-select" id="validationCustom04" 
               value={category} onChange={(e) => setCategory(e.target.value)}
               required
            >
               <option selected disabled value="">Choose...</option>
               <option>Food</option>
               <option>Shopping</option>
               <option>Gifts</option>
               <option>Entertainment</option>
               <option>Transport</option>
               <option>Home</option>
               <option>Vices</option>
               <option>Other</option>
            </select>
            <div class="invalid-feedback">
               Please select a valid state.
            </div>
         </div>
         <div class="col-md-4">
            <label for="validationCustom01" class="form-label">Date</label>
            <input 
               type="date" class="form-control" id="validationCustom01" 
               value={date} onChange={(e) => setDate(e.target.value)} required
            />
            <div class="valid-feedback">
               Looks good!
            </div>
         </div>
         <div class="col-md-4">
            <label for="validationCustomUsername" class="form-label">Amount</label>
            <div class="input-group has-validation">
               <span class="input-group-text" id="inputGroupPrepend">$</span>
               <input 
                  type="number" class="form-control" id="validationCustomUsername" 
                  aria-describedby="inputGroupPrepend" step="0.01" placeholder='00,00' 
                  min={0} value={amount} onChange={(e) => setAmount(e.target.value)} required
               />
               <div class="invalid-feedback">
                  Please choose an amount
               </div>
            </div>
         </div>
         <div class="input-group">
            <span class="input-group-text">Description</span>
            <textarea 
               class="form-control" aria-label="With textarea"
               value={description} onChange={(e) => setDescription(e.target.value)}
            ></textarea>
         </div>
         
         <div class="col-12">
            <button class="btn btn-primary" type="submit" disabled={loading}>
               Submit form
            </button>
         </div>
      </form>
   )
}

export default Form