import React from "react";
// import components
import PageTitle from "../PageTitle";
import FormInc from "./FormInc";
import RecentInc from "./RecentInc.jsx";
import Footer from "../../Footer.jsx";
// import stylesheet
import '../../styles/Main.css';
import '../../styles/Dashboard.css'

// function to render all the various components of incomes routes
function Incomes() {

   return(
      <main id='main' className='main'>
         <PageTitle page="Incomes"/>

         <section className="dashboard section">
            <div className="row">
               <div className="col-lg-12 col-md-12">
                  <div className="row">
                     
                     <div className="col-12">
                        <FormInc />
                     </div>
                     <div className="col-12">
                        <RecentInc />
                     </div>

                  </div>
               </div>
            </div>
         </section>

         <Footer />

      </main>
   )
}

export default Incomes;