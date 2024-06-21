import React from "react";
// import components
import PageTitle from "../PageTitle";
import FormExp from "./FormExp.jsx";
import RecentExp from "./RecentExp.jsx";
import Footer from "../../Footer.jsx";
// import stylesheet
import '../../styles/Main.css';
import '../../styles/Dashboard.css'

// function to render all the various components of expenses routes
function Expenses() {

   return(
      <main id='main' className='main'>
         <PageTitle page="Expenses"/>

         <section className="dashboard section">
            <div className="row">
               <div className="col-lg-12 col-md-12">
                  <div className="row">
                     
                     <div className="col-12">
                        <FormExp />
                     </div>
                     <div className="col-12">
                        <RecentExp />
                     </div>

                  </div>
               </div>
            </div>
         </section>

         <Footer />

      </main>
   )
}

export default Expenses;