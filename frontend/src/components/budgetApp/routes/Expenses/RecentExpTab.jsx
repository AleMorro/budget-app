import React from "react";

import { useGlobalContext } from "../../../../context/globalContext";
import "../../styles/RecentTab.css";

function RecentExpTab({ items }) {
   const { deleteExpense, getWalletLabel, getCategoryAppearance } = useGlobalContext();

   return (
      <table className="table table-borderless datatable">
         <thead className="table-light">
            <tr>
               <th scope="col">Categoria</th>
               <th scope="col">Wallet</th>
               <th scope="col">Data</th>
               <th scope="col">Descrizione</th>
               <th scope="col">Importo</th>
               <th scope="col">Elimina</th>
            </tr>
         </thead>

         <tbody id="myTable">
            {items &&
               items.length > 0 &&
               items.map((item) => {
                  const ap = getCategoryAppearance("expense", item.category);
                  return (
                     <tr key={item.id}>
                        <th scope="row">
                           <i className={`${ap.icon} me-1`} style={{ color: ap.color }} aria-hidden />
                           {item.category}
                        </th>
                        <td className="small text-muted">{getWalletLabel("e", item.id)}</td>
                        <td>{item.date}</td>
                        <td>{item.description}</td>
                        <td>
                           <span className="badge bg-danger">€{Number(item.amount).toFixed(2)}</span>
                        </td>
                        <td>
                           <i
                              className="bi bi-trash"
                              role="button"
                              title="Elimina"
                              onClick={() => deleteExpense(item.id)}
                           />
                        </td>
                     </tr>
                  );
               })}
         </tbody>
      </table>
   );
}
export default RecentExpTab;
