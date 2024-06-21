import React, { useEffect, useState, useCallback } from 'react'
// import for rendering charts of the library
import Chart from 'react-apexcharts';

import { useGlobalContext } from '../../../../context/globalContext';

import { getISOWeek } from 'date-fns';

/**
 * Function to render the graph based on the incomes and expenses filtered by the CardFilter
 */
function ReportCharts({ filter }) {

   const { incomesByFiltered, expensesByFiltered, loading } = useGlobalContext();
   // to set the setting of the chart
   const[chartData, setChartData] = useState({

      series: [
         { name: 'Incomes', data: [] },
         { name: 'Expenses', data: [] }
      ],
      options: {
         chart: {
            height: 350,
            type: 'area',
            toolbar: {
               show: false
            },
         },
         markers: {
            size: 4,
         },
         colors: ['#4154f1', '#b83941'],
         fill: {
            type: 'gradient',
            gradient: {
               shadeIntensity: 1,
               opacityFrom: 0.3,
               opacityTo: 0.4,
               stops: [0, 90, 100],
            },
         },
         dataLabels: {
            enabled: false,
         },
         stroke: {
            curver: 'smooth',
            width: 2,
         },
         xaxis: {
            type: 'datetime',
            categories: [],
         },
         tooltip: {
            x: {
               format: 'dd/MM/yy'
            },
         },
      },
   })

   // to fetch the values based on the filter
   const fetchDataByFilter = useCallback(() => {
      if (loading) return;

      let incomeData = [];
      let expenseData = [];

      let incomeCategories = [];
      let expenseCategories = [];

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

      const filteredIncomes = incomesByFiltered(filter, targetValue);
      const filteredExpenses = expensesByFiltered(filter, targetValue);

      filteredIncomes.forEach(income => {
         const date = new Date(income.date);
         incomeData.push({ x: date, y: income.amount });
         incomeCategories.push(date);
      });

      filteredExpenses.forEach(expense => {
         const date = new Date(expense.date);
         expenseData.push({ x: date, y: expense.amount });
         expenseCategories.push(date);
      });

      // sort date for series
      incomeCategories.sort((a, b) => a - b);
      expenseCategories.sort((a, b) => a - b);

      // setting the new data
      setChartData({
         series: [
            { name: 'Incomes', data: incomeData },
            { name: 'Expenses', data: expenseData }
         ],
         options: {
            ...chartData.options,
            xaxis: { 
               ...chartData.options.xaxis, 
               categories: [...new Set([...incomeCategories, ...expenseCategories])],
            },
         },
      });
   }, [filter, incomesByFiltered, expensesByFiltered, loading]);

   // hook to refresh things on mount
   useEffect(() => {
      fetchDataByFilter();
   }, [fetchDataByFilter]);

   return (
      <Chart 
         options={chartData.options}
         series={chartData.series}
         type={chartData.options.chart.type}
         height={chartData.options.chart.height}
      />
   )
}

export default ReportCharts
