import React, { useEffect, useState, useCallback } from 'react'
import Chart from 'react-apexcharts'

import { useGlobalContext } from '../../../../context/globalContext';

import { getISOWeek } from 'date-fns';

/**
 * Function to render the pie graph based on the incomes and expenses filtered by the CardFilter
 */
function PieCharts( { filter }) {

   const { totalIncomesFiltered, totalExpensesFiltered, loading } = useGlobalContext();
   // to set the setting of the chart
   const[pieData, setPieData] = useState({

      options: {
         chart: {
           height: 358,
           type: 'pie',
         },
         labels: ['Incomes', 'Expenses'],
         legend: {
           position: 'top',
         },
         tooltip: {
           enabled: true,
         },
         dataLabels: {
           enabled: false,
         },
         colors: ['#4154f1', '#b83941',]
       },
       series: [200, 2000],
   });

   // to fetch the values based on the filter
   const fetchDataByFilter = useCallback(() => {
      if (loading) return;

      let targetValue;
      const today = new Date();

      switch (filter) {
         case 'This Week':
            targetValue = getISOWeek(today);
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

      const totalIncomes = totalIncomesFiltered(filter, targetValue);
      const totalExpenses = totalExpensesFiltered(filter, targetValue);

      // setting the new data
      setPieData({
         series: [totalIncomes, totalExpenses],
         options: {
            ...pieData.options
         }
      });
   }, [filter, totalIncomesFiltered, totalExpensesFiltered, loading]);
   
   // hook to refresh things on mount
   useEffect(() => {
      fetchDataByFilter();
   }, [fetchDataByFilter]);
   
   return (
      <Chart
         options={pieData.options}
         series={pieData.series}
         type={pieData.options.chart.type}
         height={pieData.options.chart.height}
      />
   )
}

export default PieCharts