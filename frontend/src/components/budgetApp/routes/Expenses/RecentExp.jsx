import React from "react";
import RecentExpTab from "./RecentExpTab";
import SearchBar from "../SearchBar";
import { useGlobalContext } from "../../../../context/globalContext";

function RecentExp({ items, periodDescription }) {
   const { loading } = useGlobalContext();

   return (
      <div className="card recent">
         <div className="card-body">
            <h5 className="card-title">
               Recent expenses {periodDescription && <span>{periodDescription}</span>}
               <SearchBar />
            </h5>
            {loading ? (
               <p className="text-muted small mb-0">Caricamento…</p>
            ) : (
               <RecentExpTab items={items} />
            )}
         </div>
      </div>
   );
}

export default RecentExp;
