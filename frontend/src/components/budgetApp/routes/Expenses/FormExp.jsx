import React, { useState } from 'react'
import CardFilter from '../Home/CardFilter'

function FormExp() {

   const [filter, setFilter] = useState('Today')
   const handleFilterChange = filter => {
      setFilter(filter)
   };

   return (
      <div className='card'>
         <div className="card-body">
            <h5 className="card-title">
               Add expenses
            </h5>
         </div>

      </div>
      
   )
}

export default FormExp