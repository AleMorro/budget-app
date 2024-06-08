import React, { useState } from 'react'
import CardFilter from '../Home/CardFilter'
import Form from './Form.jsx';

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