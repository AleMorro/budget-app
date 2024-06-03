import React, { useState, useEffect } from 'react'
import CardFilter from '../Home/CardFilter'
import RecentIncTab from './RecentIncTab';

import { useGlobalContext } from '../../../../context/globalContext';

function Recent() {

   const { incomesByFiltered, expensesByFiltered, loading } = useGlobalContext();

   const [items, setItems] = useState([])
   const [filter, setFilter] = useState('Today')
   const handleFilterChange = filter => {
      setFilter(filter)
   };

   const fetchDataByFilter = () => {
      /* connettere chiamata globalContext */
      /* .catch(e => console.log(e.message)) */
      console.log("fetch data for recentIncomes")

      if (loading) return;
      /*
      let incomeData = [];
      let expenseData = [];
      let balanceData = [];

      let incomeCategories = [];
      let expenseCategories = [];
      */

      let targetValue;
      const today = new Date();

      switch (filter) {
         case 'Today':
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

      setItems(incomesByFiltered(filter, targetValue))
   }

   useEffect(() => {
      fetchDataByFilter()
   }, [filter])

   return (
      <div className='card recent'>
         <CardFilter filterChange={handleFilterChange}/>

         <div className="card-body">
            <h5 className="card-title">
               Recent incomes <span>/{filter}</span>
            </h5>
            <RecentIncTab items={items}/>
         </div>

      </div>
      
   )
}

export default Recent