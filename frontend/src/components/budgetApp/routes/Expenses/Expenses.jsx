import React from "react";

import PageTitle from "../PageTitle";

import '../../styles/Main.css'
import FormExp from "./FormExp.jsx";

import '../../styles/Main.css';
import '../../styles/Dashboard.css'

import { GlobalProvider } from '../../../../context/globalContext.jsx'
import RecentExp from "./RecentExp.jsx";

function Expenses() {

   return(
      <GlobalProvider>
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

         </main>
      </GlobalProvider>
   )
}

export default Expenses;