import React, { useState } from 'react'
// import components
import CardFilter from './CardFilter'
import ReportCharts from './ReportCharts';

function Reports() {

   const [filter, setFilter] = useState('This Week')

   const handleFilterChange = filter => {
      setFilter(filter)
   };

   return (
      <div className="card overflow-auto">
         <CardFilter filterChange={handleFilterChange} />
         <div className="card-body">
            <h5 className="card-title">
               Reports <span>/{filter}</span>
            </h5>
            <ReportCharts filter={filter}/>
         </div>
      </div>
   )
}

export default Reports