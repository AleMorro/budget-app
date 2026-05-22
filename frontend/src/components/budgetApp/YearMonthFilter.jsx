import React from "react";

const MONTH_LABELS = [
   "Gennaio",
   "Febbraio",
   "Marzo",
   "Aprile",
   "Maggio",
   "Giugno",
   "Luglio",
   "Agosto",
   "Settembre",
   "Ottobre",
   "Novembre",
   "Dicembre",
];

/**
 * monthIndex: -1 = tutto l'anno, 0-11 = mese
 * bare: se true, niente card esterna (utile dentro un altro contenitore)
 */
function YearMonthFilter({
   yearOptions,
   year,
   monthIndex,
   onYearChange,
   onMonthChange,
   bare = false,
}) {
   const controls = (
            <div className="row g-2 align-items-end">
               <div className="col-auto">
                  <label className="form-label small text-muted mb-1">Anno</label>
                  <select
                     className="form-select form-select-sm"
                     value={year}
                     onChange={(e) => onYearChange(Number(e.target.value))}
                  >
                     {yearOptions.map((y) => (
                        <option key={y} value={y}>
                           {y}
                        </option>
                     ))}
                  </select>
               </div>
               <div className="col-auto">
                  <label className="form-label small text-muted mb-1">Mese</label>
                  <select
                     className="form-select form-select-sm"
                     value={monthIndex}
                     onChange={(e) => onMonthChange(Number(e.target.value))}
                  >
                     <option value={-1}>Tutto l&apos;anno</option>
                     {MONTH_LABELS.map((label, idx) => (
                        <option key={label} value={idx}>
                           {label}
                        </option>
                     ))}
                  </select>
               </div>
            </div>
   );

   if (bare) {
      return controls;
   }

   return (
      <div className="card mb-3">
         <div className="card-body py-3">{controls}</div>
      </div>
   );
}

export default YearMonthFilter;
export { MONTH_LABELS };
