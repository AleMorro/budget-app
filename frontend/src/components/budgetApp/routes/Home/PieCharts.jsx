import React, { useState } from 'react'
import Chart from 'react-apexcharts'

import { useGlobalContext } from '../../../../context/globalContext';
import { useCallback, useEffect } from 'react';

function PieCharts( { filter }) {

   const { totalIncomesFiltered, totalExpensesFiltered, loading } = useGlobalContext();


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

   const fetchDataByFilter = useCallback(() => {
      if (loading) return;

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

      const totalIncomes = totalIncomesFiltered(filter, targetValue);
      const totalExpenses = totalExpensesFiltered(filter, targetValue);

      setPieData({
         series: [totalIncomes, totalExpenses],
         options: {
            ...pieData.options
         }
      });
   }, [filter, totalIncomesFiltered, totalExpensesFiltered, loading]);

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