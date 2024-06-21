import React, { useState } from 'react'
// import components
import Form from './Form.jsx'

// function to render the inside of the Cards
function FormInc() {

   return (
      <div className='card'>
         <div className="card-body">
            <h5 className="card-title">
               Add incomes
            </h5>

            <Form />
         </div>

      </div>
      
   )
}

export default FormInc