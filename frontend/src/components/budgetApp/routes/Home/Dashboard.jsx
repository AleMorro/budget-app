import React, { useEffect, useMemo, useState } from "react";

import { CardsData } from "../../data/CardsData";
import Card from "./Card";
import Reports from "./Reports";
import IncomeExpenseSummary from "./IncomeExpenseSummary";
import HomeCategoryComparison from "./HomeCategoryComparison";
import HomeWalletSummary from "./HomeWalletSummary";
import YearMonthFilter, { MONTH_LABELS } from "../../YearMonthFilter";
import { useGlobalContext } from "../../../../context/globalContext";
import { getYearRangeOptionsFromTransactions } from "../../utils/filterByYearMonth";
import "../../styles/Dashboard.css";

function Dashboard() {
   const { incomes, expenses, loading } = useGlobalContext();
   const [year, setYear] = useState(() => new Date().getFullYear());
   const [monthIndex, setMonthIndex] = useState(() => new Date().getMonth());

   const yearOptions = useMemo(
      () => getYearRangeOptionsFromTransactions(incomes, expenses),
      [incomes, expenses]
   );

   useEffect(() => {
      if (!yearOptions.length) return;
      if (!yearOptions.includes(year)) {
         setYear(yearOptions[0]);
      }
   }, [yearOptions, year]);

   const periodLabel = useMemo(
      () =>
         monthIndex < 0
            ? `${year} (tutto l'anno)`
            : `${year} / ${MONTH_LABELS[monthIndex]}`,
      [year, monthIndex]
   );

   return (
      <section className="dashboard section">
         <div className="row">
            <div className="col-lg-12 col-md-12">
               <div className="row">
                  <div className="col-12">
                     <div className="card mb-3">
                        <div className="card-body py-3">
                           <h6 className="text-muted mb-2 mb-md-3">
                              Periodo per i grafici in Home (dal primo movimento a oggi)
                           </h6>
                           <YearMonthFilter
                              bare
                              yearOptions={yearOptions}
                              year={year}
                              monthIndex={monthIndex}
                              onYearChange={setYear}
                              onMonthChange={setMonthIndex}
                           />
                        </div>
                     </div>
                  </div>
                  <div className="col-12">
                     <IncomeExpenseSummary
                        year={year}
                        monthIndex={monthIndex}
                        loading={loading}
                     />
                  </div>
                  {CardsData.map((card) => (
                     <Card
                        key={card.id}
                        card={card}
                        year={year}
                        monthIndex={monthIndex}
                        periodLabel={periodLabel}
                        loading={loading}
                     />
                  ))}
                  <div className="col-12">
                     <HomeCategoryComparison
                        year={year}
                        monthIndex={monthIndex}
                        loading={loading}
                        periodLabel={periodLabel}
                     />
                  </div>
                  <div className="col-12">
                     <HomeWalletSummary
                        year={year}
                        monthIndex={monthIndex}
                        loading={loading}
                        periodLabel={periodLabel}
                     />
                  </div>
                  <div className="col-12">
                     <Reports year={year} monthIndex={monthIndex} loading={loading} />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

export default Dashboard;
