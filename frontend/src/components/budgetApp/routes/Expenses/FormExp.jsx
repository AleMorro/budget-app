import React, { useState } from 'react'
// import components
import Form from './Form.jsx';

// function to render the inside of the Cards
function FormExp() {

   return (
      <div className='card'>
         <div className="card-body">
            <h5 className="card-title">
               Add expenses
            </h5>

            <Form />
         </div>

      </div>
      
   )
}

export default FormExp