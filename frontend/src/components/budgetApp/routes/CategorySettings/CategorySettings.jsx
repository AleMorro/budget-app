import React, { useEffect, useMemo, useState } from "react";
import PageTitle from "../PageTitle";
import Footer from "../../Footer";
import { useGlobalContext } from "../../../../context/globalContext";
import { mergeCategoryNamesFromData } from "../../../../lib/localFinanceStore";
import { ICON_CHOICES } from "../../../../lib/appConstants";
import "../../styles/Main.css";

function CategoryRow({ name, style, onSave }) {
   const [color, setColor] = useState(style.color);
   const [icon, setIcon] = useState(style.icon);

   useEffect(() => {
      setColor(style.color);
      setIcon(style.icon);
   }, [style.color, style.icon, name]);

   const apply = () => {
      onSave({ color, icon });
   };

   return (
      <tr>
         <td className="align-middle fw-medium">{name}</td>
         <td>
            <input
               type="color"
               className="form-control form-control-color"
               value={color}
               onChange={(e) => setColor(e.target.value)}
               title="Colore"
            />
         </td>
         <td>
            <select
               className="form-select form-select-sm"
               value={icon}
               onChange={(e) => setIcon(e.target.value)}
            >
               {ICON_CHOICES.map((o) => (
                  <option key={o.value} value={o.value}>
                     {o.label}
                  </option>
               ))}
            </select>
         </td>
         <td className="align-middle">
            <i className={icon} style={{ color, fontSize: "1.25rem" }} aria-hidden />
         </td>
         <td>
            <button type="button" className="btn btn-sm btn-primary" onClick={apply}>
               Salva
            </button>
         </td>
      </tr>
   );
}

function CategorySettings() {
   const { incomes, expenses, categoryStyles, setCategoryAppearance } = useGlobalContext();

   const incomeCats = useMemo(
      () => mergeCategoryNamesFromData(incomes, expenses, "income"),
      [incomes, expenses]
   );
   const expenseCats = useMemo(
      () => mergeCategoryNamesFromData(incomes, expenses, "expense"),
      [incomes, expenses]
   );

   const getStyle = (kind, name) => {
      const bucket = kind === "income" ? categoryStyles.income : categoryStyles.expense;
      const s = bucket[name];
      return s || { color: "#6c757d", icon: "bi-tag" };
   };

   return (
      <main id="main" className="main">
         <PageTitle page="Category Settings" />

         <section className="dashboard section">
            <div className="row">
               <div className="col-12">
                  <div className="card mb-4">
                     <div className="card-body">
                        <h5 className="card-title">Entrate — icona e colore per categoria</h5>
                        <p className="text-muted small">
                           Le modifiche sono salvate in questo browser (localStorage).
                        </p>
                        <div className="table-responsive">
                           <table className="table table-sm align-middle">
                              <thead>
                                 <tr>
                                    <th>Categoria</th>
                                    <th>Colore</th>
                                    <th>Icona</th>
                                    <th>Anteprima</th>
                                    <th />
                                 </tr>
                              </thead>
                              <tbody>
                                 {incomeCats.map((name) => (
                                    <CategoryRow
                                       key={`i-${name}`}
                                       name={name}
                                       style={getStyle("income", name)}
                                       onSave={(st) => setCategoryAppearance("income", name, st)}
                                    />
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="col-12">
                  <div className="card mb-4">
                     <div className="card-body">
                        <h5 className="card-title">Uscite — icona e colore per categoria</h5>
                        <div className="table-responsive">
                           <table className="table table-sm align-middle">
                              <thead>
                                 <tr>
                                    <th>Categoria</th>
                                    <th>Colore</th>
                                    <th>Icona</th>
                                    <th>Anteprima</th>
                                    <th />
                                 </tr>
                              </thead>
                              <tbody>
                                 {expenseCats.map((name) => (
                                    <CategoryRow
                                       key={`e-${name}`}
                                       name={name}
                                       style={getStyle("expense", name)}
                                       onSave={(st) => setCategoryAppearance("expense", name, st)}
                                    />
                                 ))}
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

export default CategorySettings;
