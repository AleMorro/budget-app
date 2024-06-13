import React, { useCallback, useEffect, useState } from 'react'

import { useGlobalContext } from '../../../../context/globalContext';

import CardFilter from './CardFilter';

import '../../styles/Card.css'

function Card( {card} ) {

   const { loading, totalIncomesFiltered, totalExpensesFiltered } = useGlobalContext()
   
   const [filter, setFilter] = useState("This Week");
   const [renderedData, setRenderedData] = useState(null);
   const [renderedTrend, setRenderedTrend] = useState(0)

   /**
    * Function to handle the fetch of data by the filter
    * @param {*} filter 
    */
   const handleFilterChange = useCallback((filter)  => {

      try {
         setFilter(filter);
         let incomeData
         let expenseData
         let previousIncData
         let previousExpData

         let targetValue
         const today = new Date();

         switch (filter) {
            case 'This Week':
               targetValue = today.getDate();
               break;
            case 'This Month':
               targetValue = today.getMonth();
               break;
            case 'This Year':
               targetValue = today.getFullYear();
               break;
            default:
               targetValue = today.getDate();
         }

         incomeData = totalIncomesFiltered(filter, targetValue)
         previousIncData = totalIncomesFiltered(filter, targetValue - 1)

         expenseData = totalExpensesFiltered(filter, targetValue)
         previousExpData = totalExpensesFiltered(filter, targetValue - 1)

         let balanceData = incomeData - expenseData
         let previousBalData = previousIncData - previousExpData

         let trend = 0

         if (card.name === 'Incomes') {
            setRenderedData(incomeData.toLocaleString('en-US'))
            trend = (incomeData / previousIncData) - 1
         } else if(card.name === 'Expenses') {
            setRenderedData(expenseData.toLocaleString('en-US'))
            trend = (expenseData / previousExpData) - 1
         } else {
            setRenderedData(balanceData.toLocaleString('en-US'))
            trend = (balanceData / previousBalData) - 1
         }

         if(trend === Infinity) setRenderedTrend(1)
         else if(trend === -Infinity) setRenderedTrend(-1)
         else if(isNaN(trend)) setRenderedTrend(0)
         else setRenderedTrend(trend.toPrecision(2))

      } catch(err) {
         console.error("Error fetching data: ", err)
      }
   }, [totalExpensesFiltered, totalIncomesFiltered]);

   // Function to render the correct label for trend
   const renderText = () => {
      if(card.name === 'Expenses') {
         return renderedTrend > 0 ? 'increase' : 'decrease'
      }
      else {
         return renderedTrend > 0 ? 'increase' : 'decrease' 
      }
   }
   // Function ro render the correct color for the trend
   const renderColor = () => {
      if(card.name === 'Expenses') {
         return renderedTrend > 0 ? 'text-danger': 'text-success'
      }
      else {
         return renderedTrend > 0 ? 'text-success' : 'text-danger' 
      }
   }

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
               {'€ ' + renderedData} 
            </h6> 
            
            <span
               className={`${renderColor()} small pt-1 fw-bold`}
            >
               {renderedTrend > 0
                  ? Math.round(renderedTrend * 100)
                  : Math.round(renderedTrend * 100)}
               %
            </span>
            <span className="text-muted small pt-2 ps-1">
               {renderText()}
            </span>
           </div>
         </div>
       </div>
      </div>
      </div>
   )
};

export default Card