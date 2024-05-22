import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts';

import { useGlobalContext } from '../../../../context/globalContext';
import { useCallback } from 'react';

// Idea per renderizzare i dati giusti nel grafico: 
// passare tre array in base al filtro e ritirati dal backend in Reports
// Vedere se passare i valori come parametri o come props
function ReportCharts({ filter }) {

   const { incomesByFiltered, expensesByFiltered, balanceByFilter, loading } = useGlobalContext();

   const[chartData, setChartData] = useState({

      series: [
         { name: 'Incomes', data: [] },
         { name: 'Expenses', data: [] },
         { name: 'Balance', data: [] },
      ],
      options: {
         chart: {
            height: 350,
            type: 'area',
            toolbar: {
               show: true
            },
         },
         markers: {
            size: 4,
         },
         colors: ['#4154f1', '#2eca6a', '#ff771d'],
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

   const fetchDataByFilter = useCallback(() => {
      if (loading) return;

      let categories = [];
      let incomeData = [];
      let expenseData = [];
      let balanceData = [];

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

      const filteredIncomes = incomesByFiltered(filter, targetValue);
      const filteredExpenses = expensesByFiltered(filter, targetValue);
      const filteredBalance = balanceByFilter(filter, targetValue);

      filteredIncomes.forEach(income => {
         //categories.push(income.date);
         incomeData.push(income.amount);
      });

      filteredExpenses.forEach(expense => {
         categories.push(expense.date)
         expenseData.push(expense.amount);
      });
      /*
      filteredBalance.forEach(balance => {
         balanceData.push(balance.amount);
      });
      */

      setChartData({
         ...chartData,
         series: [
            { name: 'Incomes', data: incomeData },
            { name: 'Expenses', data: expenseData },
            { name: 'Balance', data: balanceData },
         ],
         options: {
            ...chartData.options,
            xaxis: { ...chartData.options.xaxis, categories }
         },
      });
   }, [filter, incomesByFiltered, expensesByFiltered, balanceByFilter, loading]);

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