import React, { useEffect, useState, useRef } from 'react'

function Form() {

   useEffect(() => {
      console.log("UseEffect Form")
   }, [])

   return (
   
      <form class="row g-3 needs-validation" novalidate>
         <div class="col-md-4">
            <label for="validationCustom04" class="form-label">Category</label>
            <select class="form-select" id="validationCustom04" required>
               <option selected disabled value="">Choose...</option>
               <option>Salary</option>
               <option>Investment</option>
               <option>Crypto</option>
               <option>Food</option>
            </select>
            <div class="invalid-feedback">
               Please select a valid state.
            </div>
         </div>
         <div class="col-md-4">
            <label for="validationCustom01" class="form-label">Date</label>
            <input type="date" class="form-control" id="validationCustom01" required/>
            <div class="valid-feedback">
               Looks good!
            </div>
         </div>
         <div class="col-md-4">
            <label for="validationCustomUsername" class="form-label">Amount</label>
            <div class="input-group has-validation">
               <span class="input-group-text" id="inputGroupPrepend">$</span>
               <input type="number" class="form-control" id="validationCustomUsername" 
                aria-describedby="inputGroupPrepend" step="0.01" placeholder='00,00' 
                min={0} required/>
               <div class="invalid-feedback">
                  Please choose an amount
               </div>
            </div>
         </div>
         <div class="input-group">
            <span class="input-group-text">Description</span>
            <textarea class="form-control" aria-label="With textarea"></textarea>
         </div>
         
         <div class="col-12">
            <button class="btn btn-primary" type="submit">Submit form</button>
         </div>
      </form>
   )
}

export default Form