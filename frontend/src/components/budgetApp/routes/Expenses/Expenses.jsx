import React, { useMemo, useState } from "react";
import PageTitle from "../PageTitle";
import FormExp from "./FormExp.jsx";
import RecentExp from "./RecentExp.jsx";
import Footer from "../../Footer.jsx";
import YearMonthFilter, { MONTH_LABELS } from "../../YearMonthFilter";
import CategoryChartsPanel from "../../charts/CategoryChartsPanel";
import { useGlobalContext } from "../../../../context/globalContext";
import { filterByYearMonth, getYearOptionsFromTransactions } from "../../utils/filterByYearMonth";
import "../../styles/Main.css";
import "../../styles/Dashboard.css";

function Expenses() {
   const { expenses } = useGlobalContext();
   const [year, setYear] = useState(() => new Date().getFullYear());
   const [monthIndex, setMonthIndex] = useState(() => new Date().getMonth());

   const yearOptions = useMemo(
      () => getYearOptionsFromTransactions(expenses, new Date().getFullYear()),
      [expenses]
   );

   const filtered = useMemo(() => {
      const f = filterByYearMonth(expenses, year, monthIndex);
      return [...f].sort((a, b) => new Date(a.date) - new Date(b.date));
   }, [expenses, year, monthIndex]);

   const periodDescription =
      monthIndex < 0
         ? `| ${year} (tutto l'anno)`
         : `| ${year} / ${MONTH_LABELS[monthIndex]}`;

   return (
      <main id="main" className="main">
         <PageTitle page="Expenses" />

         <section className="dashboard section">
            <div className="row">
               <div className="col-lg-12 col-md-12">
                  <div className="row">
                     <div className="col-12">
                        <FormExp />
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
                           kind="expense"
                           items={filtered}
                           title={`Analisi per categoria ${periodDescription}`}
                        />
                     </div>
                     <div className="col-12">
                        <RecentExp items={filtered} periodDescription={periodDescription} />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}

export default Expenses;
