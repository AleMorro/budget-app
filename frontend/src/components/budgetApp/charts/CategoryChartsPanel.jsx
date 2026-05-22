import React, { useMemo } from "react";
import CategoryTotalsBarChart from "./CategoryTotalsBarChart";
import CategoryTrendAreaChart from "./CategoryTrendAreaChart";

/** @param {'income'|'expense'} kind */
function CategoryChartsPanel({ items, title, kind = "expense" }) {
   const barHeight = useMemo(() => {
      const n = new Set((items || []).map((r) => r.category || "Other")).size;
      return Math.min(480, Math.max(220, 80 + n * 36));
   }, [items]);

   return (
      <div className="card mb-4">
         <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <div className="row g-3">
               <div className="col-12 col-lg-6">
                  <CategoryTotalsBarChart
                     items={items}
                     kind={kind}
                     title="Totale per categoria"
                     height={barHeight}
                  />
               </div>
               <div className="col-12 col-lg-6">
                  <CategoryTrendAreaChart
                     items={items}
                     kind={kind}
                     title="Trend nel tempo (per categoria)"
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

export default CategoryChartsPanel;
