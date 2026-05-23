import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitle from "../PageTitle";
import Footer from "../../Footer";
import CategorySettingsPanel from "../CategorySettings/CategorySettingsPanel";
import AccountSettingsPanel from "../Profile/AccountSettingsPanel";
import { useGlobalContext } from "../../../../context/globalContext";
import "../../styles/Main.css";
import "../../styles/SettingsHub.css";

/** Ordine allineato ai sottonodi della sidebar */
const SECTIONS = [
   { id: "settings-theme" },
   { id: "settings-categories" },
   { id: "settings-account" },
];

function SettingsHub() {
   const { userProfile, updateUserProfile } = useGlobalContext();
   const location = useLocation();
   const [activeId, setActiveId] = useState(SECTIONS[0].id);

   useEffect(() => {
      const hash = location.hash?.replace("#", "");
      if (hash && SECTIONS.some((s) => s.id === hash)) {
         setActiveId(hash);
         requestAnimationFrame(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
         });
      }
   }, [location.hash]);

   useEffect(() => {
      const observers = [];
      SECTIONS.forEach(({ id }) => {
         const el = document.getElementById(id);
         if (!el) return;
         const obs = new IntersectionObserver(
            (entries) => {
               entries.forEach((entry) => {
                  if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
                     setActiveId(id);
                  }
               });
            },
            { rootMargin: "-15% 0px -60% 0px", threshold: [0, 0.25, 0.5] }
         );
         obs.observe(el);
         observers.push(obs);
      });
      return () => observers.forEach((o) => o.disconnect());
   }, []);

   return (
      <main id="main" className="main">
         <PageTitle page="Impostazioni" />

         <section className="dashboard section settings-hub">
            <div className="settings-sections">
               <section
                  id="settings-theme"
                  className={`settings-block mb-4 ${activeId === "settings-theme" ? "is-active" : ""}`}
               >
                  <div className="card">
                     <div className="card-body">
                        <h5 className="card-title">Tema</h5>
                        <p className="text-muted small">
                           Scegli tra tema chiaro e scuro. La preferenza resta salvata su questo dispositivo.
                        </p>
                        <div className="btn-group" role="group">
                           <button
                              type="button"
                              className={`btn btn-sm ${userProfile.theme !== "dark" ? "btn-primary" : "btn-outline-primary"}`}
                              onClick={() => updateUserProfile({ theme: "light" })}
                           >
                              <i className="bi bi-sun me-1" aria-hidden />
                              Chiaro
                           </button>
                           <button
                              type="button"
                              className={`btn btn-sm ${userProfile.theme === "dark" ? "btn-primary" : "btn-outline-primary"}`}
                              onClick={() => updateUserProfile({ theme: "dark" })}
                           >
                              <i className="bi bi-moon me-1" aria-hidden />
                              Scuro
                           </button>
                        </div>
                     </div>
                  </div>
               </section>

               <section
                  id="settings-categories"
                  className={`settings-block mb-4 ${activeId === "settings-categories" ? "is-active" : ""}`}
               >
                  <CategorySettingsPanel />
               </section>

               <section
                  id="settings-account"
                  className={`settings-block mb-4 ${activeId === "settings-account" ? "is-active" : ""}`}
               >
                  <div className="card">
                     <div className="card-body">
                        <h5 className="card-title">Account</h5>
                        <p className="text-muted small mb-3">
                           Nome e foto mostrati nel menu e nell&apos;intestazione.
                        </p>
                        <AccountSettingsPanel />
                     </div>
                  </div>
               </section>
            </div>
         </section>

         <Footer />
      </main>
   );
}

export default SettingsHub;
