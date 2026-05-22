import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { useGlobalContext } from "../../../../context/globalContext";
import { filterByYearMonth } from "../../utils/filterByYearMonth";

function HomeCategoryComparison({ year, monthIndex, loading, periodLabel }) {
   const { incomes, expenses } = useGlobalContext();

   const { categories, incomeSeries, expenseSeries } = useMemo(() => {
      const inc = filterByYearMonth(incomes, year, monthIndex);
      const exp = filterByYearMonth(expenses, year, monthIndex);
      const catSet = new Set();
      inc.forEach((r) => catSet.add(r.category || "Other"));
      exp.forEach((r) => catSet.add(r.category || "Other"));
      const categories = Array.from(catSet).sort((a, b) => a.localeCompare(b));
      const incMap = {};
      const expMap = {};
      categories.forEach((c) => {
         incMap[c] = 0;
         expMap[c] = 0;
      });
      inc.forEach((r) => {
         const c = r.category || "Other";
         incMap[c] = (incMap[c] || 0) + Number(r.amount);
      });
      exp.forEach((r) => {
         const c = r.category || "Other";
         expMap[c] = (expMap[c] || 0) + Number(r.amount);
      });
      return {
         categories,
         incomeSeries: categories.map((c) => incMap[c] || 0),
         expenseSeries: categories.map((c) => expMap[c] || 0),
      };
   }, [incomes, expenses, year, monthIndex]);

   const options = useMemo(
      () => ({
         chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
         plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 } },
         dataLabels: { enabled: false },
         colors: ["#4154f1", "#b83941"],
         xaxis: { categories, labels: { rotate: -35, rotateAlways: categories.length > 6 } },
         legend: { position: "top" },
         tooltip: {
            y: {
               formatter: (val) =>
                  `€ ${Number(val).toLocaleString("it-IT", { minimumFractionDigits: 2 })}`,
            },
         },
         title: {
            text: `Entrate vs uscite per categoria — ${periodLabel}`,
            align: "left",
            style: { fontSize: "14px", fontWeight: 600 },
         },
      }),
      [categories, periodLabel]
   );

   const series = useMemo(
      () => [
         { name: "Entrate", data: incomeSeries },
         { name: "Uscite", data: expenseSeries },
      ],
      [incomeSeries, expenseSeries]
   );

   if (loading) {
      return (
         <div className="card mb-3">
            <div className="card-body">
               <p className="text-muted small mb-0">Caricamento…</p>
            </div>
         </div>
      );
   }

   if (!categories.length) {
      return (
         <div className="card mb-3">
            <div className="card-body">
               <h5 className="card-title">Confronto per categoria</h5>
               <p className="text-muted small mb-0">Nessun movimento nel periodo.</p>
            </div>
         </div>
      );
   }

   return (
      <div className="card mb-3">
         <div className="card-body">
            <Chart options={options} series={series} type="bar" height={380} />
         </div>
      </div>
   );
}

export default HomeCategoryComparison;
