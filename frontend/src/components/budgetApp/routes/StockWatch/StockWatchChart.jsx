import React, { useMemo } from "react";
import Chart from "react-apexcharts";

function StockWatchChart({ points, symbol, currency = "EUR", loading, isIntraday = true }) {
   const series = useMemo(
      () => [{ name: symbol || "Prezzo", data: points || [] }],
      [points, symbol]
   );

   const options = useMemo(
      () => ({
         chart: {
            type: "area",
            toolbar: { show: true },
            animations: { enabled: true, easing: "linear", dynamicAnimation: { speed: 400 } },
            fontFamily: "inherit",
         },
         stroke: { curve: "smooth", width: 2 },
         fill: {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 },
         },
         colors: ["#4154f1"],
         dataLabels: { enabled: false },
         xaxis: { type: "datetime", labels: { datetimeUTC: false } },
         yaxis: {
            labels: {
               formatter: (v) =>
                  v != null
                     ? Number(v).toLocaleString("it-IT", { maximumFractionDigits: 2 })
                     : "",
            },
         },
         tooltip: {
            x: { format: isIntraday ? "dd/MM HH:mm" : "dd/MM/yyyy" },
            y: {
               formatter: (v) =>
                  `${currency} ${Number(v).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`,
            },
         },
         grid: { borderColor: "#e9ecef" },
      }),
      [currency, isIntraday]
   );

   if (loading && (!points || points.length === 0)) {
      return <p className="text-muted small mb-0">Caricamento grafico…</p>;
   }

   if (!points || points.length === 0) {
      return (
         <p className="text-muted small mb-0">
            Nessun dato per il periodo selezionato.
         </p>
      );
   }

   return <Chart options={options} series={series} type="area" height={400} />;
}

export default StockWatchChart;
