import React from "react";

import PageTitle from "../PageTitle";

import '../../styles/Main.css';
import Dashboard from "./Dashboard";
import { GlobalProvider } from '../../../../context/globalContext.jsx'
import Footer from "../../Footer.jsx";

function Home() {

   return(
      <main id='main' className='main'>
         <PageTitle page="Home"/>
         <Dashboard />
         <Footer />
      </main>
   )
}

export default Home;