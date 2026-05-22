import React from "react";
import RecentIncTab from "./RecentIncTab";
import SearchBar from "../SearchBar";
import { useGlobalContext } from "../../../../context/globalContext";

function RecentInc({ items, periodDescription }) {
   const { loading } = useGlobalContext();

   return (
      <div className="card recent">
         <div className="card-body">
            <h5 className="card-title">
               Recent incomes {periodDescription && <span>{periodDescription}</span>}
               <SearchBar />
            </h5>
            {loading ? (
               <p className="text-muted small mb-0">Caricamento…</p>
            ) : (
               <RecentIncTab items={items} />
            )}
         </div>
      </div>
   );
}

export default RecentInc;
