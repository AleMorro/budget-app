import React, { useState } from 'react'
import CardFilter from './CardFilter'
import PieCharts from './PieCharts';

function Pie() {

   const [filter, setFilter] = useState('This Week')
   const handleFilterChange = filter => {
      setFilter(filter)
   };

   return (
      <div className="card">
         <CardFilter filterChange={handleFilterChange} />
         <div className="card-body">
            <h5 className="card-title">
               Pie Chart <span>/{filter}</span>
            </h5>
            <PieCharts filter={filter}/>
         </div>
      </div>
   )
}

export default Pie