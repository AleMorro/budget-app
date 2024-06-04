import React from "react";

import PageTitle from "../PageTitle";

import '../../styles/Main.css';
import Dashboard from "./Dashboard";
import { GlobalProvider } from '../../../../context/globalContext.jsx'

function Home() {

   return(
      <GlobalProvider>
         <main id='main' className='main'>
            <PageTitle page="Home"/>
            <Dashboard />
         </main>
      </GlobalProvider>
   )
}

export default Home;