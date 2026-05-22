import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { getYear, parseISO } from "date-fns";
// import components
import PageTitle from "../PageTitle";
import Footer from "../../Footer";
import { useGlobalContext } from "../../../../context/globalContext";
// import stylesheet
import "../../styles/Main.css";
import "../../styles/Dashboard.css";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const toSafeAmount = (value) => Number(value) || 0;

function PreviousYears() {
   const { incomes, expenses, loading } = useGlobalContext();
   const currentYear = new Date().getFullYear();
   const [selectedYear, setSelectedYear] = useState(null);

   const availableYears = useMemo(() => {
      const years = new Set();

      [...incomes, ...expenses].forEach((item) => {
         if (!item?.date) return;
         const year = getYear(parseISO(item.date));
         if (year < currentYear) {
            years.add(year);
         }
      });

      return Array.from(years).sort((a, b) => b - a);
   }, [incomes, expenses, currentYear]);

   useEffect(() => {
      if (!availableYears.length) {
         setSelectedYear(null);
         return;
      }

      if (!selectedYear || !availableYears.includes(selectedYear)) {
         setSelectedYear(availableYears[0]);
      }
   }, [availableYears, selectedYear]);

   const monthlyTotals = useMemo(() => {
      const incomeByMonth = new Array(12).fill(0);
      const expenseByMonth = new Array(12).fill(0);

      if (!selectedYear) {
         return { incomeByMonth, expenseByMonth };
      }

      incomes.forEach((item) => {
         if (!item?.date) return;
         const date = parseISO(item.date);
         if (getYear(date) !== selectedYear) return;
         incomeByMonth[date.getMonth()] += toSafeAmount(item.amount);
      });

      expenses.forEach((item) => {
         if (!item?.date) return;
         const date = parseISO(item.date);
         if (getYear(date) !== selectedYear) return;
         expenseByMonth[date.getMonth()] += toSafeAmount(item.amount);
      });

      return { incomeByMonth, expenseByMonth };
   }, [incomes, expenses, selectedYear]);

   const yearlyTotals = useMemo(() => {
      const incomeTotals = {};
      const expenseTotals = {};

      const trackedYears = availableYears.slice().sort((a, b) => a - b);
      trackedYears.forEach((year) => {
         incomeTotals[year] = 0;
         expenseTotals[year] = 0;
      });

      incomes.forEach((item) => {
         if (!item?.date) return;
         const year = getYear(parseISO(item.date));
         if (!(year in incomeTotals)) return;
         incomeTotals[year] += toSafeAmount(item.amount);
      });

      expenses.forEach((item) => {
         if (!item?.date) return;
         const year = getYear(parseISO(item.date));
         if (!(year in expenseTotals)) return;
         expenseTotals[year] += toSafeAmount(item.amount);
      });

      return {
         years: trackedYears,
         incomes: trackedYears.map((year) => incomeTotals[year]),
         expenses: trackedYears.map((year) => expenseTotals[year]),
         balance: trackedYears.map((year) => incomeTotals[year] - expenseTotals[year]),
      };
   }, [incomes, expenses, availableYears]);

   const monthlyOptions = {
      chart: { type: "bar", toolbar: { show: false } },
      xaxis: { categories: MONTH_LABELS },
      colors: ["#4154f1", "#b83941"],
      dataLabels: { enabled: false },
      plotOptions: {
         bar: { horizontal: false, columnWidth: "55%", borderRadius: 3 },
      },
      yaxis: { labels: { formatter: (value) => value.toFixed(0) } },
   };

   const yearlyOptions = {
      chart: { type: "line", toolbar: { show: false } },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#4154f1", "#b83941", "#2eca6a"],
      dataLabels: { enabled: false },
      xaxis: { categories: yearlyTotals.years },
   };

   return (
      <main id="main" className="main">
         <PageTitle page="Previous Years" />

         <section className="dashboard section">
            <div className="row">
               <div className="col-lg-12 col-md-12">
                  <div className="row">
                     <div className="col-12">
                        <div className="card">
                           <div className="card-body">
                              <h5 className="card-title">Previous Years Reports</h5>
                              {loading && <p>Loading data...</p>}
                              {!loading && !availableYears.length && (
                                 <p>No transactions found in previous years.</p>
                              )}
                              {!loading && availableYears.length > 0 && (
                                 <div className="d-flex align-items-center gap-2 mb-3">
                                    <label htmlFor="year-select" className="mb-0">Year</label>
                                    <select
                                       id="year-select"
                                       className="form-select w-auto"
                                       value={selectedYear || ""}
                                       onChange={(event) => setSelectedYear(Number(event.target.value))}
                                    >
                                       {availableYears.map((year) => (
                                          <option key={year} value={year}>
                                             {year}
                                          </option>
                                       ))}
                                    </select>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     {availableYears.length > 0 && (
                        <>
                           <div className="col-12 col-lg-7">
                              <div className="card">
                                 <div className="card-body">
                                    <h5 className="card-title">
                                       Monthly Incomes vs Expenses <span>/{selectedYear}</span>
                                    </h5>
                                    <Chart
                                       options={monthlyOptions}
                                       series={[
                                          { name: "Incomes", data: monthlyTotals.incomeByMonth },
                                          { name: "Expenses", data: monthlyTotals.expenseByMonth },
                                       ]}
                                       type="bar"
                                       height={350}
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="col-12 col-lg-5">
                              <div className="card">
                                 <div className="card-body">
                                    <h5 className="card-title">Yearly Trend</h5>
                                    <Chart
                                       options={yearlyOptions}
                                       series={[
                                          { name: "Incomes", data: yearlyTotals.incomes },
                                          { name: "Expenses", data: yearlyTotals.expenses },
                                          { name: "Balance", data: yearlyTotals.balance },
                                       ]}
                                       type="line"
                                       height={350}
                                    />
                                 </div>
                              </div>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}

export default PreviousYears;
