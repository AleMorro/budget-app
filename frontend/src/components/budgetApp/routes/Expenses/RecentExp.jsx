import React, { useState, useEffect, Component } from 'react'
import CardFilter from '../Home/CardFilter'

/*
import SearchBar from '../../SearchBar'
import '../../styles/SearchBar.css'
*/

import { useGlobalContext } from '../../../../context/globalContext';
import RecentExpTab from './RecentExpTab';
import { getISOWeek, toDate } from 'date-fns';

function RecentExp() {

   const { expensesByFiltered, loading } = useGlobalContext();

   const [items, setItems] = useState([])
   const [filter, setFilter] = useState('This Week')

   const handleFilterChange = filter => {
      setFilter(filter)
   };

   const fetchDataByFilter = () => {

      console.log("fetch data for recentExpenses")

      // if (loading) return;

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

   useEffect(() => {
      if(!loading) {
         fetchDataByFilter()
      }
   }, [filter])

   return (
      <div className='card recent'>
         <CardFilter filterChange={handleFilterChange}/>

         <div className="card-body">
            <h5 className="card-title">
               Recent expenses <span>/{filter}</span>
            </h5>
            {/* Add the searchBar */}
            <RecentExpTab items={items}/>
         </div>

      </div>
   )
}

export default RecentExp