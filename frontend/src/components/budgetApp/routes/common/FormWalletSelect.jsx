import React from "react";
import { useGlobalContext } from "../../../../context/globalContext";

function FormWalletSelect({ value, onChange, id }) {
   const { wallets, defaultWalletId } = useGlobalContext();

   return (
      <select
         className="form-select"
         id={id}
         value={value || defaultWalletId}
         onChange={(e) => onChange(e.target.value)}
      >
         {wallets.map((w) => (
            <option key={w.id} value={w.id}>
               {w.color ? "● " : ""}
               {w.name} ({w.type})
            </option>
         ))}
      </select>
   );
}

export default FormWalletSelect;
