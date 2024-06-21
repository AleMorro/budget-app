import React, { useEffect, useState, useRef } from 'react'

import { useGlobalContext } from '../../../../context/globalContext';

function Form() {

   const { addExpense, loggedUser, loading } = useGlobalContext();

   const [category, setCategory] = useState('');
   const [date, setDate] = useState('');
   const [amount, setAmount] = useState(0);
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
         setAmount(0);
         setDescription('');
         setError(null);
      } catch (err) {
         setError("Failed to add expense. Please try again.");
      }
   };

   return (
   
      <form className="row g-3 needs-validation" noValidate onSubmit={handleFormSubmit}>
         <div className="col-md-4">
            <label for="validationCustom04" className="form-label">Category</label>
            <select 
               className="form-select" id="validationCustom04" 
               value={category} onChange={(e) => setCategory(e.target.value)}
               required
            >
               <option selected disabled defaultValue="">Choose...</option>
               <option>Food</option>
               <option>Shopping</option>
               <option>Gifts</option>
               <option>Entertainment</option>
               <option>Transport</option>
               <option>Home</option>
               <option>Vices</option>
               <option>Other</option>
            </select>
         </div>
         <div className="col-md-4">
            <label for="validationCustom01" className="form-label">Date</label>
            <input 
               type="date" className="form-control" id="validationCustom01" 
               value={date} onChange={(e) => setDate(e.target.value)} required
            />
         </div>
         <div className="col-md-4">
            <label for="validationCustomUsername" className="form-label">Amount</label>
            <div className="input-group has-validation">
               <span className="input-group-text" id="inputGroupPrepend">$</span>
               <input 
                  type="number" className="form-control" id="validationCustomUsername" 
                  aria-describedby="inputGroupPrepend" step="0.01" placeholder='00,00' 
                  min={0} value={amount} onChange={(e) => setAmount(e.target.value)} required
               />
            </div>
         </div>
         <div className="input-group">
            <span className="input-group-text">Description</span>
            <textarea 
               className="form-control" aria-label="With textarea"
               value={description} onChange={(e) => setDescription(e.target.value)}
            ></textarea>
         </div>
         
         <div className="col-12">
            <button className="btn btn-primary" type="submit" disabled={loading}>
               Submit form
            </button>
         </div>
      </form>
   )
}

export default Form