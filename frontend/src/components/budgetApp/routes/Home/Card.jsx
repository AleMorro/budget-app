import React, { useEffect, useMemo, useState } from "react";

import { useGlobalContext } from "../../../../context/globalContext";
import "../../styles/Card.css";
import {
   filterByYearMonth,
   getPreviousYearMonthPeriod,
   sumTransactionAmounts,
} from "../../utils/filterByYearMonth";

function trendRatio(current, previous) {
   if (previous === 0 && current === 0) return 0;
   if (previous === 0) return current > 0 ? 1 : 0;
   return current / previous - 1;
}

function formatTrendPercent(ratio) {
   if (ratio === Infinity || ratio === -Infinity) return ratio > 0 ? 100 : -100;
   if (Number.isNaN(ratio)) return 0;
   return Math.round(ratio * 100);
}

function Card({ card, year, monthIndex, periodLabel, loading }) {
   const { incomes, expenses } = useGlobalContext();

   const [renderedData, setRenderedData] = useState("—");
   const [trendPercent, setTrendPercent] = useState(0);

   const prevPeriod = useMemo(
      () => getPreviousYearMonthPeriod(year, monthIndex),
      [year, monthIndex]
   );

   useEffect(() => {
      if (loading) return;

      const curInc = sumTransactionAmounts(filterByYearMonth(incomes, year, monthIndex));
      const curExp = sumTransactionAmounts(filterByYearMonth(expenses, year, monthIndex));
      const prevInc = sumTransactionAmounts(
         filterByYearMonth(incomes, prevPeriod.year, prevPeriod.monthIndex)
      );
      const prevExp = sumTransactionAmounts(
         filterByYearMonth(expenses, prevPeriod.year, prevPeriod.monthIndex)
      );

      const balance = curInc - curExp;
      const prevBalance = prevInc - prevExp;

      let value;
      let ratio;
      if (card.name === "Incomes") {
         value = curInc;
         ratio = trendRatio(curInc, prevInc);
      } else if (card.name === "Expenses") {
         value = curExp;
         ratio = trendRatio(curExp, prevExp);
      } else {
         value = balance;
         ratio = trendRatio(balance, prevBalance);
      }

      setRenderedData(
         value.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      );
      setTrendPercent(formatTrendPercent(ratio));
   }, [
      loading,
      card.name,
      incomes,
      expenses,
      year,
      monthIndex,
      prevPeriod.year,
      prevPeriod.monthIndex,
   ]);

   const renderText = () => (trendPercent > 0 ? "increase" : trendPercent < 0 ? "decrease" : "stable");

   const renderColor = () => {
      if (card.name === "Expenses") {
         if (trendPercent === 0) return "text-muted";
         return trendPercent > 0 ? "text-danger" : "text-success";
      }
      if (trendPercent === 0) return "text-muted";
      return trendPercent > 0 ? "text-success" : "text-danger";
   };

   return (
      <div className="col-xxl-4 col-md-4">
         <div className="card info-card sales-card">
            <div className="card-body">
               <h5 className="card-title">
                  {card.name} <span>| {periodLabel}</span>
               </h5>

               <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                     <i className={card.icon}></i>
                  </div>
                  <div className="ps-3">
                     <h6>€ {renderedData}</h6>

                     <span className={`${renderColor()} small pt-1 fw-bold`}>
                        {trendPercent > 0 ? "+" : ""}
                        {trendPercent}%
                     </span>
                     <span className="text-muted small pt-2 ps-1">{renderText()}</span>
                     <span className="text-muted small d-block mt-1">
                        vs periodo precedente
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Card;
