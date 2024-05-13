import React, { useEffect, useState } from 'react'

import { GlobalProvider, useGlobalContext } from '../../../../context/globalContext';

import CardFilter from './CardFilter';

import '../../styles/Card.css'

function Card( {card} ) {

   const { getIncomes, totalIncomes, incomesByFilter,
           getExpenses, totalExpenses,
           totalBalance } = useGlobalContext()
   
   const [filter, setFilter] = useState("Today");

   const handleFilterChange = filter => {
      setFilter(filter);
      if(filter === 'Today') {
         console.log("Fetch")
         getIncomes(1)
            .then(getExpenses(1))
            .catch(error => {
               console.error('Error fetching incomes: ', error)
            })
      }
      else if(filter === 'This Month') {
         // to implement filter function
      }
      else {
         // to implement filter function
      }
   }

   const renderData = () => {
      switch (card.name) {
         case 'Incomes':
            return '$' + incomesByFilter('today').toLocaleString('en-US');
         case 'Expenses':
            return '$' + totalExpenses().toLocaleString('en-US');
         case 'Balance':
            return '$' + 1200; // Assuming data is the balance
         default:
            return 'Nulla';
      }
   };


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
               {renderData()} 
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