import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { useGlobalContext } from "../../../../context/globalContext";
import { filterByYearMonth } from "../../utils/filterByYearMonth";
import { MONTH_LABELS } from "../../YearMonthFilter";

function sumAmount(items) {
   return (items || []).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
}

function IncomeExpenseSummary({ year, monthIndex, loading }) {
   const { incomes, expenses } = useGlobalContext();

   const { series, periodLabel } = useMemo(() => {
      const incFiltered = filterByYearMonth(incomes, year, monthIndex);
      const expFiltered = filterByYearMonth(expenses, year, monthIndex);
      const label =
         monthIndex < 0
            ? `${year} (tutto l'anno)`
            : `${year} / ${MONTH_LABELS[monthIndex]}`;
      return {
         series: [sumAmount(incFiltered), sumAmount(expFiltered)],
         periodLabel: label,
      };
   }, [incomes, expenses, year, monthIndex]);

   const balance = series[0] - series[1];
   const bothZero = series[0] === 0 && series[1] === 0;

   const options = useMemo(
      () => ({
         chart: { type: "pie", toolbar: { show: false }, fontFamily: "inherit" },
         labels: ["Entrate", "Uscite"],
         colors: ["#4154f1", "#b83941"],
         legend: { position: "bottom" },
         dataLabels: { enabled: true },
         tooltip: {
            y: {
               formatter: (val) =>
                  `€ ${Number(val).toLocaleString("it-IT", { minimumFractionDigits: 2 })}`,
            },
         },
      }),
      []
   );

   return (
      <div className="card mb-3">
         <div className="card-body">
            <h5 className="card-title">
               Riepilogo entrate e uscite <span>| {periodLabel}</span>
            </h5>
            {loading && <p className="text-muted small mb-0">Caricamento…</p>}
            {!loading && (
               <div className="row align-items-center">
                  <div className="col-md-5">
                     <p className="mb-2">
                        <strong>Entrate:</strong>{" "}
                        <span className="text-primary">
                           € {series[0].toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                        </span>
                     </p>
                     <p className="mb-2">
                        <strong>Uscite:</strong>{" "}
                        <span className="text-danger">
                           € {series[1].toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                        </span>
                     </p>
                     <p className="mb-0">
                        <strong>Saldo:</strong>{" "}
                        <span className={balance >= 0 ? "text-success" : "text-danger"}>
                           € {balance.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                        </span>
                     </p>
                  </div>
                  <div className="col-md-7">
                     {bothZero ? (
                        <p className="text-muted small mb-0">Nessun movimento nel periodo.</p>
                     ) : (
                        <Chart options={options} series={series} type="pie" height={320} />
                     )}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

export default IncomeExpenseSummary;
