import React, { useState } from 'react'
import CardFilter from '../Home/CardFilter'

function Recent() {

   const [filter, setFilter] = useState('Today')
   const handleFilterChange = filter => {
      setFilter(filter)
   };

   return (
      <div className='card'>
         <CardFilter filterChange={handleFilterChange}/>
         <div className="card-body">
            <h5 className="card-title">
               Recent incomes <span>/{filter}</span>
            </h5>
         </div>

      </div>
      
   )
}

export default Recent