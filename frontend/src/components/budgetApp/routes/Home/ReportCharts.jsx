import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts';

import { useGlobalContext } from '../../../../context/globalContext';
import { useCallback } from 'react';

// Idea per renderizzare i dati giusti nel grafico: 
// passare tre array in base al filtro e ritirati dal backend in Reports
// Vedere se passare i valori come parametri o come props
function ReportCharts() {

   const[data, setData] = useState({

      series: [
         {
            name: 'Incomes',
            data: [],
         },
         {
            name: 'Expenses',
            data: [],
         },
         {
            name: 'Balance',
            data: [],
         },
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
            categories: [
               '2018-09-19',
               '2018-10-19',
               '2018-11-19',
               '2018-12-19',
               '2019-01-19',
               '2019-02-19',
               '2019-03-19',
            ],
         },
         tooltip: {
            x: {
               format: 'dd/MM/yy'
            },
         },
      },
   })

   return (
      <Chart 
         options={data.options}
         series={data.series}
         type={data.options.chart.type}
         height={data.options.chart.height}
      />
   )
}

export default ReportCharts