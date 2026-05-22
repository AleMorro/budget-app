import React, { useEffect, useState, useCallback, useMemo } from "react";
import Chart from "react-apexcharts";

import { useGlobalContext } from "../../../../context/globalContext";
import { filterByYearMonth } from "../../utils/filterByYearMonth";

const defaultOptions = {
   chart: {
      height: 350,
      type: "area",
      toolbar: {
         show: false,
      },
   },
   markers: {
      size: 4,
   },
   colors: ["#4154f1", "#b83941"],
   fill: {
      type: "gradient",
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
      curve: "smooth",
      width: 2,
   },
   xaxis: {
      type: "datetime",
      categories: [],
   },
   tooltip: {
      x: {
         format: "dd/MM/yy",
      },
   },
};

function ReportCharts({ year, monthIndex, loading }) {
   const { incomes, expenses } = useGlobalContext();

   const filteredIncomes = useMemo(
      () => filterByYearMonth(incomes, year, monthIndex),
      [incomes, year, monthIndex]
   );
   const filteredExpenses = useMemo(
      () => filterByYearMonth(expenses, year, monthIndex),
      [expenses, year, monthIndex]
   );

   const [chartData, setChartData] = useState({
      series: [
         { name: "Incomes", data: [] },
         { name: "Expenses", data: [] },
      ],
      options: defaultOptions,
   });

   const fetchDataByFilter = useCallback(() => {
      if (loading) return;

      let incomeData = [];
      let expenseData = [];
      const incomeCategories = [];
      const expenseCategories = [];

      filteredIncomes.forEach((income) => {
         const date = new Date(income.date);
         incomeData.push({ x: date, y: income.amount });
         incomeCategories.push(date);
      });

      filteredExpenses.forEach((expense) => {
         const date = new Date(expense.date);
         expenseData.push({ x: date, y: expense.amount });
         expenseCategories.push(date);
      });

      incomeCategories.sort((a, b) => a - b);
      expenseCategories.sort((a, b) => a - b);

      setChartData((prev) => ({
         series: [
            { name: "Incomes", data: incomeData },
            { name: "Expenses", data: expenseData },
         ],
         options: {
            ...prev.options,
            xaxis: {
               ...prev.options.xaxis,
               categories: [...new Set([...incomeCategories, ...expenseCategories])],
            },
         },
      }));
   }, [filteredIncomes, filteredExpenses, loading]);

   useEffect(() => {
      fetchDataByFilter();
   }, [fetchDataByFilter]);

   if (loading) {
      return <p className="text-muted small mb-0">Caricamento…</p>;
   }

   if (!filteredIncomes.length && !filteredExpenses.length) {
      return (
         <p className="text-muted small mb-0">Nessun movimento nel periodo selezionato.</p>
      );
   }

   return (
      <Chart
         options={chartData.options}
         series={chartData.series}
         type={chartData.options.chart.type}
         height={chartData.options.chart.height}
      />
   );
}

export default ReportCharts;
