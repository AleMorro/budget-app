import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { useGlobalContext } from "../../../context/globalContext";
import { aggregateByCategory } from "./aggregateByCategory";
import { colorsForCategories } from "./chartCategoryColors";

function CategoryTotalsBarChart({ items, title, height = 320, kind = "expense" }) {
   const { getCategoryAppearance } = useGlobalContext();
   const { categories, values } = useMemo(() => aggregateByCategory(items), [items]);

   const barColors = useMemo(
      () => colorsForCategories(kind, categories, getCategoryAppearance),
      [kind, categories, getCategoryAppearance]
   );

   const options = useMemo(
      () => ({
         chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
         plotOptions: {
            bar: { horizontal: true, borderRadius: 4, barHeight: "70%", distributed: true },
         },
         colors: barColors,
         dataLabels: {
            enabled: true,
            formatter: (val) => (Number(val) >= 1000 ? `${(val / 1000).toFixed(1)}k` : String(val)),
         },
         xaxis: { categories },
         yaxis: { labels: { maxWidth: 160 } },
         legend: { show: false },
         tooltip: {
            y: {
               formatter: (val) =>
                  `€ ${Number(val).toLocaleString("it-IT", { minimumFractionDigits: 2 })}`,
            },
         },
         title: title
            ? { text: title, align: "left", style: { fontSize: "14px", fontWeight: 600 } }
            : undefined,
      }),
      [categories, title, barColors]
   );

   const series = useMemo(() => [{ name: "Totale", data: values }], [values]);

   if (!categories.length) {
      return (
         <p className="text-muted small mb-0">
            Nessun dato per categoria nel periodo selezionato.
         </p>
      );
   }

   return <Chart options={options} series={series} type="bar" height={height} />;
}

export default CategoryTotalsBarChart;
