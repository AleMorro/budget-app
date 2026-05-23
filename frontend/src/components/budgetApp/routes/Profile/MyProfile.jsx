import React from "react";
import PageTitle from "../PageTitle";
import Footer from "../../Footer";
import { useGlobalContext } from "../../../../context/globalContext";
import "../../styles/Main.css";

function MyProfile() {
   const { loggedUser, displayName, userProfile } = useGlobalContext();

   return (
      <main id="main" className="main">
         <PageTitle page="Il mio profilo" />

         <section className="dashboard section">
            <div className="row justify-content-center">
               <div className="col-lg-8">
                  <div className="card">
                     <div className="card-body text-center py-4">
                        {userProfile.avatarDataUrl ? (
                           <img
                              src={userProfile.avatarDataUrl}
                              alt=""
                              className="rounded-circle mb-3 border"
                              width={96}
                              height={96}
                              style={{ objectFit: "cover" }}
                           />
                        ) : (
                           <i
                              className="bi bi-person-circle text-primary mb-3 d-block"
                              style={{ fontSize: "5rem" }}
                              aria-hidden
                           />
                        )}
                        <h4 className="mb-1">{displayName}</h4>
                        <p className="text-muted small mb-4">{loggedUser?.email || "—"}</p>
                     </div>
                  </div>

                  <div className="card mt-3">
                     <div className="card-body">
                        <h5 className="card-title">Identità account</h5>
                        <dl className="row mb-0 small">
                           <dt className="col-sm-4">ID utente</dt>
                           <dd className="col-sm-8">{loggedUser?.user_id ?? "—"}</dd>
                           <dt className="col-sm-4">Nome registrato</dt>
                           <dd className="col-sm-8">{loggedUser?.name ?? "—"}</dd>
                           <dt className="col-sm-4">Email</dt>
                           <dd className="col-sm-8">{loggedUser?.email ?? "—"}</dd>
                           <dt className="col-sm-4">Nome in app</dt>
                           <dd className="col-sm-8">{displayName}</dd>
                        </dl>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}

export default MyProfile;
