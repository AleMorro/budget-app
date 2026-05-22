import React, { useMemo, useState } from "react";
import PageTitle from "../PageTitle";
import FormInc from "./FormInc";
import RecentInc from "./RecentInc.jsx";
import Footer from "../../Footer.jsx";
import YearMonthFilter, { MONTH_LABELS } from "../../YearMonthFilter";
import CategoryChartsPanel from "../../charts/CategoryChartsPanel";
import { useGlobalContext } from "../../../../context/globalContext";
import { filterByYearMonth, getYearOptionsFromTransactions } from "../../utils/filterByYearMonth";
import "../../styles/Main.css";
import "../../styles/Dashboard.css";

function Incomes() {
   const { incomes } = useGlobalContext();
   const [year, setYear] = useState(() => new Date().getFullYear());
   const [monthIndex, setMonthIndex] = useState(() => new Date().getMonth());

   const yearOptions = useMemo(
      () => getYearOptionsFromTransactions(incomes, new Date().getFullYear()),
      [incomes]
   );

   const filtered = useMemo(() => {
      const f = filterByYearMonth(incomes, year, monthIndex);
      return [...f].sort((a, b) => new Date(a.date) - new Date(b.date));
   }, [incomes, year, monthIndex]);

   const periodDescription =
      monthIndex < 0
         ? `| ${year} (tutto l'anno)`
         : `| ${year} / ${MONTH_LABELS[monthIndex]}`;

   return (
      <main id="main" className="main">
         <PageTitle page="Incomes" />

         <section className="dashboard section">
            <div className="row">
               <div className="col-lg-12 col-md-12">
                  <div className="row">
                     <div className="col-12">
                        <FormInc />
                     </div>
                     <div className="col-12">
                        <YearMonthFilter
                           yearOptions={yearOptions}
                           year={year}
                           monthIndex={monthIndex}
                           onYearChange={setYear}
                           onMonthChange={setMonthIndex}
                        />
                     </div>
                     <div className="col-12">
                        <CategoryChartsPanel
                           kind="income"
                           items={filtered}
                           title={`Analisi per categoria ${periodDescription}`}
                        />
                     </div>
                     <div className="col-12">
                        <RecentInc items={filtered} periodDescription={periodDescription} />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}

export default Incomes;
