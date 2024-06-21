import React, { useState, useEffect, Component } from 'react'
// import components
import CardFilter from '../Home/CardFilter'
import RecentExpTab from './RecentExpTab';
import SearchBar from '../SearchBar'

import { useGlobalContext } from '../../../../context/globalContext';
import { getISOWeek, toDate } from 'date-fns';

function RecentExp() {

   const { expensesByFiltered, loading, expenses, getExpenses } = useGlobalContext();
   // to save items filtered
   const [items, setItems] = useState([])
   const [filter, setFilter] = useState('This Week')

   const handleFilterChange = filter => {
      setFilter(filter)
   };

   const fetchDataByFilter = async() => {

      console.log("fetch data for recentExpenses")

      let targetValue;
      const today = new Date();

      switch (filter) {
         case 'This Week':
            targetValue = getISOWeek(today)
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

      setItems(expensesByFiltered(filter, targetValue))
   }

   // hook to refresh data on mount and when it fetch expenses from backend
   useEffect(() => {
      if(!loading) {
         fetchDataByFilter()
      }
   }, [getExpenses, filter])

   return (
      <div className='card recent'>
         <CardFilter filterChange={handleFilterChange}/>

         <div className="card-body">
            <h5 className="card-title">
               Recent expenses <span>/{filter}</span>
               <SearchBar />
            </h5>
            <RecentExpTab items={items}/>
         </div>

      </div>
   )
}

export default RecentExp