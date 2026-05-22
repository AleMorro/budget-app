import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { parseISO, getTime } from "date-fns";
import { useGlobalContext } from "../../../context/globalContext";
import { colorsForCategories } from "./chartCategoryColors";

function sumByDateThenCategory(items) {
   const dayMap = new Map();
   (items || []).forEach((row) => {
      if (!row?.date) return;
      const t = getTime(parseISO(row.date));
      const cat = row.category || "Other";
      const amt = Number(row.amount) || 0;
      if (!dayMap.has(t)) dayMap.set(t, new Map());
      const cm = dayMap.get(t);
      cm.set(cat, (cm.get(cat) || 0) + amt);
   });
   const times = Array.from(dayMap.keys()).sort((a, b) => a - b);
   const catSet = new Set();
   times.forEach((t) => {
      dayMap.get(t).forEach((_, c) => catSet.add(c));
   });
   const cats = Array.from(catSet).sort();
   const series = cats.map((cat) => ({
      name: cat,
      data: times.map((t) => ({ x: t, y: dayMap.get(t).get(cat) || 0 })),
   }));
   return { series };
}

function CategoryTrendAreaChart({ items, title, height = 300, kind = "expense" }) {
   const { getCategoryAppearance } = useGlobalContext();
   const { series } = useMemo(() => sumByDateThenCategory(items), [items]);

   const catNames = useMemo(() => series.map((s) => s.name), [series]);
   const areaColors = useMemo(
      () => colorsForCategories(kind, catNames, getCategoryAppearance),
      [kind, catNames, getCategoryAppearance]
   );

   const options = useMemo(
      () => ({
         chart: { type: "area", toolbar: { show: false }, stacked: true, fontFamily: "inherit" },
         stroke: { curve: "smooth", width: 2 },
         fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
         colors: areaColors,
         dataLabels: { enabled: false },
         xaxis: { type: "datetime" },
         tooltip: { x: { format: "dd/MM/yyyy" } },
         legend: { position: "bottom", fontSize: "12px" },
         title: title
            ? { text: title, align: "left", style: { fontSize: "14px", fontWeight: 600 } }
            : undefined,
      }),
      [title, series, areaColors]
   );

   if (!series.length || !items?.length) {
      return (
         <p className="text-muted small mb-0">
            Nessun dato nel periodo selezionato per il trend per categoria.
         </p>
      );
   }

   return <Chart options={options} series={series} type="area" height={height} />;
}

export default CategoryTrendAreaChart;
