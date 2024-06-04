import React from "react";

import PageTitle from "../PageTitle";

import '../../styles/Main.css'
import Recent from "./Recent";
import FormInc from "./FormInc";

import '../../styles/Main.css';
import '../../styles/Dashboard.css'

import { GlobalProvider } from '../../../../context/globalContext.jsx'

function Incomes() {

   return(
      <GlobalProvider>
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
                           <Recent />
                        </div>

                     </div>
                  </div>
               </div>
            </section>

         </main>
      </GlobalProvider>
   )
}

export default Incomes;