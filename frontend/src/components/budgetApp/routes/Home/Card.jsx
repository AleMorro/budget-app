import React, { useState } from 'react'

import { useGlobalContext } from '../../../../context/globalContext';

import CardFilter from './CardFilter';

import '../../styles/Card.css'

function Card( {card} ) {

   const { getIncomes, totalIncomes, totalBalance } = useGlobalContext()
   
   const [filter, setFilter] = useState("Today");

   const handleFilterChange = filter => {
      setFilter(filter);
      if(filter === 'Today') {
         getIncomes(1)
            .then(totalIncomes())
            .catch(error => {
               console.error('Error fetching incomes: ', error)
            })
      }
      else if(filter === 'This Month') {

      }
      else {

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
               {card.name === 'Incomes'
                  ? '$' + totalIncomes().toLocaleString('en-US')
                  : 1200.0.toLocaleString('en-US')}
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