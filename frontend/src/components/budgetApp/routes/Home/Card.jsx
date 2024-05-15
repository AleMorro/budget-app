import React, { useCallback, useEffect, useState } from 'react'

import { useGlobalContext } from '../../../../context/globalContext';

import CardFilter from './CardFilter';

import '../../styles/Card.css'

function Card( {card} ) {

   const { incomesByFilter, expensesByFilter, balanceByFilter, loading } = useGlobalContext()
   
   const [filter, setFilter] = useState("Today");
   const [renderedData, setRenderedData] = useState(null);
   const [renderedTrend, setRenderedTrend] = useState(0)

   /**
    * Function to handle the fetch of data by the filter
    * @param {*} filter 
    */
   const handleFilterChange = useCallback((filter)  => {

      try {
         setFilter(filter);
         let data
         let previousData

         if(card.name === 'Incomes') {
            switch(filter) {
               case 'Today':
                  data = incomesByFilter('Today', new Date().getDate())
                  previousData = incomesByFilter('Today', new Date().getDate() - 1)
                  break;
               case 'This Month':
                  data = incomesByFilter('This Month', new Date().getMonth())
                  previousData = incomesByFilter('This Month', new Date().getMonth() - 1)
                  break;
               case 'This Year':
                  data = incomesByFilter('This Year', new Date().getFullYear())
                  previousData = incomesByFilter('This Year', new Date().getFullYear() - 1)
                  break;
               default:
                  throw new Error("Invalid filter provided: " + filter)
            }
         } else if(card.name === 'Expenses') {
            switch(filter) {
               case 'Today': 
                  data = expensesByFilter('Today', new Date().getDate())
                  previousData = expensesByFilter('Today', new Date().getDate() - 1) 
                  break;
               case 'This Month': 
                  data = expensesByFilter('This Month', new Date().getMonth())
                  previousData = expensesByFilter('This Month', new Date().getMonth() - 1)
                  break;
               case 'This Year':
                  data = expensesByFilter('This Year', new Date().getFullYear())
                  previousData = expensesByFilter('This Year', new Date().getFullYear() - 1)
                  break;
               default:
                  throw new Error("Invalid filter provided: " + filter)
            }
         } else {
            switch(filter) {
               case 'Today':
                  const currentDay = new Date().getDate()
                  data = balanceByFilter('Today', currentDay)
                  previousData = balanceByFilter('Today', currentDay - 1)
                  break;
               case 'This Month':
                  data = balanceByFilter('This Month', new Date().getMonth())
                  previousData = balanceByFilter('This Month', new Date().getMonth() - 1)
                  break;
               case 'This Year':
                  data = balanceByFilter('This Year', new Date().getFullYear())
                  previousData = balanceByFilter('This Year', new Date().getFullYear() - 1)
                  break;
               default:
                  throw new Error("Invalid filter provided: " + filter)
            }
         }
         // set the value of the Card
         setRenderedData(data.toLocaleString('en-US'))

         // calculate and set the value of the trend
         // the trend is the increment or decrement in % beetween the current 
         // filter values and the old ones of the same filter
         let trend = (data / previousData) - 1

         if(trend == Infinity) setRenderedTrend(1)
         else if(card.name === 'Expenses') setRenderedTrend(trend.toFixed(2) * -1)
         else setRenderedTrend(trend.toFixed(2));

      } catch(err) {
         console.error("Error fetching data: ", err)
      }
   }, [incomesByFilter, expensesByFilter]);

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
                  renderedTrend > 0 ? 'text-success': 'text-danger'
               } small pt-1 fw-bold`}
            >
               {renderedTrend > 0
                  ? renderedTrend * 100
                  : renderedTrend * 100}
               %
            </span>
            <span className="text-muted small pt-2 ps-1">
               {renderedTrend > 0 ? 'increase': 'decrease'}
            </span>
           </div>
         </div>
       </div>
      </div>
      </div>
   )
};

export default Card