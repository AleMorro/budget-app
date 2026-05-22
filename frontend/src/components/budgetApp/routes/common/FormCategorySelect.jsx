import React, { useId } from "react";
import { useGlobalContext } from "../../../../context/globalContext";
import CategoryAppearanceIcon from "./CategoryAppearanceIcon";

/**
 * @param {'income'|'expense'} kind
 * @param {string[]} categories
 */
function FormCategorySelect({ kind, categories, value, onChange, id, required }) {
   const { getCategoryAppearance } = useGlobalContext();
   const fallbackId = useId();
   const controlId = id || fallbackId;
   const selectedStyle = value ? getCategoryAppearance(kind, value) : null;

   return (
      <div>
         <input
            type="text"
            className="d-none"
            tabIndex={-1}
            value={value}
            onChange={() => {}}
            required={required}
            aria-hidden
         />
         <div className="dropdown w-100">
            <button
               className="btn btn-outline-secondary dropdown-toggle w-100 d-flex align-items-center gap-2 text-start"
               type="button"
               id={controlId}
               data-bs-toggle="dropdown"
               aria-expanded="false"
            >
               {value ? (
                  <>
                     <CategoryAppearanceIcon style={selectedStyle} />
                     <span className="flex-grow-1">{value}</span>
                  </>
               ) : (
                  <span className="text-muted">Scegli categoria…</span>
               )}
            </button>
            <ul className="dropdown-menu w-100 shadow-sm" aria-labelledby={controlId}>
               {categories.map((cat) => {
                  const ap = getCategoryAppearance(kind, cat);
                  return (
                     <li key={cat}>
                        <button
                           type="button"
                           className={`dropdown-item d-flex align-items-center gap-2 ${
                              value === cat ? "active" : ""
                           }`}
                           onClick={() => onChange(cat)}
                        >
                           <CategoryAppearanceIcon style={ap} />
                           {cat}
                        </button>
                     </li>
                  );
               })}
            </ul>
         </div>
      </div>
   );
}

export default FormCategorySelect;
