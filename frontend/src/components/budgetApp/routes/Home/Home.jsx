import React from "react";
// import components
import PageTitle from "../PageTitle";
import Dashboard from "./Dashboard";
import Footer from "../../Footer.jsx";
// import stylesheet
import '../../styles/Main.css';

// function to render all the various components of home routes
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