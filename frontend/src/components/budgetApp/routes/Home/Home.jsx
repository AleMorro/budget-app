import React, { useEffect } from "react";

import PageTitle from "../PageTitle";

import '../../styles/Main.css';
import Dashboard from "./Dashboard";

import { GlobalProvider, useGlobalContext } from "../../../../context/globalContext";


function Home() {

   const { getIncomes, 
           getExpenses
    } = useGlobalContext();

   useEffect(() => {
      console.log("Home UseEffect")
      getIncomes(1)
      getExpenses(1)
   }, [])

   return(
      <main id='main' className='main'>
         <PageTitle page="Home"/>
         <Dashboard />
      </main>
   )
}

export default Home;