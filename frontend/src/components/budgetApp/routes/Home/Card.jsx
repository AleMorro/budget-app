import React, { useCallback, useEffect, useState } from 'react'

import { useGlobalContext } from '../../../../context/globalContext';

import CardFilter from './CardFilter';

import '../../styles/Card.css'

function Card( {card} ) {

   const { incomesByFilter, loading } = useGlobalContext()
   
   const [filter, setFilter] = useState("Today");
   const [renderedData, setRenderedData] = useState(null);

   /**
    * Function to handle the fetch of data by the filter
    * @param {*} filter 
    */
   const handleFilterChange = useCallback((filter)  => {

      try {
         setFilter(filter);
         let data

         switch(filter) {
            case 'Today':
               const currentDay = new Date().getDate()
               data = incomesByFilter('Today', currentDay)
               break;
            case 'This Month':
               const currentMonth = new Date().getMonth()
               data = incomesByFilter('This Month', currentMonth)
               break;
            case 'This Year':
               const currentYear = new Date().getFullYear()
               data = incomesByFilter('This Year', currentYear)
               break;
            default:
               throw new Error("Invalid filter provided: " + filter)
         }
         setRenderedData(data.toLocaleString('en-US'))
      } catch(err) {
         console.error("Error fetching data: ", err)
      }
   }, [incomesByFilter]);

   // Hook used to fetch data and rendered the correct data on mount
   useEffect(() => {
      if(!loading) {
         handleFilterChange(filter)
      }
   }, [loading, filter, handleFilterChange])

   return (
      <div className="col-xxl-4 col-md-4">
      <div className="card info-card sales-card">
         <CardFilter filterChange= {handleFilterChange} />
         <div className="card-body">
            <h5 className="card-title">
               {card.name} <span> | {filter}</span>
            </h5>
         
         <div className="d-flex align items-center">
            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
               <i className={card.icon}></i>
            </div>
         <div className="ps-3">
            <h6>
               {'$' + renderedData} 
            </h6> 
            
            <span
               className={`${
                  0.15 > 0 ? 'text-success': 'text-danger'
               } small pt-1 fw-bold`}
            >
               {0.15 > 0
                  ? 0.15 * 100
                  : 0.15 * 100}
               %
            </span>
            <span className="text-muted small pt-2 ps-1">
               {10 > 0 ? 'increase': 'decrease'}
            </span>
           </div>
         </div>
       </div>
      </div>
      </div>
   )
};

export default Card