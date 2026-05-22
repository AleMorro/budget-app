import React from "react";
import ReportCharts from "./ReportCharts";
import { MONTH_LABELS } from "../../YearMonthFilter";

function Reports({ year, monthIndex, loading }) {
   const periodLabel =
      monthIndex < 0
         ? `${year} (tutto l'anno)`
         : `${year} / ${MONTH_LABELS[monthIndex]}`;

   return (
      <div className="card overflow-auto">
         <div className="card-body">
            <h5 className="card-title">
               Reports <span>| {periodLabel}</span>
            </h5>
            <ReportCharts year={year} monthIndex={monthIndex} loading={loading} />
         </div>
      </div>
   );
}

export default Reports;
