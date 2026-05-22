import React, { useEffect, useMemo, useState } from "react";
import PageTitle from "../PageTitle";
import Footer from "../../Footer";
import YearMonthFilter, { MONTH_LABELS } from "../../YearMonthFilter";
import { useGlobalContext } from "../../../../context/globalContext";
import CategoryAppearanceIcon from "../common/CategoryAppearanceIcon";
import { mergeCategoryNamesFromData } from "../../../../lib/localFinanceStore";
import { filterByYearMonth, getYearRangeOptionsFromTransactions } from "../../utils/filterByYearMonth";
import "../../styles/Main.css";
import "../../styles/Dashboard.css";

function Budget() {
   const {
      expenses,
      incomes,
      expenseBudgetsMonthly,
      setExpenseBudgetForCategory,
      getCategoryAppearance,
   } = useGlobalContext();
   const now = new Date();
   const [year, setYear] = useState(() => now.getFullYear());
   const [monthIndex, setMonthIndex] = useState(() => now.getMonth());

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

   const categories = useMemo(
      () => mergeCategoryNamesFromData(incomes, expenses, "expense"),
      [incomes, expenses]
   );

   const filteredExpenses = useMemo(
      () => filterByYearMonth(expenses, year, monthIndex),
      [expenses, year, monthIndex]
   );

   const spentByCategory = useMemo(() => {
      const m = {};
      filteredExpenses.forEach((e) => {
         const c = e.category || "Other";
         m[c] = (m[c] || 0) + Number(e.amount);
      });
      return m;
   }, [filteredExpenses]);

   const periodLabel =
      monthIndex < 0
         ? `${year} (tutto l'anno)`
         : `${year} / ${MONTH_LABELS[monthIndex]}`;

   const budgetCapForCategory = (monthly) =>
      monthIndex < 0 ? monthly * 12 : monthly;

   return (
      <main id="main" className="main">
         <PageTitle page="Budget" />

         <section className="dashboard section">
            <div className="row">
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
                  <div className="card">
                     <div className="card-body">
                        <h5 className="card-title">Budget mensile per categoria (uscite)</h5>
                        <p className="text-muted small mb-3">
                           Imposti un tetto <strong>mensile</strong>; nel periodo selezionato il confronto
                           usa quel valore per un singolo mese, oppure <strong>×12</strong> per l&apos;intero
                           anno. Periodo: <strong>{periodLabel}</strong>.
                        </p>
                        <div className="table-responsive">
                           <table className="table table-sm align-middle">
                              <thead>
                                 <tr>
                                    <th>Categoria</th>
                                    <th>Budget mensile (€)</th>
                                    <th>Speso nel periodo</th>
                                    <th>Cap periodo</th>
                                    <th style={{ minWidth: 140 }}>Utilizzo</th>
                                    <th>Stato</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {categories.map((cat) => {
                                    const monthly = expenseBudgetsMonthly[cat] || 0;
                                    const cap = monthly > 0 ? budgetCapForCategory(monthly) : 0;
                                    const spent = spentByCategory[cat] || 0;
                                    const pctRaw = cap > 0 ? (spent / cap) * 100 : 0;
                                    const pct = cap > 0 ? Math.min(100, Math.round(pctRaw)) : null;
                                    const over = cap > 0 && spent > cap;
                                    const ap = getCategoryAppearance("expense", cat);
                                    const barPct = cap > 0 ? Math.min(100, pctRaw) : 0;
                                    return (
                                       <tr key={cat}>
                                          <td className="fw-medium">
                                             <CategoryAppearanceIcon style={ap} size="1.1rem" />
                                             <span className="ms-1">{cat}</span>
                                          </td>
                                          <td style={{ maxWidth: 140 }}>
                                             <input
                                                type="number"
                                                min={0}
                                                step={0.01}
                                                className="form-control form-control-sm"
                                                placeholder="0"
                                                defaultValue={monthly || ""}
                                                key={`${cat}-${monthly}`}
                                                onBlur={(e) =>
                                                   setExpenseBudgetForCategory(cat, e.target.value)
                                                }
                                             />
                                          </td>
                                          <td>€ {spent.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</td>
                                          <td>
                                             {cap > 0
                                                ? `€ ${cap.toLocaleString("it-IT", { minimumFractionDigits: 2 })}`
                                                : "—"}
                                          </td>
                                          <td>
                                             {cap > 0 ? (
                                                <div className="progress" style={{ height: 8 }}>
                                                   <div
                                                      className={`progress-bar ${
                                                         over ? "bg-danger" : "bg-primary"
                                                      }`}
                                                      role="progressbar"
                                                      style={{ width: `${barPct}%` }}
                                                      aria-valuenow={barPct}
                                                      aria-valuemin={0}
                                                      aria-valuemax={100}
                                                   />
                                                </div>
                                             ) : (
                                                <span className="text-muted small">—</span>
                                             )}
                                          </td>
                                          <td>
                                             {cap <= 0 ? (
                                                <span className="text-muted small">Imposta budget</span>
                                             ) : over ? (
                                                <span className="badge bg-danger">Superato</span>
                                             ) : (
                                                <span className="badge bg-success">{pct}% usato</span>
                                             )}
                                          </td>
                                       </tr>
                                    );
                                 })}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}

export default Budget;
